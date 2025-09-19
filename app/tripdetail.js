import React, { useState, useRef, useEffect } from "react";
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
  TextInput,
  Alert
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Northeast destinations with their unique attractions
const destinations = [
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', attraction: '🏛️ Kamakhya Temple' },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', attraction: '🌧️ Scotland of the East' },
  { id: 'imphal', name: 'Imphal', state: 'Manipur', attraction: '🏞️ Loktak Lake' },
  { id: 'kohima', name: 'Kohima', state: 'Nagaland', attraction: '🌺 Dzukou Valley' },
  { id: 'aizawl', name: 'Aizawl', state: 'Mizoram', attraction: '🏔️ Blue Mountains' },
  { id: 'agartala', name: 'Agartala', state: 'Tripura', attraction: '🏛️ Ujjayanta Palace' },
  { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', attraction: '🏔️ Kanchenjunga Views' },
  { id: 'itanagar', name: 'Itanagar', state: 'Arunachal Pradesh', attraction: '🌄 Eastern Himalayas' },
  { id: 'tezpur', name: 'Tezpur', state: 'Assam', attraction: '🌸 City of Eternal Romance' },
  { id: 'cherrapunji', name: 'Cherrapunji', state: 'Meghalaya', attraction: '☔ Wettest Place on Earth' },
  { id: 'dawki', name: 'Dawki', state: 'Meghalaya', attraction: '💎 Crystal Clear River' },
  { id: 'tawang', name: 'Tawang', state: 'Arunachal Pradesh', attraction: '🏔️ Himalayan Monastery' },
];

const visitPurposes = [
  { id: 'tourism', label: 'Tourism', icon: '🏞️', description: 'Explore the natural beauty' },
  { id: 'business', label: 'Business', icon: '💼', description: 'Professional meetings' },
  { id: 'education', label: 'Education', icon: '🎓', description: 'Academic purposes' },
  { id: 'other', label: 'Other', icon: '📝', description: 'Specify your purpose' },
];

const travelModes = [
  { id: 'solo', label: 'Solo Travel', icon: '🚶', description: 'Exploring on your own' },
  { id: 'group', label: 'Group Travel', icon: '👥', description: 'With friends/colleagues' },
  { id: 'family', label: 'Family Trip', icon: '👨‍👩‍👧‍👦', description: 'Family vacation' },
];

export default function TripDetails() {
  return (
    <SafeAreaProvider>
      <TripDetailsContent />
    </SafeAreaProvider>
  );
}

function TripDetailsContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    visitPurpose: '',
    fromDate: '',
    toDate: '',
    selectedDestinations: [],
    travelMode: '',
    accommodationDetails: '',
  });
  
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [showDestinationsModal, setShowDestinationsModal] = useState(false);
  const [showTravelModeModal, setShowTravelModeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({ type: '', show: false });
  const [errors, setErrors] = useState({});
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start animations
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
    
    // Clear error when user makes a change
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const toggleDestination = (destinationId) => {
    const currentDestinations = formData.selectedDestinations;
    if (currentDestinations.includes(destinationId)) {
      handleInputChange('selectedDestinations', 
        currentDestinations.filter(id => id !== destinationId)
      );
    } else {
      handleInputChange('selectedDestinations', 
        [...currentDestinations, destinationId]
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.visitPurpose) newErrors.visitPurpose = 'Visit purpose is required';
    if (!formData.fromDate) newErrors.fromDate = 'Start date is required';
    if (!formData.toDate) newErrors.toDate = 'End date is required';
    if (formData.selectedDestinations.length === 0) {
      newErrors.selectedDestinations = 'Please select at least one destination';
    }
    if (!formData.travelMode) newErrors.travelMode = 'Travel mode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Trip details:', formData);
      Alert.alert(
        'Registration Complete! 🎉',
        'Welcome to Northeast India! Your digital tourist profile has been created successfully.',
        [
          {
            text: 'Start Exploring',
            onPress: () => {
              // Navigate to main app or dashboard
              console.log('Navigate to main app');
            }
          }
        ]
      );
    }
  };

  const getSelectedDestinationsText = () => {
    if (formData.selectedDestinations.length === 0) {
      return 'Select destinations to explore';
    }
    if (formData.selectedDestinations.length === 1) {
      const dest = destinations.find(d => d.id === formData.selectedDestinations[0]);
      return dest ? dest.name : '';
    }
    return `${formData.selectedDestinations.length} destinations selected`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          <Text style={styles.progressText}>Step 4 of 4</Text>
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
          <Text style={styles.headerTitle}>Plan Your Northeast Adventure</Text>
          <Text style={styles.headerSubtitle}>Discover the hidden gems of Seven Sisters</Text>
          <View style={styles.headerUnderline} />
        </Animated.View>

        {/* Tourism Promotion Banner */}
        <Animated.View 
          style={[
            styles.promotionBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.promotionTitle}>🌄 Northeast India Awaits</Text>
          <Text style={styles.promotionText}>
            From the misty hills of Meghalaya to the pristine valleys of Arunachal Pradesh, 
            experience India's most diverse and beautiful region!
          </Text>
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
          
          {/* Visit Purpose */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What brings you to Northeast? *</Text>
            <TouchableOpacity 
              style={[styles.dropdown, errors.visitPurpose && styles.inputError]}
              onPress={() => setShowPurposeModal(true)}
            >
              <Text style={[
                styles.dropdownText,
                !formData.visitPurpose && styles.placeholderText
              ]}>
                {formData.visitPurpose ? 
                  visitPurposes.find(p => p.id === formData.visitPurpose)?.label 
                  : 'Select your visit purpose'
                }
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {errors.visitPurpose && <Text style={styles.errorText}>{errors.visitPurpose}</Text>}
          </View>

          {/* Date Selection */}
          <View style={styles.dateRow}>
            <View style={styles.dateGroup}>
              <Text style={styles.inputLabel}>Journey Starts *</Text>
              <TouchableOpacity 
                style={[styles.dateInput, errors.fromDate && styles.inputError]}
                onPress={() => setShowDatePicker({ type: 'from', show: true })}
              >
                <Text style={[
                  styles.dateText,
                  !formData.fromDate && styles.placeholderText
                ]}>
                  {formData.fromDate || 'From Date'}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
              {errors.fromDate && <Text style={styles.errorText}>{errors.fromDate}</Text>}
            </View>

            <View style={styles.dateGroup}>
              <Text style={styles.inputLabel}>Journey Ends *</Text>
              <TouchableOpacity 
                style={[styles.dateInput, errors.toDate && styles.inputError]}
                onPress={() => setShowDatePicker({ type: 'to', show: true })}
              >
                <Text style={[
                  styles.dateText,
                  !formData.toDate && styles.placeholderText
                ]}>
                  {formData.toDate || 'To Date'}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
              {errors.toDate && <Text style={styles.errorText}>{errors.toDate}</Text>}
            </View>
          </View>

          {/* Destinations Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Choose Your Destinations *</Text>
            <Text style={styles.inputSubtext}>Select the places you want to explore</Text>
            <TouchableOpacity 
              style={[styles.dropdown, errors.selectedDestinations && styles.inputError]}
              onPress={() => setShowDestinationsModal(true)}
            >
              <Text style={[
                styles.dropdownText,
                formData.selectedDestinations.length === 0 && styles.placeholderText
              ]}>
                {getSelectedDestinationsText()}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {errors.selectedDestinations && <Text style={styles.errorText}>{errors.selectedDestinations}</Text>}
          </View>

          {/* Travel Mode */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>How are you traveling? *</Text>
            <TouchableOpacity 
              style={[styles.dropdown, errors.travelMode && styles.inputError]}
              onPress={() => setShowTravelModeModal(true)}
            >
              <Text style={[
                styles.dropdownText,
                !formData.travelMode && styles.placeholderText
              ]}>
                {formData.travelMode ? 
                  travelModes.find(t => t.id === formData.travelMode)?.label 
                  : 'Select travel mode'
                }
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {errors.travelMode && <Text style={styles.errorText}>{errors.travelMode}</Text>}
          </View>

          {/* Accommodation Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Accommodation Preferences (Optional)</Text>
            <Text style={styles.inputSubtext}>Hotel names, booking details, or preferences</Text>
            <TextInput
              style={styles.textArea}
              value={formData.accommodationDetails}
              onChangeText={(value) => handleInputChange('accommodationDetails', value)}
              placeholder="e.g., Booked at Hotel Nefa, Prefer mountain view rooms..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>

        </Animated.View>

        {/* Tourism Highlights */}
        <Animated.View 
          style={[
            styles.highlightsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.highlightsTitle}>✨ What Makes Northeast Special</Text>
          <View style={styles.highlightsList}>
            <Text style={styles.highlightItem}>🏔️ Himalayan peaks and pristine valleys</Text>
            <Text style={styles.highlightItem}>🌿 Rich biodiversity and wildlife sanctuaries</Text>
            <Text style={styles.highlightItem}>🎭 Diverse tribal cultures and festivals</Text>
            <Text style={styles.highlightItem}>🍜 Unique cuisine and local delicacies</Text>
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
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Generate Blockchain ID</Text>
          {/* <Text style={styles.buttonArrow}>🎉</Text> */}
        </TouchableOpacity>
      </Animated.View>

      {/* Visit Purpose Modal */}
      <Modal
        visible={showPurposeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPurposeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What brings you to Northeast India?</Text>
            
            {visitPurposes.map((purpose) => (
              <TouchableOpacity
                key={purpose.id}
                style={[
                  styles.optionItem,
                  formData.visitPurpose === purpose.id && styles.selectedOption
                ]}
                onPress={() => {
                  handleInputChange('visitPurpose', purpose.id);
                  setShowPurposeModal(false);
                }}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{purpose.icon}</Text>
                  <View style={styles.optionText}>
                    <Text style={[
                      styles.optionLabel,
                      formData.visitPurpose === purpose.id && styles.selectedOptionText
                    ]}>
                      {purpose.label}
                    </Text>
                    <Text style={styles.optionDescription}>{purpose.description}</Text>
                  </View>
                  {formData.visitPurpose === purpose.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowPurposeModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Destinations Modal */}
      <Modal
        visible={showDestinationsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDestinationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Destinations</Text>
            <Text style={styles.modalSubtitle}>Select multiple places to explore</Text>
            
            <ScrollView style={styles.destinationsGrid}>
              {destinations.map((destination) => (
                <TouchableOpacity
                  key={destination.id}
                  style={[
                    styles.destinationItem,
                    formData.selectedDestinations.includes(destination.id) && styles.selectedDestination
                  ]}
                  onPress={() => toggleDestination(destination.id)}
                >
                  <View style={styles.destinationContent}>
                    <View style={styles.destinationInfo}>
                      <Text style={[
                        styles.destinationName,
                        formData.selectedDestinations.includes(destination.id) && styles.selectedDestinationText
                      ]}>
                        {destination.name}
                      </Text>
                      <Text style={styles.destinationState}>{destination.state}</Text>
                      <Text style={styles.destinationAttraction}>{destination.attraction}</Text>
                    </View>
                    {formData.selectedDestinations.includes(destination.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowDestinationsModal(false)}
            >
              <Text style={styles.modalCloseText}>Done ({formData.selectedDestinations.length} selected)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Travel Mode Modal */}
      <Modal
        visible={showTravelModeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTravelModeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How are you traveling?</Text>
            
            {travelModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.optionItem,
                  formData.travelMode === mode.id && styles.selectedOption
                ]}
                onPress={() => {
                  handleInputChange('travelMode', mode.id);
                  setShowTravelModeModal(false);
                }}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{mode.icon}</Text>
                  <View style={styles.optionText}>
                    <Text style={[
                      styles.optionLabel,
                      formData.travelMode === mode.id && styles.selectedOptionText
                    ]}>
                      {mode.label}
                    </Text>
                    <Text style={styles.optionDescription}>{mode.description}</Text>
                  </View>
                  {formData.travelMode === mode.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowTravelModeModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Simple Date Picker Modal */}
      <Modal
        visible={showDatePicker.show}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker({ type: '', show: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContent}>
            <Text style={styles.modalTitle}>
              Select {showDatePicker.type === 'from' ? 'Start' : 'End'} Date
            </Text>
            
            <TextInput
              style={styles.datePickerInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
              value={showDatePicker.type === 'from' ? formData.fromDate : formData.toDate}
              onChangeText={(date) => {
                if (showDatePicker.type === 'from') {
                  handleInputChange('fromDate', date);
                } else {
                  handleInputChange('toDate', date);
                }
              }}
            />
            
            <View style={styles.datePickerButtons}>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => {
                  const today = getCurrentDate();
                  if (showDatePicker.type === 'from') {
                    handleInputChange('fromDate', today);
                  } else {
                    handleInputChange('toDate', today);
                  }
                }}
              >
                <Text style={styles.datePickerButtonText}>Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker({ type: '', show: false })}
              >
                <Text style={styles.modalCloseText}>Done</Text>
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
    backgroundColor: '#1E3A8A',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    width: '100%', // Step 4 of 4 - Complete!
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FCD34D',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 15,
  },
  headerUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#059669',
    borderRadius: 1.5,
  },
  promotionBanner: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FCD34D',
    marginBottom: 10,
    textAlign: 'center',
  },
  promotionText: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  dropdownArrow: {
    color: '#CBD5E1',
    fontSize: 12,
    marginLeft: 10,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dateGroup: {
    flex: 0.48,
  },
  dateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  calendarIcon: {
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  highlightsContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  highlightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 15,
    textAlign: 'center',
  },
  highlightsList: {
    gap: 10,
  },
  highlightItem: {
    fontSize: 14,
    color: '#D1FAE5',
    lineHeight: 20,
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
  submitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 18,
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
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 10,
  },
  buttonArrow: {
    fontSize: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionItem: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#D1FAE5',
    borderColor: '#059669',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#059669',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  checkmark: {
    color: '#059669',
    fontSize: 20,
    fontWeight: 'bold',
  },
  destinationsGrid: {
    maxHeight: height * 0.5,
  },
  destinationItem: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDestination: {
    backgroundColor: '#D1FAE5',
    borderColor: '#059669',
  },
  destinationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedDestinationText: {
    color: '#059669',
  },
  destinationState: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  destinationAttraction: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '500',
  },
  datePickerContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  datePickerInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  datePickerButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  modalCloseButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});