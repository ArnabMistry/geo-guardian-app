import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
  Alert,
  Image,
  LinearGradient
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Mock data - replace with actual data from context/API
const mockUser = {
  name: "Arnab Sharma",
  avatar: null,
  touristId: "TID123456",
  unreadAlerts: 2
};

const mockWeather = {
  city: "Guwahati",
  temp: 28,
  condition: "Partly Cloudy",
  updatedMinutesAgo: 5
};

const mockSafetyScore = {
  score: 78,
  lastUpdated: "2 min ago"
};

const mockRecentActivity = [
  {
    id: 1,
    timestamp: "11:43",
    summary: "Geo-fence alert: Riverbank area detected",
    type: "alert",
    alertId: 358
  },
  {
    id: 2,
    timestamp: "10:20",
    summary: "Family update sent successfully",
    type: "family_update",
    tripId: "TR123"
  },
  {
    id: 3,
    timestamp: "Yesterday",
    summary: "Digital identity verification completed",
    type: "id_created"
  }
];

const mockSafetyTips = [
  "Avoid isolated areas after sunset",
  "Use main roads for better connectivity",
  "Stay in groups when possible",
  "Keep emergency contacts updated"
];

const mockTrip = {
  title: "Northeast Adventure",
  day: 2,
  totalDays: 7,
  visited: ["Guwahati"],
  planned: ["Shillong", "Cherrapunji"],
  progress: 28
};

export default function Home() {
  return (
    <SafeAreaProvider>
      <HomeContent />
    </SafeAreaProvider>
  );
}

