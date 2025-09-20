import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  RefreshControl
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Data Models - Easy to replace with API responses
const SCORE_THRESHOLDS = {
  HIGH: { min: 80, max: 100, color: '#10B981', label: 'High', bgColor: '#F0FDF4' },
  MEDIUM: { min: 50, max: 79, color: '#F59E0B', label: 'Medium', bgColor: '#FFFBEB' },
  LOW: { min: 0, max: 49, color: '#EF4444', label: 'Low', bgColor: '#FEF2F2' }
};

const FACTOR_TYPES = {
  LOCATION: {
    id: 'location',
    name: 'Current Location Safety',
    description: 'Safety rating of your current area',
    icon: '📍',
    weight: 0.3
  },
  TRAVEL_PATTERN: {
    id: 'travel_pattern',
    name: 'Travel Pattern Analysis',
    description: 'Your movement patterns and route safety',
    icon: '🗺️',
    weight: 0.25
  },
  TIME_FACTOR: {
    id: 'time_factor',
    name: 'Time of Day Factor',
    description: 'Safety considerations for current time',
    icon: '🕐',
    weight: 0.2
  },
  RECENT_INCIDENTS: {
    id: 'recent_incidents',
    name: 'Recent Area Incidents',
    description: 'Recent safety incidents in nearby areas',
    icon: '⚠️',
    weight: 0.25
  }
};

// Mock data structure - Replace with API calls
const mockSafetyData = {
  overallScore: 78,
  location: {
    name: 'Paltan Bazaar, Guwahati',
    coordinates: { lat: 26.1445, lng: 91.7362 }
  },
  factors: [
    {
      id: 'location',
      score: 85,
      trend: 'stable', // 'improving', 'declining', 'stable'
      lastUpdated: new Date(),
      details: {
        crimeRate: 'Low',
        policePresence: 'High',
        lightingQuality: 'Good',
        crowdDensity: 'Moderate'
      }
    },
    {
      id: 'travel_pattern',
      score: 92,
      trend: 'improving',
      lastUpdated: new Date(),
      details: {
        routesSafety: 'High',
        frequentedAreas: 'Safe',
        travelTimes: 'Optimal',
        alternativeRoutes: 3
      }
    },
    {
      id: 'time_factor',
      score: 78,
      trend: 'declining',
      lastUpdated: new Date(),
      details: {
        currentTime: '7:30 PM',
        safetyWindow: '6:00 AM - 9:00 PM',
        riskLevel: 'Moderate',
        peakSafetyHours: '10:00 AM - 6:00 PM'
      }
    },
    {
      id: 'recent_incidents',
      score: 70,
      trend: 'stable',
      lastUpdated: new Date(),
      details: {
        incidentsLast7Days: 3,
        incidentsLast30Days: 12,
        mostCommon: 'Petty theft',
        nearestIncident: '0.8 km away'
      }
    }
  ],
  recommendations: [
    {
      id: 'rec_001',
      type: 'warning',
      priority: 'high',
      title: 'Avoid traveling alone after 9 PM',
      description: 'This area shows increased risk after 9 PM. Consider traveling with others or using well-lit main roads.',
      actionable: true,
      action: 'View Safe Routes'
    },
    {
      id: 'rec_002',
      type: 'route',
      priority: 'medium',
      title: 'Consider alternative route',
      description: 'Alternative route through GS Road area shows 15% better safety rating.',
      actionable: true,
      action: 'Show Route'
    },
    {
      id: 'rec_003',
      type: 'tip',
      priority: 'low',
      title: 'Enable location sharing',
      description: 'Share your location with trusted contacts to improve your safety score.',
      actionable: true,
      action: 'Enable Now'
    },
    {
      id: 'rec_004',
      type: 'improvement',
      priority: 'medium',
      title: 'Add emergency contacts',
      description: 'Having 3+ emergency contacts can improve your safety preparedness score.',
      actionable: true,
      action: 'Add Contacts'
    }
  ],
  lastUpdated: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
};

export default function SafetyScoreScreen() {
  return (
    <SafeAreaProvider>
      <SafetyScoreContent />
    </SafeAreaProvider>
  );
}

