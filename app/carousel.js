import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

const carouselData = [
  {
    id: 1,
    title: "Secure Digital ID",
    subtitle: "Get blockchain-secured digital tourist identity",
    icon: "📱",
    color: "#3B82F6",
    description: "Your identity is protected with advanced blockchain technology, ensuring secure and tamper-proof verification throughout your journey."
  },
  {
    id: 2,
    title: "Real-time Safety",
    subtitle: "AI-powered location monitoring & geo-fence alerts",
    icon: "🗺️",
    color: "#10B981",
    description: "Stay safe with intelligent location tracking and instant alerts when you enter or leave designated safety zones."
  },
  {
    id: 3,
    title: "Emergency Response",
    subtitle: "Instant help with one-tap emergency system",
    icon: "🚨",
    color: "#EF4444",
    description: "Get immediate assistance with our advanced emergency response system that connects you to help within seconds."
  }
];

export default function IntroCarousel() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = (event) => {
    const slideSize = width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentSlide(index);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentSlide < carouselData.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      router.push("/registration");
    }
  };

  const handleSkip = () => {
    router.push("/registration");
  };

  const renderSlide = (item, index) => {
    return (
      <View key={item.id} style={styles.slide}>
        <View style={styles.slideContent}>
          
          {/* Illustration Area */}
          <View style={[styles.illustrationContainer, { backgroundColor: item.color + '20' }]}>
            <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
              <Text style={styles.slideIcon}>{item.icon}</Text>
            </View>
            
            {/* Decorative elements based on slide */}
            {index === 0 && <BlockchainElements />}
            {index === 1 && <SafetyElements />}
            {index === 2 && <EmergencyElements />}
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {carouselData.map((item, index) => renderSlide(item, index))}
        </ScrollView>

        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {carouselData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.indicator,
                index === currentSlide && styles.activeIndicator
              ]}
            />
          ))}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            onPress={() => currentSlide > 0 && goToSlide(currentSlide - 1)}
            style={[
              styles.navButton,
              styles.backButton,
              currentSlide === 0 && styles.disabledButton
            ]}
            disabled={currentSlide === 0}
          >
            <Text style={[
              styles.navButtonText,
              currentSlide === 0 && styles.disabledButtonText
            ]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleNext}
            style={[styles.navButton, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide === carouselData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Text style={styles.navArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

// Decorative Elements for each slide
const BlockchainElements = () => (
  <View style={styles.decorativeElements}>
    <View style={[styles.chainLink, { top: 20, left: 20 }]} />
    <View style={[styles.chainLink, { top: 40, left: 40 }]} />
    <View style={[styles.chainLink, { top: 60, left: 60 }]} />
    <View style={[styles.securityBadge, { bottom: 30, right: 30 }]}>
      <Text style={styles.badgeText}>🔐</Text>
    </View>
  </View>
);

const SafetyElements = () => (
  <View style={styles.decorativeElements}>
    <View style={[styles.geoFence, { top: 30, left: 30 }]} />
    <View style={[styles.geoFence, { top: 50, right: 40 }]} />
    <View style={[styles.safetyPin, { bottom: 40, left: 40 }]}>
      <Text style={styles.pinText}>📍</Text>
    </View>
  </View>
);

const EmergencyElements = () => (
  <View style={styles.decorativeElements}>
    <View style={[styles.emergencyRing, { top: 25, left: 25 }]} />
    <View style={[styles.emergencyRing, { top: 35, left: 35 }]} />
    <View style={[styles.emergencyContact, { bottom: 35, right: 35 }]}>
      <Text style={styles.contactText}>📞</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '400',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  illustrationContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  slideIcon: {
    fontSize: 48,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chainLink: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderRadius: 4,
    position: 'absolute',
  },
  securityBadge: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  badgeText: {
    fontSize: 20,
  },
  geoFence: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 30,
    borderStyle: 'dashed',
    position: 'absolute',
  },
  safetyPin: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  pinText: {
    fontSize: 18,
  },
  emergencyRing: {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: '#EF4444',
    borderRadius: 40,
    position: 'absolute',
    opacity: 0.6,
  },
  emergencyContact: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  contactText: {
    fontSize: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  slideSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#F97316',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  slideDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '300',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#F97316',
    width: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextButton: {
    backgroundColor: '#F97316',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#64748B',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  navArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});