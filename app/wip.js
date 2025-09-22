// app/wip.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function WIP() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>🚧 Work in Progress</Text>
      <Text style={styles.subtitle}>
        This feature is coming soon. Stay tuned!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/homescreen")}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // dark theme
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