function SafetyScoreContent() {
  const router = useRouter();
  const [safetyData, setSafetyData] = useState(mockSafetyData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const factorAnims = useRef(
    safetyData.factors.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#FFFFFF');
    
    // Entrance animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: safetyData.overallScore,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.stagger(200, 
        factorAnims.map((anim, index) => 
          Animated.timing(anim, {
            toValue: safetyData.factors[index].score,
            duration: 1000,
            useNativeDriver: false,
          })
        )
      )
    ]).start();
  }, []);

  // Backend Integration Functions
  const fetchSafetyScore = async () => {
    try {
      setIsRefreshing(true);
      // Replace with actual API call
      // const response = await fetch('/api/safety-score');
      // const data = await response.json();
      // setSafetyData(data);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Fetching latest safety score...');
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching safety score:', error);
      setIsRefreshing(false);
    }
  };

  const handleRecommendationAction = async (recommendation) => {
    try {
      // Handle different recommendation actions
      switch (recommendation.action) {
        case 'View Safe Routes':
          router.push('/safe-routes');
          break;
        case 'Show Route':
          router.push({
            pathname: '/live-tracking',
            params: { showAlternativeRoute: true }
          });
          break;
        case 'Enable Now':
          router.push('/location-sharing-settings');
          break;
        case 'Add Contacts':
          router.push('/emergency-contacts');
          break;
        default:
          console.log('Recommendation action:', recommendation.action);
      }
      
      // Track recommendation interaction
      // await trackRecommendationInteraction(recommendation.id);
    } catch (error) {
      console.error('Error handling recommendation action:', error);
    }
  };

  const getScoreLevel = (score) => {
    if (score >= SCORE_THRESHOLDS.HIGH.min) return SCORE_THRESHOLDS.HIGH;
    if (score >= SCORE_THRESHOLDS.MEDIUM.min) return SCORE_THRESHOLDS.MEDIUM;
    return SCORE_THRESHOLDS.LOW;
  };

  const formatLastUpdated = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just updated';
    if (diff < 60) return `Updated ${diff}m ago`;
    if (diff < 1440) return `Updated ${Math.floor(diff / 60)}h ago`;
    return `Updated ${timestamp.toLocaleDateString()}`;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#10B981';
      case 'declining': return '#EF4444';
      case 'stable': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'route': return '🗺️';
      case 'tip': return '💡';
      case 'improvement': return '📊';
      default: return '💡';
    }
  };

  const getRecommendationColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const CircularProgress = ({ score, size = 180 }) => {
    const scoreLevel = getScoreLevel(score);
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    
    return (
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        {/* Background Circle */}
        <View style={[styles.progressBackground, {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: '#E5E7EB'
        }]} />
        
        {/* Progress Circle using simple View with border styling */}
        <View style={[styles.progressOverlay, {
          width: size,
          height: size,
          borderRadius: size / 2,
          position: 'absolute',
        }]}>
          <Animated.View 
            style={[styles.progressIndicator, {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
              borderTopColor: scoreLevel.color,
              borderRightColor: score > 25 ? scoreLevel.color : 'transparent',
              borderBottomColor: score > 50 ? scoreLevel.color : 'transparent',
              borderLeftColor: score > 75 ? scoreLevel.color : 'transparent',
              transform: [{
                rotate: scoreAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['-90deg', `${(score / 100) * 360 - 90}deg`],
                  extrapolate: 'clamp'
                })
              }]
            }]}
          />
        </View>
        
        <View style={styles.scoreContent}>
          <Animated.Text style={[styles.scoreNumber, { color: scoreLevel.color }]}>
            {Math.round(scoreAnim._value)}
          </Animated.Text>
          <Text style={styles.scoreLabel}>Safety Score</Text>
          <View style={[styles.scoreBadge, { backgroundColor: scoreLevel.bgColor }]}>
            <Text style={[styles.scoreBadgeText, { color: scoreLevel.color }]}>
              {scoreLevel.label}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFactorCard = (factor, index) => {
    const factorType = FACTOR_TYPES[factor.id.toUpperCase()];
    const scoreLevel = getScoreLevel(factor.score);
    
    return (
      <TouchableOpacity 
        key={factor.id}
        style={styles.factorCard}
        onPress={() => setSelectedFactor(factor)}
      >
        <View style={styles.factorHeader}>
          <View style={styles.factorTitle}>
            <Text style={styles.factorIcon}>{factorType.icon}</Text>
            <View style={styles.factorTitleText}>
              <Text style={styles.factorName}>{factorType.name}</Text>
              <Text style={styles.factorDescription}>{factorType.description}</Text>
            </View>
          </View>
          <View style={styles.factorTrend}>
            <Text style={[styles.trendIcon, { color: getTrendColor(factor.trend) }]}>
              {getTrendIcon(factor.trend)}
            </Text>
          </View>
        </View>

        <View style={styles.factorScore}>
          <View style={styles.factorProgressContainer}>
            <View style={styles.factorProgressBar}>
              <Animated.View 
                style={[
                  styles.factorProgressFill,
                  {
                    backgroundColor: scoreLevel.color,
                    width: factorAnims[index].interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', `${factor.score}%`],
                      extrapolate: 'clamp'
                    })
                  }
                ]} 
              />
            </View>
            <Animated.Text style={[styles.factorScoreText, { color: scoreLevel.color }]}>
              {factorAnims[index].interpolate({
                inputRange: [0, 100],
                outputRange: ['0', factor.score.toString()],
                extrapolate: 'clamp'
              })}/100
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendationCard = (recommendation) => {
    const iconColor = getRecommendationColor(recommendation.priority);
    
    return (
      <View key={recommendation.id} style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <Text style={[styles.recommendationIcon, { color: iconColor }]}>
            {getRecommendationIcon(recommendation.type)}
          </Text>
          <View style={styles.recommendationTitleContainer}>
            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            <Text style={styles.recommendationDescription}>
              {recommendation.description}
            </Text>
          </View>
        </View>
        
        {recommendation.actionable && (
          <TouchableOpacity 
            style={[styles.recommendationAction, { borderColor: iconColor }]}
            onPress={() => handleRecommendationAction(recommendation)}
          >
            <Text style={[styles.recommendationActionText, { color: iconColor }]}>
              {recommendation.action}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety Score</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchSafetyScore}
              tintColor="#6B7280"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Score Display */}
          <View style={styles.scoreSection}>
            <Text style={styles.sectionTitle}>Your Current Safety Score</Text>
            <Text style={styles.sectionSubtitle}>
              Based on location, time, and recent activity
            </Text>
            
            <View style={styles.scoreContainer}>
              <CircularProgress score={safetyData.overallScore} />
              <Text style={styles.locationText}>{safetyData.location.name}</Text>
              <Text style={styles.lastUpdatedText}>
                {formatLastUpdated(safetyData.lastUpdated)}
              </Text>
            </View>
          </View>

          {/* Score Factors */}
          <View style={styles.factorsSection}>
            <Text style={styles.sectionTitle}>Score Factors</Text>
            <Text style={styles.sectionSubtitle}>
              Detailed breakdown of your safety score components
            </Text>
            
            <View style={styles.factorsList}>
              {safetyData.factors.map((factor, index) => 
                renderFactorCard(factor, index)
              )}
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Safety Recommendations</Text>
            <Text style={styles.sectionSubtitle}>
              Personalized tips to improve your safety
            </Text>
            
            <View style={styles.recommendationsList}>
              {safetyData.recommendations.map(recommendation => 
                renderRecommendationCard(recommendation)
              )}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },

  scrollContainer: {
    flex: 1,
  },

  // Sections
  scoreSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  factorsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recommendationsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  // Circular Progress
  scoreContainer: {
    alignItems: 'center',
  },
  circularProgress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
  },
  progressOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressIndicator: {
    position: 'absolute',
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Factors
  factorsList: {
    gap: 16,
  },
  factorCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  factorTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  factorIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  factorTitleText: {
    flex: 1,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  factorDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  factorTrend: {
    marginLeft: 12,
  },
  trendIcon: {
    fontSize: 16,
  },
  factorScore: {
    marginTop: 8,
  },
  factorProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  factorProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  factorProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  factorScoreText: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 50,
  },

  // Recommendations
  recommendationsList: {
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationTitleContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recommendationAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  recommendationActionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 40,
  },
});