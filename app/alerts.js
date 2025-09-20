import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  Switch
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Data Models - Easy to replace with API responses
const ALERT_TYPES = {
  HIGH_RISK: {
    id: 'high_risk',
    name: 'High Risk Area',
    icon: '⚠️',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  RESTRICTED: {
    id: 'restricted',
    name: 'Restricted Zone',
    icon: '🚫',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FED7AA'
  },
  SAFE_ZONE: {
    id: 'safe_zone',
    name: 'Safety Zone',
    icon: '✅',
    color: '#10B981',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  WEATHER: {
    id: 'weather',
    name: 'Weather Alert',
    icon: '🌧️',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE'
  }
};

// Mock data structure - Replace with API calls
const mockAlerts = [
  {
    id: 'alert_001',
    type: 'high_risk',
    title: 'High Crime Rate Area',
    locationName: 'Fancy Bazaar Area',
    description: 'Increased incidents of theft reported in this area. Avoid displaying valuables.',
    distance: 0.3,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    coordinates: { lat: 26.1445, lng: 91.7362 },
    isActive: true,
    severity: 'high'
  },
  {
    id: 'alert_002',
    type: 'weather',
    title: 'Heavy Rain Warning',
    locationName: 'Guwahati City Center',
    description: 'Heavy rainfall expected in next 2 hours. Roads may become waterlogged.',
    distance: 1.2,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    coordinates: { lat: 26.1445, lng: 91.7362 },
    isActive: true,
    severity: 'medium'
  },
  {
    id: 'alert_003',
    type: 'restricted',
    title: 'Military Restricted Area',
    locationName: 'Khanapara Area',
    description: 'Restricted military zone. Entry prohibited for civilians.',
    distance: 2.1,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    coordinates: { lat: 26.1445, lng: 91.7362 },
    isActive: true,
    severity: 'high'
  },
  {
    id: 'alert_004',
    type: 'safe_zone',
    title: 'Tourist Police Station Nearby',
    locationName: 'Paltan Bazaar',
    description: 'You are near a tourist police station. Help is available if needed.',
    distance: 0.1,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    coordinates: { lat: 26.1445, lng: 91.7362 },
    isActive: true,
    severity: 'low'
  }
];

// Default settings - Can be loaded from AsyncStorage or API
const defaultSettings = {
  alertTypes: {
    high_risk: true,
    restricted: true,
    safe_zone: true,
    weather: true
  },
  notifications: {
    sound: true,
    vibration: true,
    pushNotifications: true
  },
  distanceThreshold: 1.0 // kilometers
};

export default function GeofenceAlertsScreen() {
  return (
    <SafeAreaProvider>
      <GeofenceAlertsContent />
    </SafeAreaProvider>
  );
}

function GeofenceAlertsContent() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [settings, setSettings] = useState(defaultSettings);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Load settings from storage on mount
    loadSettings();
    
    // Set up real-time alert listener
    setupAlertListener();
  }, []);

  // Backend Integration Functions
  const loadSettings = async () => {
    try {
      // Replace with actual API call or AsyncStorage
      // const storedSettings = await AsyncStorage.getItem('geofence_settings');
      // if (storedSettings) {
      //   setSettings(JSON.parse(storedSettings));
      // }
      console.log('Loading settings from storage...');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      // Replace with actual API call or AsyncStorage
      // await AsyncStorage.setItem('geofence_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      console.log('Settings saved:', newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      setIsRefreshing(true);
      // Replace with actual API call
      // const response = await fetch('/api/geofence-alerts');
      // const data = await response.json();
      // setAlerts(data.alerts);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Fetching latest alerts...');
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setIsRefreshing(false);
    }
  };

  const setupAlertListener = () => {
    // Set up WebSocket or real-time listener
    // const ws = new WebSocket('ws://your-api/geofence-alerts');
    // ws.onmessage = (event) => {
    //   const newAlert = JSON.parse(event.data);
    //   handleNewAlert(newAlert);
    // };
    console.log('Setting up real-time alert listener...');
  };

  const handleNewAlert = (newAlert) => {
    // Add new alert to the list
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show notification if enabled
    if (settings.notifications.pushNotifications && settings.alertTypes[newAlert.type]) {
      showNotification(newAlert);
    }
  };

  const showNotification = (alert) => {
    const alertType = ALERT_TYPES[alert.type.toUpperCase()];
    Alert.alert(
      `${alertType.name} Alert`,
      `${alert.title}\nLocation: ${alert.locationName}`,
      [
        { text: 'Dismiss' },
        { text: 'View Details', onPress: () => setSelectedAlert(alert) }
      ]
    );
  };

  const dismissAlert = (alertId) => {
    // Mark alert as dismissed in backend
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    // API call: await dismissAlert(alertId);
  };

  const viewOnMap = (alert) => {
    // Navigate to map with alert location
    router.push({
      pathname: '/live-tracking',
      params: {
        focusLat: alert.coordinates.lat,
        focusLng: alert.coordinates.lng,
        alertId: alert.id
      }
    });
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getFilteredAlerts = () => {
    return alerts.filter(alert => settings.alertTypes[alert.type]);
  };

  const renderAlertCard = (alert) => {
    const alertType = ALERT_TYPES[alert.type.toUpperCase()];
    if (!alertType) return null;

    return (
      <View key={alert.id} style={[
        styles.alertCard,
        { backgroundColor: alertType.bgColor, borderColor: alertType.borderColor }
      ]}>
        <View style={styles.alertHeader}>
          <View style={styles.alertTypeContainer}>
            <Text style={styles.alertIcon}>{alertType.icon}</Text>
            <View style={styles.alertTitleContainer}>
              <Text style={[styles.alertTitle, { color: alertType.color }]}>
                {alert.title}
              </Text>
              <Text style={styles.alertLocation}>{alert.locationName}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={() => dismissAlert(alert.id)}
          >
            <Text style={styles.dismissButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.alertDescription}>{alert.description}</Text>

        <View style={styles.alertFooter}>
          <View style={styles.alertMeta}>
            <Text style={styles.alertDistance}>{alert.distance} km away</Text>
            <Text style={styles.alertTime}>{formatTimestamp(alert.timestamp)}</Text>
          </View>
          
          <View style={styles.alertActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setSelectedAlert(alert)}
            >
              <Text style={styles.actionButtonText}>More Info</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryActionButton]}
              onPress={() => viewOnMap(alert)}
            >
              <Text style={[styles.actionButtonText, styles.primaryActionText]}>
                View on Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alert Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.settingsContent}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Alert Types</Text>
              {Object.values(ALERT_TYPES).map(type => (
                <View key={type.id} style={styles.settingsItem}>
                  <View style={styles.settingsItemLeft}>
                    <Text style={styles.settingsIcon}>{type.icon}</Text>
                    <Text style={styles.settingsItemText}>{type.name}</Text>
                  </View>
                  <Switch
                    value={settings.alertTypes[type.id]}
                    onValueChange={(value) => {
                      const newSettings = {
                        ...settings,
                        alertTypes: {
                          ...settings.alertTypes,
                          [type.id]: value
                        }
                      };
                      saveSettings(newSettings);
                    }}
                    trackColor={{ false: '#E5E7EB', true: type.color }}
                    thumbColor='#FFFFFF'
                  />
                </View>
              ))}
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Notifications</Text>
              
              <View style={styles.settingsItem}>
                <Text style={styles.settingsItemText}>Sound Alerts</Text>
                <Switch
                  value={settings.notifications.sound}
                  onValueChange={(value) => {
                    const newSettings = {
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        sound: value
                      }
                    };
                    saveSettings(newSettings);
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor='#FFFFFF'
                />
              </View>

              <View style={styles.settingsItem}>
                <Text style={styles.settingsItemText}>Vibration</Text>
                <Switch
                  value={settings.notifications.vibration}
                  onValueChange={(value) => {
                    const newSettings = {
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        vibration: value
                      }
                    };
                    saveSettings(newSettings);
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor='#FFFFFF'
                />
              </View>

              <View style={styles.settingsItem}>
                <Text style={styles.settingsItemText}>Push Notifications</Text>
                <Switch
                  value={settings.notifications.pushNotifications}
                  onValueChange={(value) => {
                    const newSettings = {
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        pushNotifications: value
                      }
                    };
                    saveSettings(newSettings);
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor='#FFFFFF'
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderAlertDetailModal = () => {
    if (!selectedAlert) return null;
    const alertType = ALERT_TYPES[selectedAlert.type.toUpperCase()];

    return (
      <Modal
        visible={!!selectedAlert}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedAlert(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alert Details</Text>
              <TouchableOpacity onPress={() => setSelectedAlert(null)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailContent}>
              <View style={[styles.detailHeader, { backgroundColor: alertType.bgColor }]}>
                <Text style={styles.detailIcon}>{alertType.icon}</Text>
                <View>
                  <Text style={[styles.detailTitle, { color: alertType.color }]}>
                    {selectedAlert.title}
                  </Text>
                  <Text style={styles.detailLocation}>{selectedAlert.locationName}</Text>
                </View>
              </View>

              <Text style={styles.detailDescription}>{selectedAlert.description}</Text>
              
              <View style={styles.detailMeta}>
                <Text style={styles.detailMetaItem}>Distance: {selectedAlert.distance} km</Text>
                <Text style={styles.detailMetaItem}>
                  Time: {formatTimestamp(selectedAlert.timestamp)}
                </Text>
                <Text style={styles.detailMetaItem}>Severity: {selectedAlert.severity}</Text>
              </View>

              <TouchableOpacity 
                style={styles.viewMapButton}
                onPress={() => {
                  setSelectedAlert(null);
                  viewOnMap(selectedAlert);
                }}
              >
                <Text style={styles.viewMapButtonText}>VIEW ON MAP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Geo-Fence Alerts</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <View style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>

        {/* Alert Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {filteredAlerts.length} active alerts in your area
          </Text>
          <Text style={styles.summarySubtext}>
            Last updated: {formatTimestamp(new Date())}
          </Text>
        </View>

        {/* Alerts List */}
        <ScrollView 
          style={styles.alertsList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchAlerts}
              tintColor="#6B7280"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => renderAlertCard(alert))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Active Alerts</Text>
              <Text style={styles.emptyStateText}>
                You're all clear! We'll notify you of any safety updates in your area.
              </Text>
            </View>
          )}
          
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Modals */}
        {renderSettingsModal()}
        {renderAlertDetailModal()}

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },

  // Summary
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Alerts List
  alertsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
  dismissButtonText: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  alertDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMeta: {
    flex: 1,
  },
  alertDistance: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  primaryActionButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  primaryActionText: {
    color: '#FFFFFF',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  // Modal Base
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Settings Modal
  settingsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },

  // Detail Modal
  detailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  detailContent: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailMeta: {
    marginBottom: 24,
  },
  detailMetaItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  viewMapButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewMapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  bottomSpacer: {
    height: 40,
  },
});