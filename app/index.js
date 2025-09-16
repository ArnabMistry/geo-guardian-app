import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing, 
  Image,
  Dimensions,
  StatusBar 
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  
  // Loading dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Sequential fade-in animation
    const entranceAnimation = Animated.sequence([
      // Logo appears first
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      
      // Title appears
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      
      // Underline expands
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      
      // Tagline appears
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    // Loading dots animation
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Start animations
    entranceAnimation.start();
    
    // Start loading animation after content appears
    setTimeout(() => {
      animateDot(dot1, 0);
      animateDot(dot2, 200);
      animateDot(dot3, 400);
    }, 2000);

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      router.push("/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const lineWidthInterpolated = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      {/* Clean background with subtle gradient */}
      <View style={styles.backgroundOverlay} />
      
      {/* Government/Official emblem or pattern - subtle */}
      <View style={styles.officialPattern}>
        <View style={styles.patternLine1} />
        <View style={styles.patternLine2} />
        <View style={styles.patternLine3} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            { opacity: logoOpacity }
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/100/FFFFFF/mountain.png" }}
              style={styles.logo}
            />
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View
          style={[
            styles.titleContainer,
            { opacity: titleOpacity }
          ]}
        >
          <Text style={styles.appName}>Smart Tourist Safety</Text>
          
          {/* Official underline */}
          <Animated.View
            style={[
              styles.titleUnderline,
              { width: lineWidthInterpolated }
            ]}
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            { opacity: taglineOpacity }
          ]}
        >
          <Text style={styles.tagline}>Your Digital Travel Guardian</Text>
        </Animated.View>

        {/* Loading dots */}
        <View style={styles.loadingSection}>
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                { 
                  opacity: dot1,
                  backgroundColor: "#F97316" 
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                { 
                  opacity: dot2,
                  backgroundColor: "#F97316" 
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                { 
                  opacity: dot3,
                  backgroundColor: "#F97316" 
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Footer - Optional official text */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>Ministry of Tourism • Government of India</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Your original deep blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 58, 138, 0.95)',
  },
  officialPattern: {
    position: 'absolute',
    top: 60,
    right: 40,
    opacity: 0.1,
  },
  patternLine1: {
    width: 100,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  patternLine2: {
    width: 80,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  patternLine3: {
    width: 60,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    width: 60,
    height: 60,
    tintColor: "#FFFFFF",
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  appName: {
    fontSize: 28,
    fontWeight: '300', // Lighter weight for official look
    color: "#FFFFFF",
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  titleUnderline: {
    height: 2,
    backgroundColor: '#F97316',
    borderRadius: 1,
  },
  taglineContainer: {
    marginBottom: 60,
  },
  tagline: {
    fontSize: 16,
    color: "#E5E7EB",
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  loadingSection: {
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerLine: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});