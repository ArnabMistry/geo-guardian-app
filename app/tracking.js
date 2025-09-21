import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Circle, Marker } from 'react-native-maps';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Bottom sheet positions
const BOTTOM_SHEET_MIN_HEIGHT = 200; // Collapsed state - always visible
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.7; // Expanded state
const SNAP_THRESHOLD = 50; // Distance to snap to open/closed

// Base user location
const userBaseLocation = {
  latitude: 26.1445,
  longitude: 91.7362,
};

// Mock data: AI-generated danger scores (0 = safe, 100 = extremely dangerous)
const mockDangerZones = [
  { id: 1, name: 'Tourist Hub Area', coordinates: [[26.1440, 91.7360]], dangerScore: 20 },
  { id: 2, name: 'Market District', coordinates: [[26.1435, 91.7355]], dangerScore: 55 },
  { id: 3, name: 'Industrial Zone', coordinates: [[26.1430, 91.7350]], dangerScore: 80 }
];

// Mock Emergency Services
const mockEmergencyServices = [
  { id: 1, type: 'police', name: 'Guwahati Police Station', distance: '0.8 km', phone: '+91-361-2544644' },
  { id: 2, type: 'hospital', name: 'GMCH Hospital', distance: '1.2 km', phone: '+91-361-2540271' },
  { id: 3, type: 'fire', name: 'Fire Station', distance: '1.5 km', phone: '+91-361-2547222' }
];

// Mock Recent Alerts
const mockRecentAlerts = [
  { id: 1, type: 'traffic', message: 'Heavy traffic reported on NH-37', time: '5 min ago' },
  { id: 2, type: 'safety', message: 'Avoid isolated areas after 8 PM', time: '1 hour ago' },
  { id: 3, type: 'weather', message: 'Rain expected in next 2 hours', time: '2 hours ago' }
];

// Convert dangerScore to color gradient (green → yellow → red)
const getDangerColor = (score) => {
  if (score <= 33) return `rgba(16,185,129,${0.2 + score/100})`; // Green shades
  if (score <= 66) return `rgba(251,191,36,${0.2 + score/100})`; // Yellow shades
  return `rgba(239,68,68,${0.2 + score/100})`; // Red shades
};

// Icons
const getServiceIcon = (type) => {
  switch (type) {
    case 'police': return '👮';
    case 'hospital': return '🏥';
    case 'fire': return '🚒';
    default: return '📍';
  }
};

const getAlertIcon = (type) => {
  switch (type) {
    case 'traffic': return '🚗';
    case 'safety': return '⚠️';
    case 'weather': return '🌤️';
    default: return '📢';
  }
};

export default function LiveTracking() {
  return (
    <SafeAreaProvider>
      <LiveTrackingContent />
    </SafeAreaProvider>
  );
}

