// app/privacy.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: September 2025</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          We value your trust and are committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, and safeguard
          your information when you use our services.
        </Text>

        <Text style={styles.sectionTitle}>2. Data Collection</Text>
        <Text style={styles.paragraph}>
          We collect only the necessary information required to provide our
          services, such as your name, contact details, and trip-related
          information. All data is securely stored and encrypted.
        </Text>

        <Text style={styles.sectionTitle}>3. Data Usage</Text>
        <Text style={styles.paragraph}>
          Your data is used strictly for service delivery, safety monitoring,
          and compliance with applicable laws. We do not sell or misuse your
          personal data under any circumstances.
        </Text>

        <Text style={styles.sectionTitle}>4. Blockchain Security</Text>
        <Text style={styles.paragraph}>
          To ensure integrity and transparency, parts of your data are verified
          using blockchain technology. This provides tamper-proof records and
          enhanced trust.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Sharing</Text>
        <Text style={styles.paragraph}>
          Your data may be shared with authorized safety authorities in case of
          emergencies, strictly on a need-to-know basis. Family or emergency
          contacts may also be notified with your consent.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, correct, or request deletion of your
          data. You may also withdraw consent for data usage at any time, in
          line with legal obligations.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          For any privacy-related queries, please contact our support team at:{"\n"}
          <Text style={styles.link}>support@smarttouristapp.com</Text>
        </Text>

        <Text style={styles.footer}>
          By continuing to use the app, you agree to the terms outlined in this
          Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // dark theme
    // paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#ccc",
  },
  link: {
    color: "#1E90FF",
  },
  footer: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 30,
  },
});
