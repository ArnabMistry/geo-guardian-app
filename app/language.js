import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LanguageSelection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Selection</Text>
      <Button title="Next" onPress={() => router.push("/carousel")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
