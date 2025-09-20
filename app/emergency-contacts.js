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
  Linking,
  TextInput,
  Modal
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Mock data
const mockPrimaryContacts = [
  { id: 1, name: 'Mom', phone: '+91-98765-43210', relation: 'Mother' },
  { id: 2, name: 'Dad', phone: '+91-98765-43211', relation: 'Father' }
];

const mockFamilyFriends = [
  { id: 3, name: 'Sister - Priya', phone: '+91-98765-43212', relation: 'Sister' },
  { id: 4, name: 'Best Friend - Amit', phone: '+91-98765-43213', relation: 'Friend' },
  { id: 5, name: 'Uncle - Raj', phone: '+91-98765-43214', relation: 'Uncle' },
  { id: 6, name: 'Colleague - Sarah', phone: '+91-98765-43215', relation: 'Colleague' }
];

const officialServices = [
  { id: 'police', name: 'Police', number: '100', description: 'Emergency Police Services', location: 'Guwahati' },
  { id: 'medical', name: 'Medical Emergency', number: '108', description: 'Ambulance & Medical Emergency' },
  { id: 'tourist', name: 'Tourist Helpline', number: '1363', description: '24x7 Tourist Assistance' },
  { id: 'women', name: 'Women Helpline', number: '181', description: 'Women in Distress' }
];

export default function EmergencyContactsScreen() {
  return (
    <SafeAreaProvider>
      <EmergencyContactsContent />
    </SafeAreaProvider>
  );
}

function EmergencyContactsContent() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({
    familyFriends: false
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [isTestingSystem, setIsTestingSystem] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCall = (phoneNumber, contactName = '') => {
    Alert.alert(
      'Make Call',
      `Call ${contactName ? contactName + ' at ' : ''}${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`)
              .catch(err => console.error('Error making call:', err));
          }
        }
      ]
    );
  };

  const handleShareLocation = () => {
    Alert.alert(
      'Share Location',
      'Share your current location with all emergency contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            // In real app, would send location to all contacts
            Alert.alert('Location Shared', 'Your location has been shared with all emergency contacts.');
          }
        }
      ]
    );
  };

  const handleTestSystem = () => {
    setIsTestingSystem(true);
    Alert.alert(
      'Test Emergency System',
      'This will send a test alert to your primary contacts. Continue?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => setIsTestingSystem(false)
        },
        {
          text: 'Test',
          onPress: () => {
            setTimeout(() => {
              setIsTestingSystem(false);
              Alert.alert('Test Complete', 'Test alert sent successfully to primary contacts.');
            }, 3000);
          }
        }
      ]
    );
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      // In real app, would save to storage/database
      Alert.alert('Contact Added', `${newContact.name} has been added to your emergency contacts.`);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowAddContact(false);
    } else {
      Alert.alert('Invalid Input', 'Please fill in at least name and phone number.');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderContactItem = (contact, isPrimary = false) => (
    <View key={contact.id} style={[styles.contactItem, isPrimary && styles.primaryContactItem]}>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, isPrimary && styles.primaryContactName]}>
          {contact.name}
        </Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
        {contact.relation && (
          <Text style={styles.contactRelation}>{contact.relation}</Text>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.callButton, isPrimary && styles.primaryCallButton]}
        onPress={() => handleCall(contact.phone, contact.name)}
      >
        <Text style={styles.callButtonText}>CALL</Text>
      </TouchableOpacity>
    </View>
  );

  const renderServiceItem = (service) => (
    <TouchableOpacity 
      key={service.id}
      style={styles.serviceItem}
      onPress={() => handleCall(service.number, service.name)}
    >
      <View style={styles.serviceInfo}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceNumber}>{service.number}</Text>
        </View>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        {service.location && (
          <Text style={styles.serviceLocation}>Local: {service.location}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Primary Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Primary Emergency Contacts</Text>
            <Text style={styles.sectionSubtitle}>
              These contacts will be notified first in case of emergency
            </Text>
            <View style={styles.contactsList}>
              {mockPrimaryContacts.map(contact => renderContactItem(contact, true))}
            </View>
          </View>

          {/* Family & Friends */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('familyFriends')}
            >
              <Text style={styles.sectionTitle}>Family & Friends</Text>
              <View style={[
                styles.expandIcon, 
                expandedSections.familyFriends && styles.expandIconRotated
              ]} />
            </TouchableOpacity>
            
            {expandedSections.familyFriends && (
              <View style={styles.contactsList}>
                {mockFamilyFriends.map(contact => renderContactItem(contact))}
              </View>
            )}
          </View>

          {/* Official Emergency Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Official Emergency Services</Text>
            <Text style={styles.sectionSubtitle}>
              Government emergency helplines available 24/7
            </Text>
            <View style={styles.servicesList}>
              {officialServices.map(service => renderServiceItem(service))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowAddContact(true)}
            >
              <View style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Add Emergency Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShareLocation}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.actionButtonText}>Share My Location</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, isTestingSystem && styles.actionButtonDisabled]}
              onPress={handleTestSystem}
              disabled={isTestingSystem}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.actionButtonText}>
                {isTestingSystem ? 'Testing System...' : 'Test Emergency System'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Add Contact Modal */}
        <Modal
          visible={showAddContact}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddContact(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.addContactModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Emergency Contact</Text>
                <TouchableOpacity onPress={() => setShowAddContact(false)}>
                  <View style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newContact.name}
                    onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                    placeholder="Enter full name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newContact.phone}
                    onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                    placeholder="+91-98765-43210"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Relationship (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newContact.relation}
                    onChangeText={(text) => setNewContact(prev => ({ ...prev, relation: text }))}
                    placeholder="e.g., Brother, Friend, Colleague"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddContact}
                >
                  <Text style={styles.addButtonText}>ADD CONTACT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  expandIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
  expandIconRotated: {
    backgroundColor: '#6B7280',
  },

  // Contacts
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryContactItem: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FECACA',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  primaryContactName: {
    color: '#DC2626',
    fontWeight: '700',
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryCallButton: {
    backgroundColor: '#DC2626',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Services
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  serviceNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 1,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  serviceLocation: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },

  // Quick Actions
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 6,
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  addContactModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: height * 0.8,
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
  closeIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  bottomSpacer: {
    height: 40,
  },
});