function LiveTrackingContent() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    traffic: false,
    dangerZones: true,
    policeStations: false
  });
  const [currentArea] = useState({
    name: 'Paltan Bazaar, Guwahati',
    dangerScore: 42
  });

  // Bottom sheet state
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const scrollViewRef = useRef(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetAnim = useRef(new Animated.Value(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT)).current;

  // Pan Responder for bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },

      onPanResponderGrant: (evt, gestureState) => {
        // Reset scroll position when starting to drag the bottom sheet
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const { dy } = gestureState;
        const currentValue = bottomSheetAnim._value;
        const newValue = currentValue + dy;

        // Constrain the movement within bounds
        const minPosition = 0; // Fully expanded
        const maxPosition = BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT; // Collapsed
        
        if (newValue >= minPosition && newValue <= maxPosition) {
          bottomSheetAnim.setValue(newValue);
        }
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState;
        const currentValue = bottomSheetAnim._value;
        
        // Determine target position based on gesture
        let targetPosition;
        const minPosition = 0; // Fully expanded
        const maxPosition = BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT; // Collapsed
        const midPoint = (minPosition + maxPosition) / 2;

        // If velocity is high enough, use velocity to determine direction
        if (Math.abs(vy) > 0.5) {
          targetPosition = vy > 0 ? maxPosition : minPosition;
        } else {
          // Otherwise, snap to nearest position
          targetPosition = currentValue > midPoint ? maxPosition : minPosition;
        }

        // Animate to target position
        Animated.spring(bottomSheetAnim, {
          toValue: targetPosition,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();

        // Update expanded state
        setIsBottomSheetExpanded(targetPosition === minPosition);
      },
    })
  ).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Initial bottom sheet position (collapsed)
    bottomSheetAnim.setValue(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT);
  }, []);

  const handleLayerToggle = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleMyLocation = () => {
    console.log('Center on user location');
  };

  const expandBottomSheet = () => {
    Animated.spring(bottomSheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    setIsBottomSheetExpanded(true);
  };

  const collapseBottomSheet = () => {
    Animated.spring(bottomSheetAnim, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    setIsBottomSheetExpanded(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userBaseLocation.latitude,
            longitude: userBaseLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Danger Zones */}
          {activeLayers.dangerZones &&
            mockDangerZones.map((zone) => (
              <Circle
                key={zone.id}
                center={{
                  latitude: zone.coordinates[0][0],
                  longitude: zone.coordinates[0][1],
                }}
                radius={200}
                strokeColor={getDangerColor(zone.dangerScore)}
                fillColor={getDangerColor(zone.dangerScore)}
              />
            ))}
        </MapView>
      </View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location or address"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <View style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Layer Toggle */}
      <Animated.View style={[styles.layerToggleContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.layerToggleButton} onPress={() => setShowLayers(true)}>
          <View style={styles.layerIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* My Location */}
      <Animated.View style={[styles.myLocationContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.myLocationButton} onPress={handleMyLocation}>
          <View style={styles.locationIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* Interactive Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            height: BOTTOM_SHEET_MAX_HEIGHT,
            transform: [{ translateY: bottomSheetAnim }]
          }
        ]}
      >
        {/* Handle Area - Draggable */}
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={styles.bottomSheetHandle} />
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={isBottomSheetExpanded ? collapseBottomSheet : expandBottomSheet}
          >
            <Text style={styles.expandButtonText}>
              {isBottomSheetExpanded ? '▼' : '▲'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.bottomSheetContent} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={isBottomSheetExpanded}
        >
          {/* Current Area */}
          <View style={styles.currentAreaSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Area</Text>
            </View>
            <Text style={styles.areaName}>{currentArea.name}</Text>
            <View style={styles.safetyScoreContainer}>
              <Text style={styles.safetyScoreLabel}>Danger Score</Text>
              <Text style={styles.safetyScoreValue}>{currentArea.dangerScore}/100</Text>
            </View>
          </View>

          {/* Emergency Services */}
          <View style={styles.emergencySection}>
            <Text style={styles.sectionTitle}>Nearby Emergency Services</Text>
            <View style={styles.servicesList}>
              {mockEmergencyServices.map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceItem}>
                  <Text style={styles.serviceIcon}>{getServiceIcon(service.type)}</Text>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDistance}>{service.distance}</Text>
                  </View>
                  <TouchableOpacity style={styles.callButton}>
                    <View style={styles.phoneIcon} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Alerts */}
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <View style={styles.alertsList}>
              {mockRecentAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Layer Modal */}
      <Modal visible={showLayers} transparent animationType="slide" onRequestClose={() => setShowLayers(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.layerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Map Layers</Text>
              <TouchableOpacity onPress={() => setShowLayers(false)}>
                <View style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.layerOptions}>
              {['traffic', 'dangerZones', 'policeStations'].map((layer) => (
                <TouchableOpacity key={layer} style={styles.layerOption} onPress={() => handleLayerToggle(layer)}>
                  <View style={styles.layerOptionContent}>
                    <View style={[styles.layerOptionIcon, layer === 'dangerZones' ? { backgroundColor: '#EF4444' } : layer === 'policeStations' ? { backgroundColor: '#3B82F6' } : {}]} />
                    <Text style={styles.layerOptionText}>
                      {layer === 'traffic' ? 'Traffic' : layer === 'dangerZones' ? 'Danger Zones' : 'Police Stations'}
                    </Text>
                  </View>
                  <View style={[styles.toggle, activeLayers[layer] && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, activeLayers[layer] && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  searchContainer: { position: 'absolute', top: 60, left: 16, right: 16 },
  searchBar: { backgroundColor: '#FFFFFF', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  searchIcon: { width: 20, height: 20, backgroundColor: '#9CA3AF', borderRadius: 10, marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  clearButton: { padding: 4 },
  clearIcon: { width: 16, height: 16, backgroundColor: '#9CA3AF', borderRadius: 8 },
  layerToggleContainer: { position: 'absolute', top: 130, right: 16 },
  layerToggleButton: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  layerIcon: { width: 24, height: 24, backgroundColor: '#6B7280', borderRadius: 4 },
  myLocationContainer: { position: 'absolute', bottom: 220, right: 16 },
  myLocationButton: { backgroundColor: '#3B82F6', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  locationIcon: { width: 24, height: 24, backgroundColor: '#FFFFFF', borderRadius: 4 },
  bottomSheet: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 8 
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bottomSheetHandle: { 
    width: 40, 
    height: 4, 
    backgroundColor: '#D1D5DB', 
    borderRadius: 2 
  },
  expandButton: {
    position: 'absolute',
    right: 20,
    padding: 8
  },
  expandButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600'
  },
  bottomSheetContent: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 8
  },
  currentAreaSection: { marginBottom: 24 },
  emergencySection: { marginBottom: 24 },
  alertsSection: { marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  safetyBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  safetyBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  areaName: { fontSize: 16, color: '#6B7280', marginBottom: 12 },
  safetyScoreContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 },
  safetyScoreLabel: { fontSize: 14, color: '#6B7280' },
  safetyScoreValue: { fontSize: 20, fontWeight: '700', color: '#111827' },
  servicesList: { gap: 12 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 },
  serviceIcon: { fontSize: 24, marginRight: 16 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  serviceDistance: { fontSize: 14, color: '#6B7280' },
  callButton: { backgroundColor: '#10B981', borderRadius: 8, padding: 8 },
  phoneIcon: { width: 16, height: 16, backgroundColor: '#FFFFFF', borderRadius: 2 },
  alertsList: { gap: 12 },
  alertItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 },
  alertIcon: { fontSize: 20, marginRight: 16, marginTop: 2 },
  alertContent: { flex: 1 },
  alertMessage: { fontSize: 14, color: '#111827', marginBottom: 4 },
  alertTime: { fontSize: 12, color: '#6B7280' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  layerModal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  closeIcon: { width: 24, height: 24, backgroundColor: '#D1D5DB', borderRadius: 12 },
  layerOptions: { gap: 16 },
  layerOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  layerOptionContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  layerOptionIcon: { width: 20, height: 20, backgroundColor: '#6B7280', borderRadius: 4, marginRight: 16 },
  layerOptionText: { fontSize: 16, fontWeight: '500', color: '#111827' },
  toggle: { width: 48, height: 28, backgroundColor: '#E5E7EB', borderRadius: 14, justifyContent: 'center', paddingHorizontal: 2 },
  toggleActive: { backgroundColor: '#10B981' },
  toggleThumb: { width: 24, height: 24, backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  toggleThumbActive: { alignSelf: 'flex-end' },
});