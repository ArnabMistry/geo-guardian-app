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
  SafeAreaView,
  Modal
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function RegistrationChoice() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animation
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

    // Button pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 0.95,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleRegisterNow = () => {
    if (termsAccepted) {
      router.push("/kyc");
    } else {
      // Show alert or highlight terms checkbox
      console.log("Please accept terms and conditions");
    }
  };

  const toggleTerms = () => {
    setTermsAccepted(!termsAccepted);
  };

  const openInfoModal = () => {
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
  };

  const handleTermsPress = () => {
    router.push("/terms"); // Navigate to terms page
  };

  const handlePrivacyPress = () => {
    router.push("/privacy"); // Navigate to privacy page
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={styles.mountainSilhouette1} />
        <View style={styles.mountainSilhouette2} />
        <View style={styles.traditionalPattern1} />
        <View style={styles.traditionalPattern2} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <Animated.View 
          style={[
            styles.progressContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Step 1 of 4</Text>
        </Animated.View>

        {/* Header Section */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.headerTitle}>Create Your Tourist Profile</Text>
          <Text style={styles.headerSubtitle}>Get started with secure digital identity</Text>
          <View style={styles.headerUnderline} />
        </Animated.View>

        {/* Supporting Information Card */}
        <Animated.View 
          style={[
            styles.infoCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.infoCardContent}>
            <View style={styles.infoItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.infoText}>We support both Aadhaar and Passport verification</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.infoText}>Your documents are encrypted and secure</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.infoText}>Quick setup in under 3 minutes</Text>
            </View>
          </View>
        </Animated.View>

        {/* Trust Badges */}
        <Animated.View 
          style={[
            styles.trustBadges,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🔐</Text>
            <Text style={styles.badgeText}>256-bit SSL</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🏛️</Text>
            <Text style={styles.badgeText}>Govt. Verified</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🛡️</Text>
            <Text style={styles.badgeText}>ISO Certified</Text>
          </View>
        </Animated.View>

        {/* Footer Elements */}
        <Animated.View 
          style={[
            styles.footerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Why do we need this link */}
          <TouchableOpacity onPress={openInfoModal} style={styles.infoLink}>
            <Text style={styles.infoLinkText}>Why do we need this?</Text>
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity onPress={toggleTerms} style={styles.checkboxContainer}>
              <View style={[styles.checkbox, termsAccepted && styles.checkedCheckbox]}>
                {termsAccepted && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink} onPress={handleTermsPress}>
                    Terms & Conditions
                  </Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Register Button */}
      <Animated.View 
        style={[
          styles.bottomButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.registerButton,
            !termsAccepted && styles.disabledButton
          ]}
          onPress={handleRegisterNow}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconWrapper}>
              <Text style={styles.buttonIcon}>🛡️</Text>
            </View>
            <Text style={[
              styles.buttonText,
              !termsAccepted && styles.disabledButtonText
            ]}>
              Register Now
            </Text>
            <Text style={[
              styles.buttonArrow,
              !termsAccepted && styles.disabledButtonText
            ]}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Information Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why Digital Identity?</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🔐 Digital ID Creation</Text>
              <Text style={styles.modalText}>
                We create a secure blockchain-based digital identity that verifies your tourist status across Northeast India.
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🛡️ Security Benefits</Text>
              <Text style={styles.modalText}>
                Your identity is protected with advanced encryption, preventing fraud and ensuring secure transactions.
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🏛️ Government Compliance</Text>
              <Text style={styles.modalText}>
                Required for safety monitoring and emergency response as per tourism safety regulations.
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🔒 Data Protection</Text>
              <Text style={styles.modalText}>
                Your data is encrypted end-to-end and never shared without explicit consent. We comply with all data protection laws.
              </Text>
            </View>

            <TouchableOpacity onPress={closeInfoModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mountainSilhouette1: {
    position: 'absolute',
    bottom: 0,
    left: -50,
    width: 200,
    height: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderTopRightRadius: 100,
    transform: [{ rotate: '15deg' }],
  },
  mountainSilhouette2: {
    position: 'absolute',
    bottom: 0,
    right: -50,
    width: 180,
    height: 120,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderTopLeftRadius: 90,
    transform: [{ rotate: '-10deg' }],
  },
  traditionalPattern1: {
    position: 'absolute',
    top: 100,
    right: 30,
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    borderStyle: 'dashed',
  },
  traditionalPattern2: {
    position: 'absolute',
    top: 200,
    left: 40,
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    transform: [{ rotate: '45deg' }],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120, // Extra space for bottom button
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60, // More space from notification bar
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    width: '25%',
    height: '100%',
    backgroundColor: '#059669', // Match button color
    borderRadius: 2,
  },
  progressText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30, // Reduced margin
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 20,
  },
  headerUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#059669', // Match the new color scheme
    borderRadius: 1.5,
  },
  mainButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  // Bottom fixed button container
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  registerButton: {
    backgroundColor: '#059669', // Modern green color
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#374151', // Subtle gray when disabled
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 12,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buttonArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 30,
  },
  infoCardContent: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkmark: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    minWidth: 90,
  },
  badgeIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  badgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  infoLink: {
    marginBottom: 25,
  },
  infoLinkText: {
    color: '#60A5FA',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  termsContainer: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsTextContainer: {
    flex: 1,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#60A5FA',
    textDecorationLine: 'underline',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalCloseButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});