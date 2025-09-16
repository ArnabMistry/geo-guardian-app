import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const dot1 = new Animated.Value(0);
  const dot2 = new Animated.Value(0);
  const dot3 = new Animated.Value(0);

  useEffect(() => {
    // Animate dots in loop
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      router.push("/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Placeholder Logo (replace with actual mountain silhouette) */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://img.icons8.com/ios-filled/100/FFFFFF/mountain.png" }}
          style={styles.logo}
        />
        <Text style={styles.appName}>Smart Tourist Safety</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>Your Digital Travel Guardian</Text>

      {/* Blockchain-style loading dots */}
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            { opacity: dot1, backgroundColor: "#F97316" },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { opacity: dot2, backgroundColor: "#F97316" },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { opacity: dot3, backgroundColor: "#F97316" },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A", // Deep blue background
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: "#FFFFFF",
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tagline: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
});
