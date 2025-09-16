import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function IntroCarousel() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intro Carousel</Text>
      <Button title="Next" onPress={() => router.push("/registration")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
