import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import { useRouter } from "expo-router";

export default function Terms() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: September 2025</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By using Smart Tourist Safety app, you agree to these terms and conditions. 
          If you do not agree, please do not use our services.
        </Text>

        <Text style={styles.sectionTitle}>2. Digital Identity Verification</Text>
        <Text style={styles.text}>
          • We verify your identity using Aadhaar or Passport{'\n'}
          • Your documents are encrypted and stored securely{'\n'}
          • Identity verification is mandatory for safety compliance
        </Text>

        <Text style={styles.sectionTitle}>3. Location Services</Text>
        <Text style={styles.text}>
          • We track your location for safety monitoring{'\n'}
          • Location data is used for emergency response{'\n'}
          • You can disable location services in settings
        </Text>

        <Text style={styles.sectionTitle}>4. Emergency Response</Text>
        <Text style={styles.text}>
          • Emergency alerts are shared with local authorities{'\n'}
          • False emergency reports may result in penalties{'\n'}
          • Emergency contacts will be notified during incidents
        </Text>

        <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
        <Text style={styles.text}>
          • Provide accurate information during registration{'\n'}
          • Follow local laws and regulations{'\n'}
          • Report any app issues or security concerns
        </Text>

        <Text style={styles.sectionTitle}>6. Data Protection</Text>
        <Text style={styles.text}>
          • Your data is protected under applicable privacy laws{'\n'}
          • We do not share personal data without consent{'\n'}
          • Data retention follows government guidelines
        </Text>

        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.text}>
          The app provides safety assistance but does not guarantee prevention of all incidents. 
          Users are responsible for their own safety and decisions.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.text}>
          We may update these terms periodically. Continued use of the app constitutes 
          acceptance of updated terms.
        </Text>

        <Text style={styles.contact}>
          For questions, contact us at: support@smarttouristsafety.gov.in
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 34, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lastUpdated: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
  },
  text: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  contact: {
    color: '#60A5FA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
    fontStyle: 'italic',
  },
});