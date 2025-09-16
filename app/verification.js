import { View, Text, StyleSheet } from "react-native";

export default function DocumentVerification() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document Verification</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
