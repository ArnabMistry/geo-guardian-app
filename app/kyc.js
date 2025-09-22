import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
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

export default function KYCInformation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    documentType: 'Aadhaar',
    documentNumber: '',
    phoneNumber: '',
    emailAddress: '',
    emergencyContact1Name: '',
    emergencyContact1Number: '',
    emergencyContact2Name: '',
    emergencyContact2Number: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.documentNumber.trim()) newErrors.documentNumber = 'Document number is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email address is required';
    if (!formData.emergencyContact1Name.trim()) newErrors.emergencyContact1Name = 'Emergency contact name is required';
    if (!formData.emergencyContact1Number.trim()) newErrors.emergencyContact1Number = 'Emergency contact number is required';
    
    // Email validation
    if (formData.emailAddress && !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    
    // Phone validation (basic)
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      console.log('Form data:', formData);
      router.push("/verification");
    }
    //router.push("/verification");
  };

  const selectDocumentType = (type) => {
    handleInputChange('documentType', type);
    setShowDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={styles.mountainSilhouette1} />
        <View style={styles.mountainSilhouette2} />
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
          <Text style={styles.progressText}>Step 2 of 4</Text>
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
          <Text style={styles.headerTitle}>KYC Information</Text>
          <Text style={styles.headerSubtitle}>Provide your details for identity verification</Text>
          <View style={styles.headerUnderline} />
        </Animated.View>

        {/* Form Section */}
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, errors.fullName && styles.inputError]}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
            />
            {/* {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>} */}
          </View>

          {/* Document Type Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Document Type *</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowDropdown(true)}
            >
              <Text style={styles.dropdownText}>{formData.documentType}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Document Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {formData.documentType} Number *
            </Text>
            <TextInput
              style={[styles.textInput, errors.documentNumber && styles.inputError]}
              value={formData.documentNumber}
              onChangeText={(value) => handleInputChange('documentNumber', value)}
              placeholder={`Enter your ${formData.documentType.toLowerCase()} number`}
              placeholderTextColor="#94A3B8"
              secureTextEntry={formData.documentType === 'Aadhaar'}
            />
            {/* {errors.documentNumber && <Text style={styles.errorText}>{errors.documentNumber}</Text>} */}
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={[styles.textInput, errors.phoneNumber && styles.inputError]}
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder="Enter your phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
            {/* {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>} */}
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={[styles.textInput, errors.emailAddress && styles.inputError]}
              value={formData.emailAddress}
              onChangeText={(value) => handleInputChange('emailAddress', value)}
              placeholder="Enter your email address"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {/* {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress}</Text>} */}
          </View>

          {/* Emergency Contact 1 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contact 1</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name *</Text>
            <TextInput
              style={[styles.textInput, errors.emergencyContact1Name && styles.inputError]}
              value={formData.emergencyContact1Name}
              onChangeText={(value) => handleInputChange('emergencyContact1Name', value)}
              placeholder="Enter contact name"
              placeholderTextColor="#94A3B8"
            />
            {/* {errors.emergencyContact1Name && <Text style={styles.errorText}>{errors.emergencyContact1Name}</Text>} */}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Number *</Text>
            <TextInput
              style={[styles.textInput, errors.emergencyContact1Number && styles.inputError]}
              value={formData.emergencyContact1Number}
              onChangeText={(value) => handleInputChange('emergencyContact1Number', value)}
              placeholder="Enter contact number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
            {/* {errors.emergencyContact1Number && <Text style={styles.errorText}>{errors.emergencyContact1Number}</Text>} */}
          </View>

          {/* Emergency Contact 2 */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contact 2 (Optional)</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.emergencyContact2Name}
              onChangeText={(value) => handleInputChange('emergencyContact2Name', value)}
              placeholder="Enter contact name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Number</Text>
            <TextInput
              style={styles.textInput}
              value={formData.emergencyContact2Number}
              onChangeText={(value) => handleInputChange('emergencyContact2Number', value)}
              placeholder="Enter contact number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Button */}
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
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Document Type Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>Select Document Type</Text>
            
            <TouchableOpacity 
              style={[styles.dropdownOption, formData.documentType === 'Aadhaar' && styles.selectedOption]}
              onPress={() => selectDocumentType('Aadhaar')}
            >
              <Text style={[styles.dropdownOptionText, formData.documentType === 'Aadhaar' && styles.selectedOptionText]}>
                Aadhaar Card
              </Text>
              {formData.documentType === 'Aadhaar' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.dropdownOption, formData.documentType === 'Passport' && styles.selectedOption]}
              onPress={() => selectDocumentType('Passport')}
            >
              <Text style={[styles.dropdownOptionText, formData.documentType === 'Passport' && styles.selectedOptionText]}>
                Passport
              </Text>
              {formData.documentType === 'Passport' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowDropdown(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderTopRightRadius: 100,
    transform: [{ rotate: '15deg' }],
  },
  mountainSilhouette2: {
    position: 'absolute',
    bottom: 0,
    right: -50,
    width: 180,
    height: 120,
    backgroundColor: 'rgba(59, 130, 246, 0.03)',
    borderTopLeftRadius: 90,
    transform: [{ rotate: '-10deg' }],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
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
    width: '50%', // Step 2 of 4
    height: '100%',
    backgroundColor: '#059669',
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
    marginBottom: 30,
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
    backgroundColor: '#059669',
    borderRadius: 1.5,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
    marginBottom: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#CBD5E1',
    fontSize: 12,
  },
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
  nextButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  buttonArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dropdownModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  selectedOption: {
    backgroundColor: '#059669',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});