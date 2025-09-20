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

// App version and info
const APP_INFO = {
  version: '1.2.3',
  buildNumber: '234',
  lastUpdate: new Date('2024-01-15')
};

// Mock user settings - Replace with actual user data
const mockUserSettings = {
  profile: {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@email.com',
    phone: '+91 98765 43210',
    avatar: null
  },
  safety: {
    autoTracking: true,
    geofenceSensitivity: 0.7, // 0-1 range
    emergencyResponseEnabled: true,
    emergencyContacts: ['Mom', 'Dad', 'Emergency Contact'],
    panicButtonEnabled: true
  },
  notifications: {
    pushNotifications: true,
    locationAlerts: true,
    familyUpdates: true,
    emergencyAlerts: true
  },
  preferences: {
    language: 'en',
    theme: 'light',
    units: 'metric' // metric or imperial
  }
};

export default function SettingsMenuScreen() {
  return (
    <SafeAreaProvider>
      <SettingsMenuContent />
    </SafeAreaProvider>
  );
}

function SettingsMenuContent() {
  const router = useRouter();
  const [userSettings, setUserSettings] = useState(mockUserSettings);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    loadUserSettings();
  }, []);

  // Backend Integration Functions
  const loadUserSettings = async () => {
    try {
      setIsRefreshing(true);
      // Replace with actual API call
      // const response = await fetch('/api/user/settings');
      // const data = await response.json();
      // setUserSettings(data);
      
      console.log('Loading user settings...');
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading settings:', error);
      setIsRefreshing(false);
    }
  };

  const updateSetting = async (category, setting, value) => {
    try {
      // Replace with actual API call
      // await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify({ category, setting, value })
      // });
      
      setUserSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      }));
      
      console.log(`Updated ${category}.${setting} to:`, value);
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            console.log('Logging out...');
            // router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            console.log('Deleting account...');
          }
        }
      ]
    );
  };

  const openSupportContact = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you would like to contact our support team:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => console.log('Opening email...') },
        { text: 'Phone', onPress: () => console.log('Opening phone...') }
      ]
    );
  };

  const formatSensitivityLabel = (value) => {
    if (value <= 0.3) return 'Low';
    if (value <= 0.7) return 'Medium';
    return 'High';
  };

  // Custom Slider Component
  const CustomSlider = ({ value, onValueChange, minimumValue = 0, maximumValue = 1 }) => {
    const [sliderValue, setSliderValue] = useState(value);
    const [sliderWidth, setSliderWidth] = useState(250);

    const handleSliderPress = (event) => {
      const { locationX } = event.nativeEvent;
      const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
      const newValue = minimumValue + (maximumValue - minimumValue) * percentage;
      const clampedValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
      
      setSliderValue(clampedValue);
      onValueChange(clampedValue);
    };

    const onLayout = (event) => {
      setSliderWidth(event.nativeEvent.layout.width);
    };

    useEffect(() => {
      setSliderValue(value);
    }, [value]);

    const thumbPosition = ((sliderValue - minimumValue) / (maximumValue - minimumValue)) * Math.max(0, sliderWidth - 20);

    return (
      <TouchableOpacity
        style={styles.customSlider}
        onPress={handleSliderPress}
        onLayout={onLayout}
        activeOpacity={1}
      >
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderTrackActive, { width: Math.max(0, thumbPosition + 10) }]} />
        </View>
        <View style={[styles.sliderThumb, { left: thumbPosition }]} />
      </TouchableOpacity>
    );
  };

  // Navigation functions
  const navigateToProfileEdit = () => {
    router.push('/profile-edit');
  };

  const navigateToLanguageSettings = () => {
    router.push('/language');
  };

  const navigateToNotificationSettings = () => {
    router.push('/notification-settings');
  };

  const navigateToPrivacySettings = () => {
    router.push('/privacy-settings');
  };

  const renderSettingsItem = ({ title, subtitle, icon, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        {icon && <Text style={styles.settingsIcon}>{icon}</Text>}
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showArrow && <Text style={styles.settingsArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderAccountSettings = () => (
    <View style={styles.section}>
      {renderSectionHeader('Account Settings')}
      
      {renderSettingsItem({
        title: 'Profile Information',
        subtitle: userSettings.profile.name,
        icon: '👤',
        onPress: navigateToProfileEdit
      })}
      
      {renderSettingsItem({
        title: 'Language Preferences',
        subtitle: 'English',
        icon: '🌐',
        onPress: navigateToLanguageSettings
      })}
      
      {renderSettingsItem({
        title: 'Notification Settings',
        subtitle: 'Manage alerts and updates',
        icon: '🔔',
        onPress: navigateToNotificationSettings
      })}
    </View>
  );

  const renderSafetySettings = () => (
    <View style={styles.section}>
      {renderSectionHeader('Safety Settings')}
      
      {renderSettingsItem({
        title: 'Auto-tracking',
        subtitle: 'Automatically track your location during trips',
        icon: '📍',
        rightComponent: (
          <Switch
            value={userSettings.safety.autoTracking}
            onValueChange={(value) => updateSetting('safety', 'autoTracking', value)}
            trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
            thumbColor={userSettings.safety.autoTracking ? '#10B981' : '#9CA3AF'}
          />
        ),
        showArrow: false
      })}
      
      {renderSettingsItem({
        title: 'Geo-fence Sensitivity',
        subtitle: `${formatSensitivityLabel(userSettings.safety.geofenceSensitivity)} - Adjust area monitoring sensitivity`,
        icon: '🛡️',
        onPress: () => setShowGeofenceModal(true)
      })}
      
      {renderSettingsItem({
        title: 'Emergency Response Settings',
        subtitle: 'Configure emergency contacts and responses',
        icon: '🚨',
        onPress: () => setShowEmergencyModal(true)
      })}
    </View>
  );

  const renderPrivacyAndAbout = () => (
    <View style={styles.section}>
      {renderSectionHeader('Privacy & About')}
      
      {renderSettingsItem({
        title: 'Privacy Settings',
        subtitle: 'Data sharing and privacy controls',
        icon: '🔒',
        onPress: navigateToPrivacySettings
      })}
      
      {renderSettingsItem({
        title: 'App Version',
        subtitle: `Version ${APP_INFO.version} (${APP_INFO.buildNumber})`,
        icon: 'ℹ️',
        rightComponent: null,
        showArrow: false
      })}
      
      {renderSettingsItem({
        title: 'Support',
        subtitle: 'Contact our support team',
        icon: '💬',
        onPress: openSupportContact
      })}
      
      {renderSettingsItem({
        title: 'Terms & Conditions',
        subtitle: 'View app terms and conditions',
        icon: '📄',
        onPress: () => console.log('Opening terms...')
      })}
    </View>
  );

  const renderDangerZone = () => (
    <View style={styles.section}>
      {renderSectionHeader('Account Actions')}
      
      <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
        <Text style={styles.dangerItemText}>Logout</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.dangerItem, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={[styles.dangerItemText, styles.deleteButtonText]}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGeofenceModal = () => (
    <Modal
      visible={showGeofenceModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowGeofenceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Geo-fence Sensitivity</Text>
            <TouchableOpacity onPress={() => setShowGeofenceModal(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsContent}>
            <Text style={styles.settingsDescription}>
              Adjust how sensitive the app is to detecting when you enter or exit designated areas.
            </Text>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                Current: {formatSensitivityLabel(userSettings.safety.geofenceSensitivity)}
              </Text>
              
              <CustomSlider
                value={userSettings.safety.geofenceSensitivity}
                onValueChange={(value) => updateSetting('safety', 'geofenceSensitivity', value)}
                minimumValue={0}
                maximumValue={1}
              />
              
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>Low</Text>
                <Text style={styles.sliderLabelText}>Medium</Text>
                <Text style={styles.sliderLabelText}>High</Text>
              </View>
            </View>
            
            <Text style={styles.sensitivityDescription}>
              • <Text style={styles.bold}>Low:</Text> Less sensitive, fewer false alerts
              {'\n'}• <Text style={styles.bold}>Medium:</Text> Balanced sensitivity (recommended)
              {'\n'}• <Text style={styles.bold}>High:</Text> Very sensitive, more accurate detection
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEmergencyModal = () => (
    <Modal
      visible={showEmergencyModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEmergencyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Emergency Response</Text>
            <TouchableOpacity onPress={() => setShowEmergencyModal(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsContent}>
            <Text style={styles.settingsDescription}>
              Configure how the app responds to emergency situations.
            </Text>
            
            <View style={styles.emergencySettings}>
              <View style={styles.emergencyItem}>
                <View style={styles.emergencyItemLeft}>
                  <Text style={styles.emergencyItemTitle}>Emergency Response</Text>
                  <Text style={styles.emergencyItemSubtitle}>Enable automatic emergency alerts</Text>
                </View>
                <Switch
                  value={userSettings.safety.emergencyResponseEnabled}
                  onValueChange={(value) => updateSetting('safety', 'emergencyResponseEnabled', value)}
                  trackColor={{ false: '#E5E7EB', true: '#FECACA' }}
                  thumbColor={userSettings.safety.emergencyResponseEnabled ? '#EF4444' : '#9CA3AF'}
                />
              </View>
              
              <View style={styles.emergencyItem}>
                <View style={styles.emergencyItemLeft}>
                  <Text style={styles.emergencyItemTitle}>Panic Button</Text>
                  <Text style={styles.emergencyItemSubtitle}>Quick access emergency button</Text>
                </View>
                <Switch
                  value={userSettings.safety.panicButtonEnabled}
                  onValueChange={(value) => updateSetting('safety', 'panicButtonEnabled', value)}
                  trackColor={{ false: '#E5E7EB', true: '#FECACA' }}
                  thumbColor={userSettings.safety.panicButtonEnabled ? '#EF4444' : '#9CA3AF'}
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.emergencyContactsButton}>
              <Text style={styles.emergencyContactsButtonText}>
                Manage Emergency Contacts ({userSettings.safety.emergencyContacts.length})
              </Text>
            </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadUserSettings}
              tintColor="#6B7280"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {renderAccountSettings()}
          {renderSafetySettings()}
          {renderPrivacyAndAbout()}
          {renderDangerZone()}
          
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {renderGeofenceModal()}
        {renderEmergencyModal()}

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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Settings Items
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  // Danger Zone
  dangerItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  dangerItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  deleteButtonText: {
    color: '#EF4444',
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

  // Custom Slider Styles
  customSlider: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginVertical: 8,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
  },
  sliderTrackActive: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    top: -7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Slider
  sliderContainer: {
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sensitivityDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginTop: 20,
  },
  bold: {
    fontWeight: '600',
  },

  // Emergency Settings
  emergencySettings: {
    marginVertical: 16,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  emergencyItemLeft: {
    flex: 1,
  },
  emergencyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  emergencyItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  emergencyContactsButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyContactsButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom spacer
  bottomSpacer: {
    height: 40,
  },
});