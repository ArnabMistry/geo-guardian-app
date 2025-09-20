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
  Alert
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Mock data
const mockEmergencyContacts = [
  { id: 1, name: 'Primary Contact', phone: '+91-98765-43210', status: 'sent' },
  { id: 2, name: 'Secondary Contact', phone: '+91-98765-43211', status: 'sent' },
  { id: 3, name: 'Local Emergency', phone: '100', status: 'delivered' }
];

const mockLocation = {
  latitude: 26.1445,
  longitude: 91.7362,
  address: 'Paltan Bazaar, Guwahati, Assam 781008'
};

export default function PanicSOSScreen() {
  return (
    <SafeAreaProvider>
      <PanicSOSContent />
    </SafeAreaProvider>
  );
}

function PanicSOSContent() {
  const router = useRouter();
  const [panicState, setPanicState] = useState('countdown'); // 'countdown', 'active', 'safe'
  const [countdown, setCountdown] = useState(10);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [policeETA, setPoliceETA] = useState('8-12 minutes');

  // Simple fade animation only
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#DC2626');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (panicState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && panicState === 'countdown') {
      setPanicState('active');
      setIsRecordingAudio(true);
    }
  }, [countdown, panicState]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Emergency Alert',
      'Are you sure you want to cancel?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => router.push('/homescreen')
        }
      ]
    );
  };

  const handleImSafe = () => {
    Alert.alert(
      'Confirm You Are Safe',
      'This will cancel emergency response and notify contacts.',
      [
        { text: 'Not Safe', style: 'cancel' },
        {
          text: 'I Am Safe',
          onPress: () => {
            setPanicState('safe');
            setIsRecordingAudio(false);
            setTimeout(() => router.push('/homescreen'), 3000);
          }
        }
      ]
    );
  };

  const renderCountdownScreen = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.countdownContent}>
        <Text style={styles.helpText}>EMERGENCY ALERT</Text>
        <Text style={styles.activatingText}>Activating in</Text>
        
        <View style={styles.countdownDisplay}>
          <Text style={styles.countdownNumber}>{countdown}</Text>
          <Text style={styles.secondsText}>seconds</Text>
        </View>

        <View style={styles.statusList}>
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Alerting emergency contacts</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Sharing current location</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Preparing emergency services</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={handleCancel}
      >
        <Text style={styles.cancelButtonText}>CANCEL</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderActiveScreen = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView style={styles.activeContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.alertSentSection}>
          <Text style={styles.alertSentTitle}>EMERGENCY ALERT SENT</Text>
          <Text style={styles.alertSentSubtext}>Emergency services have been notified</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactsList}>
            {mockEmergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Text style={[
                  styles.contactStatus,
                  contact.status === 'delivered' ? styles.statusDelivered : styles.statusSent
                ]}>
                  {contact.status.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Response</Text>
          
          <View style={styles.responseItem}>
            <Text style={styles.responseLabel}>Police Response</Text>
            <Text style={styles.responseValue}>ETA: {policeETA}</Text>
          </View>
          
          <View style={styles.responseItem}>
            <Text style={styles.responseLabel}>Location Shared</Text>
            <Text style={styles.locationAddress}>{mockLocation.address}</Text>
          </View>

          {isRecordingAudio && (
            <View style={styles.recordingItem}>
              <View style={styles.recordingIndicator} />
              <Text style={styles.recordingText}>Audio Recording Active</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.safeButton}
          onPress={handleImSafe}
        >
          <Text style={styles.safeButtonText}>I AM SAFE</Text>
          <Text style={styles.safeButtonSubtext}>Cancel emergency response</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );

  const renderSafeScreen = () => (
    <View style={styles.safeContainer}>
      <Text style={styles.safeTitle}>EMERGENCY CANCELLED</Text>
      <Text style={styles.safeSubtext}>Your contacts have been notified that you are safe</Text>
    </View>
  );

  return (
    <SafeAreaView 
      style={[
        styles.wrapper,
        panicState === 'safe' ? styles.safeBackground : styles.emergencyBackground
      ]} 
      edges={['top', 'bottom']}
    >
      {panicState === 'countdown' && renderCountdownScreen()}
      {panicState === 'active' && renderActiveScreen()}
      {panicState === 'safe' && renderSafeScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  emergencyBackground: {
    backgroundColor: '#DC2626',
  },
  safeBackground: {
    backgroundColor: '#059669',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  // Countdown Screen
  countdownContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
  },
  activatingText: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 40,
  },
  countdownDisplay: {
    alignItems: 'center',
    marginBottom: 60,
  },
  countdownNumber: {
    fontSize: 96,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 96,
  },
  secondsText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 8,
  },
  
  statusList: {
    width: '100%',
    maxWidth: 300,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 40,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Active Emergency Screen
  activeContent: {
    flex: 1,
  },
  alertSentSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 32,
  },
  alertSentTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  alertSentSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },

  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  // Contacts
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  contactStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusDelivered: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    color: '#FFFFFF',
  },
  statusSent: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    color: '#FFFFFF',
  },

  // Response
  responseItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  responseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationAddress: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },

  // Recording
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 12,
  },
  recordingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Safe Button
  safeButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 18,
    marginTop: 20,
    alignItems: 'center',
  },
  safeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 1,
  },
  safeButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Safe Screen
  safeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  safeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  safeSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
  },

  bottomSpacer: {
    height: 40,
  },
});