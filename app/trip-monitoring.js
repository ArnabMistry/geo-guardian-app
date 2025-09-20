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
  RefreshControl,
  Alert,
  Modal,
  Switch
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Data Models - Easy to replace with API responses
const INSIGHT_TYPES = {
  NORMAL: {
    id: 'normal',
    icon: '✅',
    color: '#10B981',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  WARNING: {
    id: 'warning',
    icon: '⚠️',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FED7AA'
  },
  ALERT: {
    id: 'alert',
    icon: '🔴',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  INFO: {
    id: 'info',
    icon: '💡',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE'
  }
};

const UPDATE_FREQUENCIES = {
  '15min': { label: '15 minutes', value: 15 },
  '30min': { label: '30 minutes', value: 30 },
  '1hour': { label: '1 hour', value: 60 },
  '2hours': { label: '2 hours', value: 120 },
  'manual': { label: 'Manual only', value: 0 }
};

// Mock data structure - Replace with API calls
const mockTripData = {
  tripId: 'trip_2024_001',
  startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  currentDuration: 4.25, // hours
  status: 'active', // active, paused, completed
  
  destinations: {
    planned: [
      { id: 'dest_1', name: 'Kamakhya Temple', visited: true, visitTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000) },
      { id: 'dest_2', name: 'Assam State Museum', visited: true, visitTime: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { id: 'dest_3', name: 'Fancy Bazaar', visited: false, plannedTime: new Date(Date.now() + 1 * 60 * 60 * 1000) },
      { id: 'dest_4', name: 'Brahmaputra River Cruise', visited: false, plannedTime: new Date(Date.now() + 3 * 60 * 60 * 1000) }
    ],
    unplanned: [
      { id: 'unp_1', name: 'Local Tea Stall', visitTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000) }
    ]
  },

  route: {
    plannedDistance: 25.8, // km
    actualDistance: 28.3, // km
    deviation: 2.5, // km
    deviationPercentage: 9.7
  },

  aiInsights: [
    {
      id: 'insight_1',
      type: 'normal',
      title: 'Your trip pattern looks normal',
      description: 'You are following your planned itinerary with minor deviations.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      confidence: 0.95
    },
    {
      id: 'insight_2',
      type: 'warning',
      title: 'Deviation detected from planned route',
      description: 'You have deviated 2.5km from your original route. This added 15 minutes to your journey.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      confidence: 0.88,
      actionRequired: false
    },
    {
      id: 'insight_3',
      type: 'alert',
      title: 'Extended stay in restricted area',
      description: 'You have been in a restricted area for 25 minutes. Consider moving to a safer location.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      confidence: 0.92,
      actionRequired: true
    },
    {
      id: 'insight_4',
      type: 'info',
      title: 'Popular tourist spot nearby',
      description: 'Umananda Temple is 1.2km from your current location and worth visiting.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      confidence: 0.82,
      actionable: true
    }
  ],

  familyUpdates: {
    lastUpdateSent: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    autoUpdateFrequency: '30min',
    nextScheduledUpdate: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    totalUpdatesSent: 8,
    contacts: ['Mom', 'Dad', 'Emergency Contact']
  }
};

export default function TripOverviewScreen() {
  return (
    <SafeAreaProvider>
      <TripOverviewContent />
    </SafeAreaProvider>
  );
}

function TripOverviewContent() {
  const router = useRouter();
  const [tripData, setTripData] = useState(mockTripData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUpdateSettings, setShowUpdateSettings] = useState(false);
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Set up real-time trip monitoring
    setupTripMonitoring();
    
    // Load trip data
    fetchTripData();
  }, []);

  // Backend Integration Functions
  const fetchTripData = async () => {
    try {
      setIsRefreshing(true);
      // Replace with actual API call
      // const response = await fetch(`/api/trips/${tripId}`);
      // const data = await response.json();
      // setTripData(data);
      
      console.log('Fetching trip data...');
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      setIsRefreshing(false);
    }
  };

  const setupTripMonitoring = () => {
    // Set up WebSocket or real-time monitoring
    // const ws = new WebSocket('ws://your-api/trip-monitoring');
    // ws.onmessage = (event) => {
    //   const update = JSON.parse(event.data);
    //   handleTripUpdate(update);
    // };
    console.log('Setting up trip monitoring...');
  };

  const handleTripUpdate = (update) => {
    // Handle real-time trip updates
    setTripData(prev => ({
      ...prev,
      ...update
    }));
  };

  const sendManualUpdate = async () => {
    try {
      setIsSendingUpdate(true);
      // Replace with actual API call
      // await fetch('/api/family-updates/send', {
      //   method: 'POST',
      //   body: JSON.stringify({ tripId: tripData.tripId })
      // });
      
      // Simulate API call
      setTimeout(() => {
        setIsSendingUpdate(false);
        setTripData(prev => ({
          ...prev,
          familyUpdates: {
            ...prev.familyUpdates,
            lastUpdateSent: new Date(),
            totalUpdatesSent: prev.familyUpdates.totalUpdatesSent + 1
          }
        }));
        Alert.alert('Update Sent', 'Your location and trip status have been shared with your family.');
      }, 2000);
    } catch (error) {
      console.error('Error sending family update:', error);
      setIsSendingUpdate(false);
      Alert.alert('Error', 'Failed to send update. Please try again.');
    }
  };

  const updateAutoFrequency = async (frequency) => {
    try {
      // Replace with actual API call
      // await fetch('/api/family-updates/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify({ frequency })
      // });
      
      setTripData(prev => ({
        ...prev,
        familyUpdates: {
          ...prev.familyUpdates,
          autoUpdateFrequency: frequency,
          nextScheduledUpdate: frequency === 'manual' 
            ? null 
            : new Date(Date.now() + UPDATE_FREQUENCIES[frequency].value * 60 * 1000)
        }
      }));
      
      console.log('Auto-update frequency changed to:', frequency);
    } catch (error) {
      console.error('Error updating frequency:', error);
    }
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getInsightStyle = (type) => {
    return INSIGHT_TYPES[type.toUpperCase()] || INSIGHT_TYPES.INFO;
  };

  const renderTripOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trip Overview</Text>
      
      <View style={styles.overviewGrid}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Duration</Text>
          <Text style={styles.overviewValue}>
            {formatDuration(tripData.currentDuration)}
          </Text>
          <Text style={styles.overviewSubtext}>
            Started {formatTimeAgo(tripData.startTime)}
          </Text>
        </View>
        
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Distance</Text>
          <Text style={styles.overviewValue}>
            {tripData.route.actualDistance}km
          </Text>
          <Text style={styles.overviewSubtext}>
            +{tripData.route.deviation}km deviation
          </Text>
        </View>
      </View>

      <View style={styles.routeComparison}>
        <Text style={styles.subsectionTitle}>Route Comparison</Text>
        <View style={styles.routeStats}>
          <View style={styles.routeStat}>
            <Text style={styles.routeStatLabel}>Planned</Text>
            <Text style={styles.routeStatValue}>{tripData.route.plannedDistance}km</Text>
          </View>
          <View style={styles.routeStat}>
            <Text style={styles.routeStatLabel}>Actual</Text>
            <Text style={[styles.routeStatValue, { color: '#F59E0B' }]}>
              {tripData.route.actualDistance}km
            </Text>
          </View>
          <View style={styles.routeStat}>
            <Text style={styles.routeStatLabel}>Deviation</Text>
            <Text style={[styles.routeStatValue, { color: '#EF4444' }]}>
              {tripData.route.deviationPercentage}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDestinationsChecklist = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Destinations</Text>
      
      <View style={styles.destinationsList}>
        {tripData.destinations.planned.map((destination) => (
          <View key={destination.id} style={styles.destinationItem}>
            <View style={[
              styles.checkboxIcon, 
              destination.visited ? styles.checkboxChecked : styles.checkboxUnchecked
            ]}>
              {destination.visited && <Text style={styles.checkmark}>✓</Text>}
            </View>
            
            <View style={styles.destinationInfo}>
              <Text style={[
                styles.destinationName,
                destination.visited && styles.destinationVisited
              ]}>
                {destination.name}
              </Text>
              {destination.visited ? (
                <Text style={styles.destinationTime}>
                  Visited {formatTimeAgo(destination.visitTime)}
                </Text>
              ) : (
                <Text style={styles.destinationTime}>
                  Planned for {destination.plannedTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {tripData.destinations.unplanned.length > 0 && (
        <View style={styles.unplannedSection}>
          <Text style={styles.subsectionTitle}>Unplanned Stops</Text>
          {tripData.destinations.unplanned.map((destination) => (
            <View key={destination.id} style={styles.unplannedItem}>
              <Text style={styles.unplannedIcon}>📍</Text>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationTime}>
                  Visited {formatTimeAgo(destination.visitTime)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderAIInsights = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Insights</Text>
      <Text style={styles.sectionSubtitle}>
        AI-powered analysis of your trip patterns
      </Text>
      
      <View style={styles.insightsList}>
        {tripData.aiInsights.map((insight) => {
          const insightStyle = getInsightStyle(insight.type);
          return (
            <View 
              key={insight.id} 
              style={[
                styles.insightCard,
                { 
                  backgroundColor: insightStyle.bgColor,
                  borderColor: insightStyle.borderColor
                }
              ]}
            >
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>{insightStyle.icon}</Text>
                <View style={styles.insightTitleContainer}>
                  <Text style={[styles.insightTitle, { color: insightStyle.color }]}>
                    {insight.title}
                  </Text>
                  <Text style={styles.insightTime}>
                    {formatTimeAgo(insight.timestamp)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.insightDescription}>
                {insight.description}
              </Text>
              
              {(insight.actionable || insight.actionRequired) && (
                <TouchableOpacity 
                  style={[
                    styles.insightAction, 
                    { 
                      borderColor: insightStyle.color,
                      backgroundColor: insight.actionRequired ? insightStyle.color : 'transparent'
                    }
                  ]}
                >
                  <Text style={[
                    styles.insightActionText, 
                    { 
                      color: insight.actionRequired ? '#FFFFFF' : insightStyle.color
                    }
                  ]}>
                    {insight.actionRequired ? 'Take Action' : 'View Details'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderFamilyUpdates = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Family Updates</Text>
      
      <View style={styles.familyUpdateCard}>
        <View style={styles.updateStatus}>
          <Text style={styles.updateStatusTitle}>Last Update Sent</Text>
          <Text style={styles.updateStatusTime}>
            {formatTimeAgo(tripData.familyUpdates.lastUpdateSent)}
          </Text>
          <Text style={styles.updateStatusContacts}>
            to {tripData.familyUpdates.contacts.join(', ')}
          </Text>
        </View>

        <View style={styles.updateStats}>
          <View style={styles.updateStat}>
            <Text style={styles.updateStatValue}>
              {tripData.familyUpdates.totalUpdatesSent}
            </Text>
            <Text style={styles.updateStatLabel}>Updates Sent</Text>
          </View>
          <View style={styles.updateStat}>
            <Text style={styles.updateStatValue}>
              {UPDATE_FREQUENCIES[tripData.familyUpdates.autoUpdateFrequency].label}
            </Text>
            <Text style={styles.updateStatLabel}>Frequency</Text>
          </View>
        </View>

        {tripData.familyUpdates.nextScheduledUpdate && (
          <Text style={styles.nextUpdateText}>
            Next auto-update: {tripData.familyUpdates.nextScheduledUpdate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        )}
      </View>

      <View style={styles.updateActions}>
        <TouchableOpacity 
          style={[styles.sendUpdateButton, isSendingUpdate && styles.buttonDisabled]}
          onPress={sendManualUpdate}
          disabled={isSendingUpdate}
        >
          <Text style={styles.sendUpdateButtonText}>
            {isSendingUpdate ? 'Sending...' : 'Send Update Now'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowUpdateSettings(true)}
        >
          <Text style={styles.settingsButtonText}>Update Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUpdateSettingsModal = () => (
    <Modal
      visible={showUpdateSettings}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowUpdateSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Auto-Update Settings</Text>
            <TouchableOpacity onPress={() => setShowUpdateSettings(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsContent}>
            <Text style={styles.settingsDescription}>
              Choose how often to automatically send your location and trip status to family members.
            </Text>
            
            <View style={styles.frequencyOptions}>
              {Object.entries(UPDATE_FREQUENCIES).map(([key, option]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.frequencyOption}
                  onPress={() => updateAutoFrequency(key)}
                >
                  <Text style={styles.frequencyOptionText}>{option.label}</Text>
                  <View style={[
                    styles.radioButton,
                    tripData.familyUpdates.autoUpdateFrequency === key && styles.radioButtonSelected
                  ]}>
                    {tripData.familyUpdates.autoUpdateFrequency === key && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Overview</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchTripData}
              tintColor="#6B7280"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {renderTripOverview()}
          {renderDestinationsChecklist()}
          {renderAIInsights()}
          {renderFamilyUpdates()}
          
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {renderUpdateSettingsModal()}

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
  headerSpacer: {
    width: 36,
  },

  scrollContainer: {
    flex: 1,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  // Trip Overview
  overviewGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  overviewSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Route Comparison
  routeComparison: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeStat: {
    alignItems: 'center',
  },
  routeStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  routeStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  // Destinations
  destinationsList: {
    gap: 16,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
  },
  checkboxUnchecked: {
    backgroundColor: '#E5E7EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  destinationVisited: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  destinationTime: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Unplanned destinations
  unplannedSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  unplannedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  unplannedIcon: {
    fontSize: 20,
    marginRight: 16,
  },

  // AI Insights
  insightsList: {
    gap: 16,
  },
  insightCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  insightDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Family Updates
  familyUpdateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  updateStatus: {
    alignItems: 'center',
    marginBottom: 20,
  },
  updateStatusTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  updateStatusTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  updateStatusContacts: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  updateStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  updateStat: {
    alignItems: 'center',
  },
  updateStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  updateStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  nextUpdateText: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Update Actions
  updateActions: {
    gap: 12,
  },
  sendUpdateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendUpdateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  settingsButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingsButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
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
  settingsContent: {
    padding: 20,
  },
  settingsDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  frequencyOptions: {
    gap: 16,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  frequencyOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },

  // Bottom spacer
  bottomSpacer: {
    height: 40,
  },
});