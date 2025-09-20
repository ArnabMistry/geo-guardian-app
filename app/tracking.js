import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Animated,
  TextInput,
  Modal,
  ScrollView
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Mock data for demonstration
const mockCurrentLocation = {
  latitude: 26.1445,
  longitude: 91.7362,
  accuracy: 15
};

const mockSafetyZones = [
  { id: 1, type: 'safe', name: 'Tourist Hub Area', coordinates: [[26.1440, 91.7360], [26.1450, 91.7365]] },
  { id: 2, type: 'caution', name: 'Market District', coordinates: [[26.1435, 91.7355], [26.1445, 91.7370]] },
  { id: 3, type: 'danger', name: 'Industrial Zone', coordinates: [[26.1430, 91.7350], [26.1440, 91.7360]] }
];

const mockEmergencyServices = [
  { id: 1, type: 'police', name: 'Guwahati Police Station', distance: '0.8 km', phone: '+91-361-2544644' },
  { id: 2, type: 'hospital', name: 'GMCH Hospital', distance: '1.2 km', phone: '+91-361-2540271' },
  { id: 3, type: 'fire', name: 'Fire Station', distance: '1.5 km', phone: '+91-361-2547222' }
];

const mockRecentAlerts = [
  { id: 1, type: 'traffic', message: 'Heavy traffic reported on NH-37', time: '5 min ago' },
  { id: 2, type: 'safety', message: 'Avoid isolated areas after 8 PM', time: '1 hour ago' },
  { id: 3, type: 'weather', message: 'Rain expected in next 2 hours', time: '2 hours ago' }
];

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
    safetyZones: true,
    policeStations: false
  });
  const [bottomSheetHeight, setBottomSheetHeight] = useState(200);
  const [currentArea] = useState({
    name: 'Paltan Bazaar, Guwahati',
    safetyLevel: 'Safe',
    safetyScore: 78
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Bottom sheet animation
    Animated.timing(bottomSheetAnim, {
      toValue: 0,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLayerToggle = (layer) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleMyLocation = () => {
    console.log('Center on user location');
  };

  const getSafetyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'safe': return '#10B981';
      case 'caution': return '#F59E0B';
      case 'danger': return '#EF4444';
      default: return '#6B7280';
    }
  };

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Mock Map */}
        <View style={styles.mockMap}>
          <Text style={styles.mapLabel}>Interactive Map View</Text>
          <Text style={styles.mapSubLabel}>Current Location: {currentArea.name}</Text>
          
          {/* Current Location Pin */}
          <View style={styles.currentLocationPin}>
            <View style={styles.accuracyCircle} />
            <View style={styles.locationDot} />
          </View>

          {/* Safety Zone Overlays */}
          {activeLayers.safetyZones && mockSafetyZones.map((zone) => (
            <View 
              key={zone.id} 
              style={[
                styles.safetyZoneOverlay, 
                styles[`${zone.type}Zone`]
              ]}
            >
              <Text style={styles.zoneLabel}>{zone.name}</Text>
            </View>
          ))}

          {/* Traffic Layer */}
          {activeLayers.traffic && (
            <View style={styles.trafficOverlay}>
              <Text style={styles.trafficLabel}>Heavy Traffic</Text>
            </View>
          )}

          {/* Police Stations */}
          {activeLayers.policeStations && (
            <View style={styles.policeMarker}>
              <Text style={styles.markerIcon}>👮</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
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
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchText('')}
            >
              <View style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Layer Toggle Button */}
      <Animated.View 
        style={[
          styles.layerToggleContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.layerToggleButton}
          onPress={() => setShowLayers(true)}
        >
          <View style={styles.layerIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* My Location Button */}
      <Animated.View 
        style={[
          styles.myLocationContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.myLocationButton}
          onPress={handleMyLocation}
        >
          <View style={styles.locationIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: bottomSheetAnim }]
          }
        ]}
      >
        <View style={styles.bottomSheetHandle} />
        
        <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
          {/* Current Area Safety Info */}
          <View style={styles.currentAreaSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Area</Text>
              <View style={[styles.safetyBadge, { backgroundColor: getSafetyColor(currentArea.safetyLevel) }]}>
                <Text style={styles.safetyBadgeText}>{currentArea.safetyLevel}</Text>
              </View>
            </View>
            
            <Text style={styles.areaName}>{currentArea.name}</Text>
            <View style={styles.safetyScoreContainer}>
              <Text style={styles.safetyScoreLabel}>Safety Score</Text>
              <Text style={styles.safetyScoreValue}>{currentArea.safetyScore}/100</Text>
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

      {/* Layer Selection Modal */}
      <Modal
        visible={showLayers}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLayers(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.layerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Map Layers</Text>
              <TouchableOpacity onPress={() => setShowLayers(false)}>
                <View style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.layerOptions}>
              <TouchableOpacity 
                style={styles.layerOption}
                onPress={() => handleLayerToggle('traffic')}
              >
                <View style={styles.layerOptionContent}>
                  <View style={styles.layerOptionIcon} />
                  <Text style={styles.layerOptionText}>Traffic</Text>
                </View>
                <View style={[styles.toggle, activeLayers.traffic && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, activeLayers.traffic && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.layerOption}
                onPress={() => handleLayerToggle('safetyZones')}
              >
                <View style={styles.layerOptionContent}>
                  <View style={[styles.layerOptionIcon, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.layerOptionText}>Safety Zones</Text>
                </View>
                <View style={[styles.toggle, activeLayers.safetyZones && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, activeLayers.safetyZones && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.layerOption}
                onPress={() => handleLayerToggle('policeStations')}
              >
                <View style={styles.layerOptionContent}>
                  <View style={[styles.layerOptionIcon, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.layerOptionText}>Police Stations</Text>
                </View>
                <View style={[styles.toggle, activeLayers.policeStations && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, activeLayers.policeStations && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Map
  mapContainer: {
    flex: 1,
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  mapSubLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  currentLocationPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  accuracyCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  locationDot: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Safety Zones
  safetyZoneOverlay: {
    position: 'absolute',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeZone: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: 'rgba(16, 185, 129, 0.6)',
    borderWidth: 2,
    top: '20%',
    left: '20%',
    width: 120,
    height: 80,
  },
  cautionZone: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: 'rgba(245, 158, 11, 0.6)',
    borderWidth: 2,
    top: '60%',
    right: '20%',
    width: 100,
    height: 60,
  },
  dangerZone: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
    borderWidth: 2,
    bottom: '20%',
    left: '10%',
    width: 90,
    height: 70,
  },
  zoneLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },

  // Traffic and other overlays
  trafficOverlay: {
    position: 'absolute',
    top: '30%',
    right: '30%',
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trafficLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
  },
  policeMarker: {
    position: 'absolute',
    top: '40%',
    left: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerIcon: {
    fontSize: 16,
  },

  // Search Bar
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#9CA3AF',
    borderRadius: 10,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#9CA3AF',
    borderRadius: 8,
  },

  // Layer Toggle
  layerToggleContainer: {
    position: 'absolute',
    top: 130,
    right: 16,
  },
  layerToggleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  layerIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },

  // My Location Button
  myLocationContainer: {
    position: 'absolute',
    bottom: 240,
    right: 16,
  },
  myLocationButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    maxHeight: height * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Sections
  currentAreaSection: {
    marginBottom: 24,
  },
  emergencySection: {
    marginBottom: 24,
  },
  alertsSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  safetyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  areaName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  safetyScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  safetyScoreLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  safetyScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  // Services List
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  serviceIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDistance: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 8,
  },
  phoneIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  // Alerts List
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 16,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Layer Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  layerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
  },
  layerOptions: {
    gap: 16,
  },
  layerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  layerOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  layerOptionIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#6B7280',
    borderRadius: 4,
    marginRight: 16,
  },
  layerOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  toggle: {
    width: 48,
    height: 28,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});