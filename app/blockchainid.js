import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { DataStorage } from '../tourist-api/services/DataStorage';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.0.100:3001';

export default function BlockchainRegistration() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('creating');
  const [registrationData, setRegistrationData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  const progressWidth = useSharedValue(0);
  const qrScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Entry animation
    fadeIn.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
    slideUp.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });

    // Start blockchain registration process
    setTimeout(() => {
      startBlockchainRegistration();
    }, 1500);
  }, []);

const startBlockchainRegistration = async () => {
  try {
    setStage('Collecting registration data...');
    setProgress(0);
    progressWidth.value = 0;

    const allFormData = await DataStorage.getAllFormData();
    console.log('All form data before registration:', allFormData);

    if (!allFormData.kyc || !allFormData.trip) {
      throw new Error('Missing registration data'); // KYC or trip missing
    }

    setStage('Connecting to blockchain...');
    setProgress(30);
    progressWidth.value = withTiming(0.3, { duration: 500 });

    const registrationData = {
      ...allFormData.kyc,
      ...allFormData.trip,
      verification: allFormData.verification || null, // optional
      registrationDate: new Date().toISOString()
    };

    setStage('Submitting registration...');
    setProgress(60);
    progressWidth.value = withTiming(0.6, { duration: 500 });

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });

    const result = await response.json();
    console.log('Registration result:', result);

    if (result.success) {
      setProgress(100);
      progressWidth.value = withTiming(1, { duration: 800 });

      setRegistrationData(result);
      setIsCompleted(true);
      setStage('Registration Complete');

      qrScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
      buttonOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });

      await DataStorage.clearFormData(); // Clear all saved forms
    } else {
      throw new Error(result.error || 'Registration failed');
    }
  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message);
    setStage('Registration failed');
  }
};


  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/homescreen');
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setStage('creating');
    setIsCompleted(false);
    progressWidth.value = 0;
    qrScale.value = 0;
    buttonOpacity.value = 0;
    
    setTimeout(() => {
      startBlockchainRegistration();
    }, 500);
  };

  const copyToClipboard = async (text) => {
    // For React Native, you'd use @react-native-clipboard/clipboard
    // For now, just show an alert
    Alert.alert('Copied!', `${text.substring(0, 20)}... copied to clipboard`);
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const qrStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qrScale.value }],
    opacity: qrScale.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, containerStyle]}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={error ? "warning-outline" : "shield-checkmark-outline"} 
                  size={32} 
                  color={error ? "#EF4444" : "#059669"} 
                />
              </View>
              <Text style={styles.title}>Blockchain Registration</Text>
              <Text style={styles.subtitle}>
                {error ? "Registration Failed" : "Securing your digital identity"}
              </Text>
            </View>

            {/* Progress Section */}
            {!error && (
              <View style={styles.progressSection}>
                <Text style={styles.progressText}>{progress}%</Text>
                
                <View style={styles.progressBar}>
                  <Animated.View style={[styles.progressFill, progressStyle]} />
                </View>
                
                <Text style={styles.statusText}>{stage}</Text>

                {/* Blockchain Info */}
                <View style={styles.blockchainInfo}>
                  <Text style={styles.blockchainText}>⛓️ Polygon Network</Text>
                  <Text style={styles.blockchainSubtext}>Gas-efficient blockchain</Text>
                </View>
              </View>
            )}

            {/* Error Section */}
            {error && (
              <View style={styles.errorSection}>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorSubtext}>
                  Don't worry, your data is safe. Please try again.
                </Text>
              </View>
            )}

            {/* Success Section with QR Code */}
            {isCompleted && registrationData && (
              <Animated.View style={[styles.qrSection, qrStyle]}>
                <Text style={styles.qrTitle}>Your Digital Tourist ID</Text>
                
                <View style={styles.qrWrapper}>
                  <Image 
                    source={{ uri: registrationData.qrCode }} 
                    style={styles.qrImage}
                  />
                </View>
                
                <View style={styles.idContainer}>
                  <Text style={styles.idLabel}>Tourist ID</Text>
                  <TouchableOpacity 
                    onPress={() => copyToClipboard(registrationData.touristId)}
                    style={styles.idRow}
                  >
                    <Text style={styles.idNumber}>{registrationData.touristId}</Text>
                    <Ionicons name="copy-outline" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.blockchainDetails}>
                  <Text style={styles.detailsTitle}>Blockchain Details</Text>
                  
                  <TouchableOpacity 
                    onPress={() => copyToClipboard(registrationData.transactionHash)}
                    style={styles.detailRow}
                  >
                    <Text style={styles.detailLabel}>Transaction Hash:</Text>
                    <Text style={styles.detailValue}>
                      {registrationData.transactionHash?.substring(0, 10)}...
                    </Text>
                    <Ionicons name="copy-outline" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {/* Action Buttons */}
            <Animated.View style={[styles.buttonContainer, buttonStyle]}>
              {error ? (
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={handleRetry}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
              ) : isCompleted ? (
                <TouchableOpacity 
                  style={styles.continueButton} 
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Start Exploring</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>
              ) : null}
            </Animated.View>

          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  progressText: {
    fontSize: 42,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 24,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  blockchainInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.3)',
  },
  blockchainText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  blockchainSubtext: {
    fontSize: 12,
    color: 'rgba(16, 185, 129, 0.7)',
    marginTop: 2,
  },
  errorSection: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  errorSubtext: {
    fontSize: 14,
    color: 'rgba(239, 68, 68, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 24,
    fontWeight: '600',
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  idContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  idLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  idNumber: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 12,
    letterSpacing: 1,
  },
  blockchainDetails: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: 8,
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
});