import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Generate unique tourist ID
const generateTouristID = () => {
  const prefix = 'TID';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

// Minimal QR Code Component
const MinimalQRCode = ({ data, size = 160 }) => {
  const createPattern = (input) => {
    const hash = Array.from(input).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern = [];
    for (let i = 0; i < 21; i++) {
      pattern[i] = [];
      for (let j = 0; j < 21; j++) {
        const seed = hash + i * 21 + j;
        pattern[i][j] = (seed * 1103515245 + 12345) % 2 === 1;
      }
    }
    
    // Add corner patterns
    const addCorner = (startRow, startCol) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            pattern[startRow + i][startCol + j] = true;
          } else {
            pattern[startRow + i][startCol + j] = false;
          }
        }
      }
    };
    
    addCorner(0, 0);
    addCorner(0, 14);
    addCorner(14, 0);
    
    return pattern;
  };

  const pattern = createPattern(data);
  const cellSize = size / 21;

  return (
    <View style={[styles.qrContainer, { width: size, height: size }]}>
      {pattern.map((row, i) => (
        <View key={i} style={styles.qrRow}>
          {row.map((cell, j) => (
            <View
              key={j}
              style={[
                styles.qrCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? '#000' : '#fff',
                }
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

// Minimal Progress Dot
const ProgressDot = ({ active, delay = 0 }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.3)',
  }));

  return <Animated.View style={[styles.progressDot, animatedStyle]} />;
};

export default function BlockchainAnimation() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('creating');
  const [touristId, setTouristId] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  const progressWidth = useSharedValue(0);
  const qrScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Entry animation - smooth, no bounce
    fadeIn.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
    slideUp.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });

    // Start process
    setTimeout(() => {
      startProcess();
    }, 1500);
  }, []);

  const startProcess = async () => {
    // Progress animation
    progressWidth.value = withTiming(1, {
      duration: 4000,
      easing: Easing.out(Easing.exp),
    });

    // Update progress counter
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        if (newProgress % 25 === 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        return newProgress;
      });
    }, 40);

    // Complete after 4 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      const id = generateTouristID();
      setTouristId(id);
      setIsCompleted(true);
      
      // Show QR code - smooth scale, no bounce
      setTimeout(() => {
        qrScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 300);

      // Show button
      setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 600 });
      }, 800);
    }, 4000);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/homescreen');
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const qrStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qrScale.value }],
    opacity: qrScale.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, containerStyle]}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark-outline" size={32} color="#fff" />
              </View>
              <Text style={styles.title}>Digital Identity</Text>
              <Text style={styles.subtitle}>Blockchain secured</Text>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <Text style={styles.progressText}>{progress}%</Text>
              
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
              
              <Text style={styles.statusText}>
                {!isCompleted ? 'Creating your secure identity...' : 'Identity created successfully'}
              </Text>

              {/* Progress dots */}
              <View style={styles.dotsContainer}>
                <ProgressDot active={progress >= 25} delay={0} />
                <ProgressDot active={progress >= 50} delay={200} />
                <ProgressDot active={progress >= 75} delay={400} />
                <ProgressDot active={progress >= 100} delay={600} />
              </View>
            </View>

            {/* QR Code Section */}
            {isCompleted && (
              <Animated.View style={[styles.qrSection, qrStyle]}>
                <Text style={styles.qrTitle}>Your Tourist ID</Text>
                
                <View style={styles.qrWrapper}>
                  <MinimalQRCode 
                    data={JSON.stringify({
                      id: touristId,
                      type: 'TOURIST_DIGITAL_ID',
                      timestamp: Date.now(),
                    })}
                    size={160}
                  />
                </View>
                
                <View style={styles.idContainer}>
                  <Text style={styles.idNumber}>{touristId}</Text>
                </View>
              </Animated.View>
            )}

            {/* Continue Button */}
            {isCompleted && (
              <Animated.View style={[styles.buttonContainer, buttonStyle]}>
                <TouchableOpacity 
                  style={styles.continueButton} 
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" style={styles.buttonIcon} />
                </TouchableOpacity>
              </Animated.View>
            )}

          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 80,
    width: '100%',
  },
  progressText: {
    fontSize: 48,
    fontWeight: '100',
    color: '#fff',
    marginBottom: 32,
    letterSpacing: 2,
  },
  progressBar: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '300',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  qrTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 32,
    fontWeight: '300',
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    // Styles applied inline
  },
  idContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  idNumber: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});