function HomeContent() {
  const router = useRouter();
  const [gpsStatus, setGpsStatus] = useState({ enabled: true, accuracy: "High" });
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [panicCountdown, setPanicCountdown] = useState(10);
  const [isHighRiskArea, setIsHighRiskArea] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Panic countdown effect
  useEffect(() => {
    let interval;
    if (showPanicModal && panicCountdown > 0) {
      interval = setInterval(() => {
        setPanicCountdown(prev => prev - 1);
      }, 1000);
    } else if (panicCountdown === 0) {
      handlePanicConfirm();
    }
    return () => clearInterval(interval);
  }, [showPanicModal, panicCountdown]);

  const handlePanicPress = () => {
    setShowPanicModal(true);
    setPanicCountdown(10);
  };

  const handlePanicConfirm = () => {
    console.log('PANIC ALERT SENT');
    Alert.alert('Emergency Alert Sent', 'Your location and emergency alert have been sent to your contacts and local authorities.');
    setShowPanicModal(false);
    setPanicCountdown(10);
  };

  const handlePanicCancel = () => {
    setShowPanicModal(false);
    setPanicCountdown(10);
  };

  const handleRecentActivityTap = (item) => {
    switch (item.type) {
      case 'alert':
        router.push(`/alerts?alertId=${item.alertId}`);
        break;
      case 'family_update':
        router.push(`/trip-monitoring?tripId=${item.tripId}`);
        break;
      case 'id_created':
        router.push('/id');
        break;
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'alert': return '●';
      case 'family_update': return '↗';
      case 'id_created': return '✓';
      default: return '•';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'alert': return '#EF4444';
      case 'family_update': return '#3B82F6';
      case 'id_created': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Profile and Notifications Row */}
          <View style={styles.topRow}>
            <TouchableOpacity 
              style={styles.profileSection}
              onPress={() => router.push('/settings')}
              // onLongPress={() => {
              //   Alert.alert(
              //     'Profile Options',
              //     '',
              //     [
              //       { text: 'View Profile', onPress: () => router.push('/profile') },
              //       { text: 'Log out', onPress: () => console.log('Logout') },
              //       { text: 'Cancel', style: 'cancel' }
              //     ]
              //   );
              // }}
            >
              <View style={styles.avatarContainer}>
                {mockUser.avatar ? (
                  <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitials}>{getInitials(mockUser.name)}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/alerts')}
                onLongPress={() => router.push('/settings')}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.headerIcon}>◉</Text>
                  {mockUser.unreadAlerts > 0 && (
                    <View style={styles.notificationDot}>
                      <Text style={styles.notificationCount}>{mockUser.unreadAlerts}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{mockUser.name.split(' ')[0]}</Text>
            <Text style={styles.subtitleText}>Your safety dashboard</Text>
          </View>
        </Animated.View>

        {/* High Risk Area Warning */}
        {isHighRiskArea && (
          <Animated.View 
            style={[
              styles.warningBanner,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.warningContent}>
              <View style={styles.warningIndicator} />
              <View style={styles.warningTextContainer}>
                <Text style={styles.warningTitle}>High Risk Area Detected</Text>
                <Text style={styles.warningSubtitle}>Avoid movement and stay alert</Text>
              </View>
              <TouchableOpacity 
                style={styles.warningAction}
                onPress={() => router.push('/alerts')}
              >
                <Text style={styles.warningActionText}>Details</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Status Cards */}
        <Animated.View 
          style={[
            styles.statusSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Weather Card */}
          <TouchableOpacity 
            style={[styles.statusCard, styles.weatherCard]}
            onPress={() => router.push('/tracking?layer=weather')}
            onLongPress={() => setShowWeatherModal(true)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Weather</Text>
              <View style={styles.weatherIcon} />
            </View>
            <Text style={styles.weatherTemp}>{mockWeather.temp}°</Text>
            <Text style={styles.weatherLocation}>{mockWeather.city}</Text>
            <Text style={styles.weatherCondition}>{mockWeather.condition}</Text>
          </TouchableOpacity>

          {/* Safety Score Card */}
          <TouchableOpacity 
            style={[styles.statusCard, styles.safetyCard]}
            onPress={() => router.push('/safety')}
            onLongPress={() => console.log('Copy score to clipboard')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Safety Score</Text>
              <View style={styles.safetyIcon} />
            </View>
            <Text style={styles.safetyScore}>{mockSafetyScore.score}</Text>
            <Text style={styles.safetyLabel}>Current Rating</Text>
            <Text style={styles.safetyUpdate}>Updated {mockSafetyScore.lastUpdated}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* GPS Status Bar */}
        <Animated.View 
          style={[
            styles.gpsStatusContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.gpsStatus}
            onPress={() => router.push('/tracking')}
            onLongPress={() => console.log('Open location settings')}
          >
            <View style={[styles.gpsIndicator, gpsStatus.enabled && styles.gpsActive]} />
            <Text style={styles.gpsText}>
              GPS {gpsStatus.enabled ? 'Active' : 'Inactive'} • Accuracy: {gpsStatus.accuracy}
            </Text>
            <Text style={styles.gpsChevron}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            {/* Emergency Alert */}
            <TouchableOpacity 
              style={[styles.actionCard, styles.emergencyCard]}
              onPress={() => router.push('/panic')}
              onLongPress={() => router.push('/emergency-contacts')}
            >
              <View style={styles.actionIcon}>
                <View style={styles.emergencyIcon} />
              </View>
              <Text style={styles.actionTitle}>Emergency</Text>
              <Text style={styles.actionSubtitle}>Instant alert</Text>
            </TouchableOpacity>

            {/* My Location */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/tracking?centerOn=user&follow=true')}
              onLongPress={() => {
                Alert.alert(
                  'Share Location',
                  'Send your current location to emergency contact?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Share', onPress: () => console.log('Location shared') }
                  ]
                );
              }}
            >
              <View style={styles.actionIcon}>
                <View style={styles.locationIcon} />
              </View>
              <Text style={styles.actionTitle}>My Location</Text>
              <Text style={styles.actionSubtitle}>Find me</Text>
            </TouchableOpacity>

            {/* Safety Zone */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/tracking?overlay=safety')}
              onLongPress={() => console.log('Toggle auto-check')}
            >
              <View style={styles.actionIcon}>
                <View style={styles.shieldIcon} />
              </View>
              <Text style={styles.actionTitle}>Safety Zones</Text>
              <Text style={styles.actionSubtitle}>Nearest 1.2km</Text>
            </TouchableOpacity>

            {/* Emergency Contacts */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/emergency-contacts')}
              onLongPress={() => {
                Alert.alert(
                  'Call Emergency Contact',
                  'Call your primary emergency contact now?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => console.log('Calling emergency contact') }
                  ]
                );
              }}
            >
              <View style={styles.actionIcon}>
                <View style={styles.contactIcon} />
              </View>
              <Text style={styles.actionTitle}>Contacts</Text>
              <Text style={styles.actionSubtitle}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View 
          style={[
            styles.recentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/wip')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityContainer}>
            {mockRecentActivity.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.activityItem,
                  index === mockRecentActivity.length - 1 && styles.lastActivityItem
                ]}
                onPress={() => handleRecentActivityTap(item)}
                onLongPress={() => console.log('Show activity details', item)}
              >
                <View style={[styles.activityIndicator, { backgroundColor: getActivityColor(item.type) }]}>
                  <Text style={styles.activityIcon}>{getActivityIcon(item.type)}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{item.summary}</Text>
                  <Text style={styles.activityTime}>{item.timestamp}</Text>
                </View>
                <Text style={styles.activityChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Trip Progress */}
        {mockTrip && (
          <Animated.View 
            style={[
              styles.tripSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.tripCard}
              onPress={() => router.push('/trip-monitoring')}
              onLongPress={() => console.log('Send checkpoint update')}
            >
              <View style={styles.tripHeader}>
                <View>
                  <Text style={styles.tripTitle}>{mockTrip.title}</Text>
                  <Text style={styles.tripDuration}>Day {mockTrip.day} of {mockTrip.totalDays}</Text>
                </View>
                <View style={styles.tripProgress}>
                  <Text style={styles.tripPercentage}>{mockTrip.progress}%</Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${mockTrip.progress}%` }]} />
                </View>
              </View>

              <View style={styles.tripDetails}>
                <Text style={styles.tripDetailText}>
                  Completed: {mockTrip.visited.join(', ')}
                </Text>
                <Text style={styles.tripDetailText}>
                  Next: {mockTrip.planned[0]}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Safety Recommendations */}
        <Animated.View 
          style={[
            styles.recommendationsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Safety Recommendations</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationsScroll}>
            {mockSafetyTips.map((tip, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recommendationCard}
                onPress={() => router.push('/safety')}
              >
                <Text style={styles.recommendationText}>{tip}</Text>
                <View style={styles.recommendationArrow} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('Quick share location')}
        onLongPress={() => console.log('Send live location')}
      >
        <View style={styles.fabIcon} />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => console.log('Home refresh')}
          onLongPress={() => console.log('Quick actions menu')}
        >
          <View style={[styles.navIcon, styles.activeNavIcon, styles.homeIcon]} />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/id')}
          onLongPress={() => console.log('Share ID')}
        >
          <View style={[styles.navIcon, styles.idIcon]} />
          <Text style={styles.navLabel}>ID</Text>
          <View style={styles.navIndicator} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/tracking')}
          onLongPress={() => console.log('Layer toggles')}
        >
          <View style={[styles.navIcon, styles.trackingIcon]} />
          <Text style={styles.navLabel}>Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/safety')}
          onLongPress={() => console.log('Safety settings')}
        >
          <View style={[styles.navIcon, styles.safetyNavIcon]} />
          <Text style={styles.navLabel}>Safety</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/alerts')}
          onLongPress={() => console.log('Mark all read')}
        >
          <View style={[styles.navIcon, styles.alertsIcon]} />
          <Text style={styles.navLabel}>Alerts</Text>
          {mockUser.unreadAlerts > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{mockUser.unreadAlerts}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Panic Modal */}
      <Modal
        visible={showPanicModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePanicCancel}
      >
        <View style={styles.panicOverlay}>
          <View style={styles.panicModal}>
            <View style={styles.panicIcon} />
            <Text style={styles.panicTitle}>Emergency Alert</Text>
            <Text style={styles.panicMessage}>
              Alert will be sent in {panicCountdown} seconds
            </Text>
            <Text style={styles.panicSubtext}>
              Your location will be shared with emergency contacts and authorities
            </Text>
            
            <View style={styles.panicActions}>
              <TouchableOpacity 
                style={styles.panicCancel}
                onPress={handlePanicCancel}
              >
                <Text style={styles.panicCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.panicConfirm}
                onPress={handlePanicConfirm}
              >
                <Text style={styles.panicConfirmText}>Send Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Weather Modal */}
      <Modal
        visible={showWeatherModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeatherModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.weatherModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Weather Forecast</Text>
              <TouchableOpacity onPress={() => setShowWeatherModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.weatherLocation}>{mockWeather.city}</Text>
            
            <View style={styles.forecastList}>
              {['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <View key={day} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{day}</Text>
                  <Text style={styles.forecastTemp}>{28 - index}°C</Text>
                  <Text style={styles.forecastCondition}>
                    {index === 0 ? 'Partly Cloudy' : index % 2 ? 'Sunny' : 'Cloudy'}
                  </Text>
                </View>
              ))}
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
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  
  // Header Styles
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
  },
  headerIcon: {
    fontSize: 24,
    color: '#64748B',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  welcomeSection: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },

  // Warning Banner
  warningBanner: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 8,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  warningIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 2,
  },
  warningSubtitle: {
    fontSize: 12,
    color: '#DC2626',
  },
  warningAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  warningActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Status Section
  statusSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  weatherCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  safetyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weatherIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
  },
  safetyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  weatherLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 14,
    color: '#64748B',
  },
  safetyScore: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  safetyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  safetyUpdate: {
    fontSize: 12,
    color: '#64748B',
  },

  // GPS Status
  gpsStatusContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  gpsStatus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  gpsIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginRight: 12,
  },
  gpsActive: {
    backgroundColor: '#10B981',
  },
  gpsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  gpsChevron: {
    fontSize: 16,
    color: '#CBD5E1',
  },

  // Actions Section
  actionsSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emergencyCard: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FFFBFB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
  },
  locationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  shieldIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
  },
  contactIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  // Recent Section
  recentSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748B',
  },
  activityChevron: {
    fontSize: 16,
    color: '#CBD5E1',
  },

  // Trip Section
  tripSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  tripDuration: {
    fontSize: 14,
    color: '#64748B',
  },
  tripProgress: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tripPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  tripDetails: {
    gap: 4,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#64748B',
  },

  // Recommendations Section
  recommendationsSection: {
    marginTop: 32,
    paddingBottom: 20,
  },
  recommendationsScroll: {
    paddingLeft: 24,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 280,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
    lineHeight: 20,
  },
  recommendationArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginLeft: 12,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 140,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    paddingBottom: 25,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeNavItem: {
    // Active state
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: '#E2E8F0',
  },
  activeNavIcon: {
    backgroundColor: '#3B82F6',
  },
  homeIcon: {
    backgroundColor: '#E2E8F0',
  },
  idIcon: {
    backgroundColor: '#E2E8F0',
  },
  trackingIcon: {
    backgroundColor: '#E2E8F0',
  },
  safetyNavIcon: {
    backgroundColor: '#E2E8F0',
  },
  alertsIcon: {
    backgroundColor: '#E2E8F0',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  activeNavLabel: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  navBadge: {
    position: 'absolute',
    top: 2,
    right: '30%',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  navIndicator: {
    position: 'absolute',
    top: 4,
    right: '32%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },

  // Panic Modal
  panicOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 24,
    minWidth: width * 0.8,
  },
  panicIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    marginBottom: 24,
  },
  panicTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  panicMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  panicSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  panicActions: {
    flexDirection: 'row',
    gap: 16,
  },
  panicCancel: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  panicCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  panicConfirm: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  panicConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Weather Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  weatherModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: height * 0.7,
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
    color: '#1E293B',
  },
  modalClose: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },
  forecastList: {
    marginTop: 16,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
    width: 60,
    textAlign: 'center',
  },
  forecastCondition: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    textAlign: 'right',
  },
});