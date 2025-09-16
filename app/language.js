import React, { useState, useEffect } from "react";
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

// Language data with native scripts
const languages = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    code: 'EN'
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'HI'
  },
  {
    id: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    code: 'AS'
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'BN'
  },
  {
    id: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    code: 'MNI'
  },
  {
    id: 'nag',
    name: 'Nagamese',
    nativeName: 'Nagamese',
    code: 'NAG'
  },
  {
    id: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    code: 'NE'
  },
  {
    id: 'bo',
    name: 'Bodo',
    nativeName: 'बर\'',
    code: 'BO'
  },
  {
    id: 'grt',
    name: 'Garo',
    nativeName: 'A·chik',
    code: 'GRT'
  },
  {
    id: 'khasi',
    name: 'Khasi',
    nativeName: 'Ka Ktien Khasi',
    code: 'KHA'
  },
  {
    id: 'lus',
    name: 'Mizo',
    nativeName: 'Mizo ţawng',
    code: 'MIZ'
  },
  {
    id: 'sip',
    name: 'Sikkimese',
    nativeName: 'འབྲས་ལྗོངས་སྐད་',
    code: 'SIP'
  }
];

export default function LanguageSelection() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
  };

  const handleContinue = () => {
    // You can store the selected language in AsyncStorage or context here
    console.log('Selected language:', selectedLanguage);
    router.push("/carousel"); // Navigate to carousel screen
  };

  const renderLanguageCard = (language, index) => {
    const isSelected = selectedLanguage === language.id;
    const animDelay = index * 100;

    return (
      <Animated.View
        key={language.id}
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.languageCard,
            isSelected && styles.selectedCard
          ]}
          onPress={() => handleLanguageSelect(language.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <Text style={[
              styles.nativeScript,
              isSelected && styles.selectedNativeScript
            ]}>
              {language.nativeName}
            </Text>
            <Text style={[
              styles.englishName,
              isSelected && styles.selectedEnglishName
            ]}>
              {language.name}
            </Text>
            <Text style={[
              styles.languageCode,
              isSelected && styles.selectedLanguageCode
            ]}>
              {language.code}
            </Text>
          </View>
          
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>Smart Tourist Safety</Text>
          <View style={styles.headerUnderline} />
          <Text style={styles.subtitle}>Choose your preferred language</Text>
        </Animated.View>

        {/* Language Grid */}
        <View style={styles.languageGrid}>
          {languages.map((language, index) => renderLanguageCard(language, index))}
        </View>

        {/* Continue Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedLanguage && styles.continueButtonActive
            ]}
            onPress={handleContinue}
            disabled={!selectedLanguage}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              selectedLanguage && styles.continueButtonTextActive
            ]}>
              Continue
            </Text>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 15,
  },
  headerUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#F97316',
    borderRadius: 1,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  languageCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    minHeight: 100,
    justifyContent: 'center',
  },
  selectedCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: '#F97316',
    transform: [{ scale: 1.02 }],
  },
  cardContent: {
    alignItems: 'center',
  },
  nativeScript: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  selectedNativeScript: {
    color: '#FCD34D',
  },
  englishName: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedEnglishName: {
    color: '#FFFFFF',
  },
  languageCode: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '300',
    textAlign: 'center',
  },
  selectedLanguageCode: {
    color: '#F97316',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  continueButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  continueArrow: {
    fontSize: 18,
    color: '#94A3B8',
  },
});