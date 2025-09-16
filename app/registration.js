import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RegistrationChoice() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Choice</Text>
      <Button title="Next" onPress={() => router.push("/kyc")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
