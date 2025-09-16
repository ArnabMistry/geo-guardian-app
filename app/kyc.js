import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function KYCInformation() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Information</Text>
      <Button title="Next" onPress={() => router.push("/verification")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
