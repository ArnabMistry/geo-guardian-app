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
  View,
  useColorScheme,
  Alert,
  Linking
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Configuration
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE'; // Replace with your API key
const BOTTOM_SHEET_MIN_HEIGHT = 200;
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.7;

// Emergency contacts
const EMERGENCY_CONTACTS = {
  police: '100',
  ambulance: '108', 
  fire: '101',
  disaster: '1070'
};

// Map styles
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

const lightMapStyle = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", stylers: [{ visibility: "on" }] },
  { featureType: "poi.school", stylers: [{ visibility: "on" }] },
  { featureType: "poi.medical", stylers: [{ visibility: "on" }] }
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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // State management
  const [searchText, setSearchText] = useState('');
  const [showLayers, setShowLayers] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    dangerZones: true,
    policeStations: false,
    hospitals: false,
    safeZones: true
  });
  
  // Location and map state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 26.1445,
    longitude: 91.7362,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  
  // Data state
  const [dangerZones, setDangerZones] = useState([]);
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentArea, setCurrentArea] = useState({
    name: 'Searching location...',
    dangerScore: 0
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Bottom sheet and UI state
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // Refs
  const scrollViewRef = useRef(null);
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetAnim = useRef(new Animated.Value(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT)).current;

  // Location services
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Geo Guardian needs location access to provide safety monitoring and emergency services.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });
      
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(newLocation);
      
      const newRegion = {
        ...newLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      
      setMapRegion(newRegion);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
      
      // Get area information
      await getAreaInfo(newLocation);
      
      // Load nearby data
      await loadNearbyData(newLocation);
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error', 
        'Unable to get your current location. Please check your GPS settings and try again.',
        [
          { text: 'Retry', onPress: getCurrentLocation },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Get area information using reverse geocoding
  const getAreaInfo = async (location) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const locality = addressComponents.find(comp => comp.types.includes('locality'));
        const sublocality = addressComponents.find(comp => comp.types.includes('sublocality'));
        
        const areaName = sublocality ? 
          `${sublocality.long_name}, ${locality?.long_name || 'Unknown'}` :
          locality?.long_name || 'Unknown Location';
          
        // Calculate danger score based on area (this would normally come from a safety database)
        const dangerScore = calculateDangerScore(areaName);
        
        setCurrentArea({
          name: areaName,
          dangerScore
        });
      }
    } catch (error) {
      console.error('Error getting area info:', error);
      setCurrentArea({
        name: 'Unknown Location',
        dangerScore: 50
      });
    }
  };

  // Calculate danger score (mock implementation - would use real crime data)
  const calculateDangerScore = (areaName) => {
    const safeAreas = ['Dispur', 'Guwahati University', 'Fancy Bazaar'];
    const moderateAreas = ['Paltan Bazaar', 'Pan Bazaar', 'Ulubari'];
    const riskAreas = ['Jalukbari', 'Khanapara', 'Beltola'];
    
    if (safeAreas.some(area => areaName.includes(area))) return Math.floor(Math.random() * 30) + 10;
    if (moderateAreas.some(area => areaName.includes(area))) return Math.floor(Math.random() * 40) + 30;
    if (riskAreas.some(area => areaName.includes(area))) return Math.floor(Math.random() * 30) + 60;
    return Math.floor(Math.random() * 50) + 25;
  };

  // Load nearby emergency services and danger zones
  const loadNearbyData = async (location) => {
    try {
      // Load emergency services using Google Places API
      const services = await Promise.all([
        searchNearbyPlaces(location, 'police'),
        searchNearbyPlaces(location, 'hospital'),
        searchNearbyPlaces(location, 'fire_station')
      ]);
      
      const allServices = services.flat();
      setEmergencyServices(allServices);
      
      // Load danger zones (this would come from a crime database)
      const zones = generateNearbyDangerZones(location);
      setDangerZones(zones);
      
      // Load recent alerts (this would come from a real-time alert system)
      const alerts = await loadRecentAlerts(location);
      setRecentAlerts(alerts);
      
    } catch (error) {
      console.error('Error loading nearby data:', error);
    }
  };

  // Search nearby places using Google Places API
  const searchNearbyPlaces = async (location, type) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&type=${type}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      return data.results?.slice(0, 5).map(place => ({
        id: place.place_id,
        type: type === 'fire_station' ? 'fire' : type === 'hospital' ? 'hospital' : 'police',
        name: place.name,
        distance: calculateDistance(location, place.geometry.location),
        coordinate: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        phone: place.formatted_phone_number || EMERGENCY_CONTACTS[type] || '911',
        rating: place.rating || 0,
        isOpen: place.opening_hours?.open_now || true
      })) || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.latitude) * Math.PI / 180;
    const dLng = (point2.lng - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  };

  // Generate nearby danger zones (mock implementation)
  const generateNearbyDangerZones = (location) => {
    const zones = [];
    for (let i = 0; i < 5; i++) {
      const offset = 0.01;
      const zone = {
        id: `zone_${i}`,
        name: `Risk Area ${i + 1}`,
        coordinate: {
          latitude: location.latitude + (Math.random() - 0.5) * offset,
          longitude: location.longitude + (Math.random() - 0.5) * offset
        },
        radius: 200 + Math.random() * 300,
        dangerScore: Math.floor(Math.random() * 80) + 20,
        type: Math.random() > 0.5 ? 'crime' : 'accident'
      };
      zones.push(zone);
    }
    return zones;
  };

  // Load recent alerts (mock implementation)
  const loadRecentAlerts = async (location) => {
    const alerts = [
      {
        id: 1,
        type: 'traffic',
        title: 'Heavy Traffic Alert',
        message: 'Congestion reported on GS Road near Ganeshguri',
        time: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
        priority: 'medium',
        distance: '1.2 km'
      },
      {
        id: 2,
        type: 'safety',
        title: 'Safety Advisory',
        message: 'Avoid isolated areas after 9 PM in this region',
        time: new Date(Date.now() - 60 * 60000).toLocaleTimeString(),
        priority: 'high',
        distance: '0.8 km'
      },
      {
        id: 3,
        type: 'weather',
        title: 'Weather Warning',
        message: 'Heavy rainfall expected in next 2 hours',
        time: new Date(Date.now() - 90 * 60000).toLocaleTimeString(),
        priority: 'low',
        distance: 'City-wide'
      }
    ];
    return alerts;
  };

  // Google Places search
  const searchGooglePlaces = async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${currentLocation?.latitude || 26.1445},${currentLocation?.longitude || 91.7362}&radius=50000&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      return data.results?.slice(0, 10).map(place => ({
        id: place.place_id,
        title: place.name,
        subtitle: place.formatted_address,
        coordinate: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        }
      })) || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  // Handle search
  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchGooglePlaces(text);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (result) => {
    const newRegion = {
      latitude: result.coordinate.latitude,
      longitude: result.coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    
    setMapRegion(newRegion);
    setSelectedLocation({
      coordinate: result.coordinate,
      title: result.title,
    });
    
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
    
    setShowSearch(false);
    setSearchResults([]);
    setSearchText('');
  };

  // Emergency call handler
  const handleEmergencyCall = (type) => {
    const number = EMERGENCY_CONTACTS[type];
    Alert.alert(
      'Emergency Call',
      `Call ${type.toUpperCase()} (${number})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${number}`),
          style: 'destructive'
        }
      ]
    );
  };

  // Service call handler
  const handleServiceCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  // Pan responder for bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        if (scrollViewRef.current && isBottomSheetExpanded) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dy } = gestureState;
        const currentValue = bottomSheetAnim._value;
        let newValue = currentValue + dy;
        
        const minPosition = 0;
        const maxPosition = BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT;
        
        if (newValue < minPosition) newValue = minPosition;
        if (newValue > maxPosition) newValue = maxPosition;
        
        bottomSheetAnim.setValue(newValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { vy } = gestureState;
        const currentValue = bottomSheetAnim._value;
        
        const minPosition = 0;
        const maxPosition = BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT;
        const midPoint = (minPosition + maxPosition) / 2;
        
        let targetPosition;
        if (Math.abs(vy) > 0.5) {
          targetPosition = vy > 0 ? maxPosition : minPosition;
        } else {
          targetPosition = currentValue > midPoint ? maxPosition : minPosition;
        }
        
        Animated.spring(bottomSheetAnim, {
          toValue: targetPosition,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
        
        setIsBottomSheetExpanded(targetPosition === minPosition);
      },
    })
  ).current;

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
      StatusBar.setBackgroundColor(isDarkMode ? '#1F2937' : '#FFFFFF');

      // Load saved settings
      try {
        const savedLayers = await AsyncStorage.getItem('activeLayers');
        if (savedLayers) {
          setActiveLayers(JSON.parse(savedLayers));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }

      // Get current location
      await getCurrentLocation();

      // Start animations
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      bottomSheetAnim.setValue(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT);
    };

    initializeApp();
  }, [isDarkMode]);

  // Save settings when layers change
  useEffect(() => {
    AsyncStorage.setItem('activeLayers', JSON.stringify(activeLayers)).catch(console.error);
  }, [activeLayers]);

  // Utility functions
  const handleLayerToggle = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleMapTypeChange = () => {
    const types = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
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

  const getDangerColor = (score, alpha = 0.3) => {
    if (score <= 33) return `rgba(16,185,129,${alpha})`;
    if (score <= 66) return `rgba(251,191,36,${alpha})`;
    return `rgba(239,68,68,${alpha})`;
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'police': return 'shield-outline';
      case 'hospital': return 'medical-outline';
      case 'fire': return 'flame-outline';
      default: return 'location-outline';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'traffic': return 'car-outline';
      case 'safety': return 'warning-outline';
      case 'weather': return 'cloudy-outline';
      default: return 'megaphone-outline';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsTraffic={activeLayers.traffic}
          mapType={mapType}
          customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
          showsCompass={true}
          showsScale={true}
          rotateEnabled={true}
          pitchEnabled={true}
          followsUserLocation={false}
          showsBuildings={true}
        >
          {/* Danger Zones */}
          {activeLayers.dangerZones && dangerZones.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.coordinate}
              radius={zone.radius}
              strokeColor={getDangerColor(zone.dangerScore, 0.8)}
              fillColor={getDangerColor(zone.dangerScore, 0.2)}
              strokeWidth={2}
            />
          ))}

          {/* Emergency Services */}
          {activeLayers.policeStations && emergencyServices
            .filter(service => service.type === 'police')
            .map((service) => (
              <Marker
                key={service.id}
                coordinate={service.coordinate}
                title={service.name}
                description={`${service.distance} • ${service.isOpen ? 'Open' : 'Closed'}`}
                pinColor="#3B82F6"
              />
            ))}

          {activeLayers.hospitals && emergencyServices
            .filter(service => service.type === 'hospital')
            .map((service) => (
              <Marker
                key={service.id}
                coordinate={service.coordinate}
                title={service.name}
                description={`${service.distance} • ${service.isOpen ? 'Open' : 'Closed'}`}
                pinColor="#EF4444"
              />
            ))}

          {/* Selected Location */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation.coordinate}
              title={selectedLocation.title}
              pinColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
            />
          )}
        </MapView>
      </View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.searchBar} onPress={() => setShowSearch(true)}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <Text style={styles.searchPlaceholder}>Search location or address</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Map Controls */}
      <Animated.View style={[styles.mapControlsContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowLayers(true)}>
          <Ionicons name="layers-outline" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={handleMapTypeChange}>
          <Ionicons 
            name={mapType === 'standard' ? 'map-outline' : mapType === 'satellite' ? 'globe-outline' : 'earth-outline'} 
            size={24} 
            color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Emergency Button */}
      <Animated.View style={[styles.emergencyContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={() => setShowEmergencyModal(true)}
          onLongPress={() => handleEmergencyCall('police')}
        >
          <Ionicons name="warning" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* My Location */}
      <Animated.View style={[styles.myLocationContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.myLocationButton} onPress={getCurrentLocation}>
          <Ionicons name={isLocationLoading ? 'refresh' : 'locate'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            height: BOTTOM_SHEET_MAX_HEIGHT,
            transform: [{ translateY: bottomSheetAnim }]
          }
        ]}
      >
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={styles.bottomSheetHandle} />
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={isBottomSheetExpanded ? collapseBottomSheet : expandBottomSheet}
          >
            <Ionicons 
              name={isBottomSheetExpanded ? 'chevron-down' : 'chevron-up'} 
              size={20} 
              color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.bottomSheetContent} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={isBottomSheetExpanded}
        >
          {/* Current Area */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Area</Text>
              <View style={[styles.statusBadge, { backgroundColor: getDangerColor(currentArea.dangerScore, 1) }]}>
                <Text style={styles.statusText}>
                  {currentArea.dangerScore <= 33 ? 'SAFE' : currentArea.dangerScore <= 66 ? 'MODERATE' : 'HIGH RISK'}
                </Text>
              </View>
            </View>
            <Text style={styles.areaName}>{currentArea.name}</Text>
            <View style={styles.safetyScoreContainer}>
              <Text style={styles.safetyScoreLabel}>Safety Score</Text>
              <Text style={styles.safetyScoreValue}>{100 - currentArea.dangerScore}/100</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: '#EF4444' }]}
                onPress={() => handleEmergencyCall('police')}
              >
                <Ionicons name="shield-outline" size={24} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Police</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: '#F59E0B' }]}
                onPress={() => handleEmergencyCall('ambulance')}
              >
                <Ionicons name="medical-outline" size={24} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Ambulance</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: '#10B981' }]}
                onPress={() => {
                  if (currentLocation) {
                    const message = `Emergency! I need help. My location: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`;
                    Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
                  }
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Alert Contacts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickActionButton, { backgroundColor: '#8B5CF6' }]}
                onPress={() => {
                  if (currentLocation) {
                    Linking.openURL(`https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`);
                  }
                }}
              >
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Share Location</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Emergency Services</Text>
            <View style={styles.servicesList}>
              {emergencyServices.slice(0, 5).map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceItem}>
                  <View style={[styles.serviceIconContainer, { backgroundColor: service.type === 'police' ? '#3B82F6' : service.type === 'hospital' ? '#EF4444' : '#F59E0B' }]}>
                    <Ionicons name={getServiceIcon(service.type)} size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.serviceDetails}>
                      <Text style={styles.serviceDistance}>{service.distance}</Text>
                      <View style={styles.serviceDivider} />
                      <Text style={[styles.serviceStatus, { color: service.isOpen ? '#10B981' : '#EF4444' }]}>
                        {service.isOpen ? 'Open' : 'Closed'}
                      </Text>
                      {service.rating > 0 && (
                        <>
                          <View style={styles.serviceDivider} />
                          <Ionicons name="star" size={12} color="#F59E0B" />
                          <Text style={styles.serviceRating}>{service.rating.toFixed(1)}</Text>
                        </>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleServiceCall(service.phone)}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              
              {emergencyServices.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="location-outline" size={48} color={isDarkMode ? '#4B5563' : '#D1D5DB'} />
                  <Text style={styles.emptyStateText}>Loading emergency services...</Text>
                </View>
              )}
            </View>
          </View>

          {/* Recent Alerts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <View style={styles.alertsList}>
              {recentAlerts.map((alert) => (
                <View key={alert.id} style={[styles.alertItem, { borderLeftColor: getPriorityColor(alert.priority) }]}>
                  <View style={[styles.alertIconContainer, { backgroundColor: getPriorityColor(alert.priority) }]}>
                    <Ionicons name={getAlertIcon(alert.type)} size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertDistance}>{alert.distance}</Text>
                    </View>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                </View>
              ))}
              
              {recentAlerts.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={48} color={isDarkMode ? '#4B5563' : '#D1D5DB'} />
                  <Text style={styles.emptyStateText}>No recent alerts in your area</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Search Modal */}
      <Modal visible={showSearch} transparent animationType="slide" onRequestClose={() => setShowSearch(false)}>
        <View style={styles.searchModalOverlay}>
          <SafeAreaView style={styles.searchModalContainer}>
            <View style={styles.searchModalHeader}>
              <TouchableOpacity 
                onPress={() => { 
                  setShowSearch(false); 
                  setSearchResults([]); 
                  setSearchText(''); 
                }} 
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
              <Text style={styles.searchModalTitle}>Search Location</Text>
            </View>
            
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 12 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for places, addresses..."
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={searchText}
                onChangeText={handleSearch}
                autoFocus
                returnKeyType="search"
              />
              {isSearching && (
                <Ionicons name="refresh" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              )}
            </View>
            
            <ScrollView style={styles.searchResultsList} keyboardShouldPersistTaps="handled">
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.searchResultItem}
                  onPress={() => handleLocationSelect(result)}
                >
                  <Ionicons name="location-outline" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <View style={styles.searchResultContent}>
                    <Text style={styles.searchResultTitle}>{result.title}</Text>
                    <Text style={styles.searchResultSubtitle}>{result.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              {searchText.length > 2 && !isSearching && searchResults.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color={isDarkMode ? '#4B5563' : '#D1D5DB'} />
                  <Text style={styles.emptyStateText}>No results found for "{searchText}"</Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Emergency Modal */}
      <Modal visible={showEmergencyModal} transparent animationType="fade" onRequestClose={() => setShowEmergencyModal(false)}>
        <View style={styles.emergencyModalOverlay}>
          <View style={styles.emergencyModalContainer}>
            <View style={styles.emergencyModalHeader}>
              <Ionicons name="warning" size={32} color="#EF4444" />
              <Text style={styles.emergencyModalTitle}>Emergency Services</Text>
              <TouchableOpacity onPress={() => setShowEmergencyModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.emergencyButtons}>
              <TouchableOpacity 
                style={[styles.emergencyServiceButton, { backgroundColor: '#EF4444' }]}
                onPress={() => {
                  setShowEmergencyModal(false);
                  handleEmergencyCall('police');
                }}
              >
                <Ionicons name="shield-outline" size={32} color="#FFFFFF" />
                <Text style={styles.emergencyServiceText}>Police</Text>
                <Text style={styles.emergencyServiceNumber}>100</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.emergencyServiceButton, { backgroundColor: '#F59E0B' }]}
                onPress={() => {
                  setShowEmergencyModal(false);
                  handleEmergencyCall('ambulance');
                }}
              >
                <Ionicons name="medical-outline" size={32} color="#FFFFFF" />
                <Text style={styles.emergencyServiceText}>Ambulance</Text>
                <Text style={styles.emergencyServiceNumber}>108</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.emergencyServiceButton, { backgroundColor: '#DC2626' }]}
                onPress={() => {
                  setShowEmergencyModal(false);
                  handleEmergencyCall('fire');
                }}
              >
                <Ionicons name="flame-outline" size={32} color="#FFFFFF" />
                <Text style={styles.emergencyServiceText}>Fire Brigade</Text>
                <Text style={styles.emergencyServiceNumber}>101</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.emergencyServiceButton, { backgroundColor: '#7C3AED' }]}
                onPress={() => {
                  setShowEmergencyModal(false);
                  handleEmergencyCall('disaster');
                }}
              >
                <Ionicons name="warning-outline" size={32} color="#FFFFFF" />
                <Text style={styles.emergencyServiceText}>Disaster Mgmt</Text>
                <Text style={styles.emergencyServiceNumber}>1070</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Layer Modal */}
      <Modal visible={showLayers} transparent animationType="slide" onRequestClose={() => setShowLayers(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.layerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Map Layers</Text>
              <TouchableOpacity onPress={() => setShowLayers(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>

            <View style={styles.layerOptions}>
              {Object.entries(activeLayers).map(([layer, isActive]) => (
                <TouchableOpacity key={layer} style={styles.layerOption} onPress={() => handleLayerToggle(layer)}>
                  <View style={styles.layerOptionContent}>
                    <Ionicons
                      name={
                        layer === 'traffic' ? 'car-outline' :
                        layer === 'dangerZones' ? 'warning-outline' : 
                        layer === 'policeStations' ? 'shield-outline' :
                        layer === 'hospitals' ? 'medical-outline' :
                        'checkmark-circle-outline'
                      }
                      size={20}
                      color={
                        layer === 'traffic' ? '#F59E0B' :
                        layer === 'dangerZones' ? '#EF4444' : 
                        layer === 'policeStations' ? '#3B82F6' :
                        layer === 'hospitals' ? '#EF4444' :
                        '#10B981'
                      }
                      style={{ marginRight: 16 }}
                    />
                    <Text style={styles.layerOptionText}>
                      {layer === 'traffic' ? 'Traffic' : 
                       layer === 'dangerZones' ? 'Danger Zones' : 
                       layer === 'policeStations' ? 'Police Stations' :
                       layer === 'hospitals' ? 'Hospitals' :
                       'Safe Zones'}
                    </Text>
                  </View>
                  <View style={[styles.toggle, isActive && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
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

const getStyles = (isDarkMode) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' 
  },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  
  // Search Bar
  searchContainer: { 
    position: 'absolute', 
    top: 60, 
    left: 16, 
    right: 16 
  },
  searchBar: { 
    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF', 
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
    gap: 12,
  },
  searchPlaceholder: { 
    flex: 1, 
    fontSize: 16, 
    color: isDarkMode ? '#9CA3AF' : '#6B7280' 
  },
  
  // Map Controls
  mapControlsContainer: { 
    position: 'absolute', 
    top: 130, 
    right: 16,
    gap: 8
  },
  controlButton: { 
    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF', 
    borderRadius: 12, 
    padding: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Emergency Button
  emergencyContainer: {
    position: 'absolute',
    top: 130,
    left: 16,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // My Location
  myLocationContainer: { 
    position: 'absolute', 
    bottom: 220, 
    right: 16 
  },
  myLocationButton: { 
    backgroundColor: '#3B82F6', 
    borderRadius: 12, 
    padding: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  
  // Bottom Sheet
  bottomSheet: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', 
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
    justifyContent: 'center',
    width: '100%',
  },
  bottomSheetHandle: { 
    width: 40, 
    height: 4, 
    backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB', 
    borderRadius: 2 
  },
  expandButton: {
    position: 'absolute',
    right: 20,
    padding: 8
  },
  bottomSheetContent: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 8
  },
  
  // Sections
  section: { marginBottom: 24 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: isDarkMode ? '#F9FAFB' : '#111827' 
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  areaName: { 
    fontSize: 16, 
    color: isDarkMode ? '#9CA3AF' : '#6B7280', 
    marginBottom: 12 
  },
  safetyScoreContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB', 
    padding: 16, 
    borderRadius: 12 
  },
  safetyScoreLabel: { 
    fontSize: 14, 
    color: isDarkMode ? '#9CA3AF' : '#6B7280' 
  },
  safetyScoreValue: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: isDarkMode ? '#F9FAFB' : '#111827' 
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Services
  servicesList: { gap: 12 },
  serviceItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB', 
    padding: 16, 
    borderRadius: 12 
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: { flex: 1 },
  serviceName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: isDarkMode ? '#F9FAFB' : '#111827', 
    marginBottom: 4 
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceDistance: { 
    fontSize: 14, 
    color: isDarkMode ? '#9CA3AF' : '#6B7280' 
  },
  serviceDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB',
  },
  serviceStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  serviceRating: {
    fontSize: 14,
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
    marginLeft: 2,
  },
  callButton: { 
    backgroundColor: '#10B981', 
    borderRadius: 8, 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Alerts
  alertsList: { gap: 12 },
  alertItem: { 
    flexDirection: 'row', 
    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB', 
    padding: 16, 
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: { flex: 1 },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#F9FAFB' : '#111827',
  },
  alertDistance: {
    fontSize: 12,
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
  },
  alertMessage: { 
    fontSize: 14, 
    color: isDarkMode ? '#E5E7EB' : '#374151', 
    marginBottom: 4 
  },
  alertTime: { 
    fontSize: 12, 
    color: isDarkMode ? '#9CA3AF' : '#6B7280' 
  },
  
  // Empty States
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
    textAlign: 'center',
  },
  
  // Search Modal
  searchModalOverlay: { 
    flex: 1, 
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' 
  },
  searchModalContainer: { 
    flex: 1 
  },
  searchModalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB',
    gap: 8,
  },
  backButton: { 
    padding: 8,
  },
  searchModalTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: isDarkMode ? '#F9FAFB' : '#111827' 
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDarkMode ? '#FFFFFF' : '#000000',
  },
  searchResultsList: {
    flex: 1,
    padding: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB',
    gap: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    marginBottom: 4,
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
  },
  
  // Emergency Modal
  emergencyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyModalContainer: {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '100%',
  },
  emergencyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  emergencyModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    flex: 1,
    textAlign: 'center',
  },
  emergencyButtons: {
    gap: 16,
  },
  emergencyServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  emergencyServiceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  emergencyServiceNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Layer Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end' 
  },
  layerModal: { 
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    padding: 24 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: isDarkMode ? '#F9FAFB' : '#111827' 
  },
  layerOptions: { gap: 16 },
  layerOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  layerOptionContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  layerOptionText: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: isDarkMode ? '#F9FAFB' : '#111827' 
  },
  toggle: { 
    width: 48, 
    height: 28, 
    backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB', 
    borderRadius: 14, 
    justifyContent: 'center', 
    paddingHorizontal: 2 
  },
  toggleActive: { 
    backgroundColor: '#10B981' 
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
    elevation: 2 
  },
  toggleThumbActive: { 
    alignSelf: 'flex-end' 
  },
});