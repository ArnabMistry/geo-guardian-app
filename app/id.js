import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
  Image,
  Share,
  Clipboard
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

// Mock user data
const mockUserData = {
  name: "Rahul Sharma",
  photo: null,
  touristId: "TID2025001234",
  issuedDate: "15 Jan 2025",
  validUntil: "15 Jan 2026",
  nationality: "Indian",
  destinations: ["Assam", "Meghalaya", "Sikkim", "Arunachal Pradesh"],
  issuePlace: "New Delhi",
  blockchainHash: "0x7f9f4e3a8b2c1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
  verificationStatus: "Verified",
  qrData: "https://tourist-safety.gov.in/verify/TID2025001234"
};

export default function DigitalID() {
  return (
    <SafeAreaProvider>
      <DigitalIDContent />
    </SafeAreaProvider>
  );
}

function DigitalIDContent() {
  const router = useRouter();
  const [showQRCode, setShowQRCode] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#0A0A0A');
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCopyID = async () => {
    try {
      await Clipboard.setString(mockUserData.touristId);
      Alert.alert('Copied', 'Tourist ID copied to clipboard');
    } catch (error) {
      console.log('Copy failed:', error);
    }
  };

  const handleShareID = async () => {
    try {
      const shareContent = {
        message: `My Digital Tourist ID: ${mockUserData.touristId}\nVerify at: ${mockUserData.qrData}`,
        url: mockUserData.qrData,
      };
      await Share.share(shareContent);
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const handleDownloadPDF = () => {
    Alert.alert('Download PDF', 'PDF download functionality will be implemented');
  };

  const handleVerifyBlockchain = () => {
    Alert.alert(
      'Blockchain Verification',
      `Status: ${mockUserData.verificationStatus}\nHash: ${mockUserData.blockchainHash.substring(0, 20)}...`,
      [
        { text: 'Copy Hash', onPress: () => Clipboard.setString(mockUserData.blockchainHash) },
        { text: 'OK' }
      ]
    );
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Identity</Text>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => console.log('Menu pressed')}
        >
          <View style={styles.menuIcon} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View 
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.profilePhotoContainer}>
            {mockUserData.photo ? (
              <Image source={{ uri: mockUserData.photo }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Text style={styles.profileInitials}>{getInitials(mockUserData.name)}</Text>
              </View>
            )}
            <View style={styles.verificationBadge}>
              <View style={styles.verifiedIcon} />
            </View>
          </View>

          <Text style={styles.userName}>{mockUserData.name}</Text>
          
          <View style={styles.idContainer}>
            <Text style={styles.idLabel}>Tourist ID</Text>
            <View style={styles.idRow}>
              <Text style={styles.idNumber}>{mockUserData.touristId}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyID}>
                <View style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* QR Code Section */}
        <Animated.View 
          style={[
            styles.qrSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.qrContainer}
            onPress={() => setShowQRCode(!showQRCode)}
          >
            {showQRCode ? (
              <View style={styles.qrCode}>
                <View style={styles.qrPattern}>
                  {/* Mock QR Code Pattern */}
                  {[...Array(10)].map((_, i) => (
                    <View key={i} style={styles.qrRow}>
                      {[...Array(10)].map((_, j) => (
                        <View 
                          key={j} 
                          style={[
                            styles.qrDot,
                            (i + j) % 3 === 0 && styles.qrDotFilled
                          ]} 
                        />
                      ))}
                    </View>
                  ))}
                </View>
                <Text style={styles.qrLabel}>Scan to verify identity</Text>
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <View style={styles.qrPlaceholderIcon} />
                <Text style={styles.qrPlaceholderText}>Tap to show QR code</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Digital ID Card */}
        <Animated.View 
          style={[
            styles.idCardSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.idCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.govHeader}>
                <View style={styles.govEmblem} />
                <View style={styles.govTextContainer}>
                  <Text style={styles.govText}>Government of India</Text>
                  <Text style={styles.cardType}>Digital Tourist Identity</Text>
                </View>
              </View>
              <View style={styles.cardFlag} />
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={styles.cardPhoto}>
                  {mockUserData.photo ? (
                    <Image source={{ uri: mockUserData.photo }} style={styles.cardPhotoImage} />
                  ) : (
                    <View style={styles.cardPhotoPlaceholder}>
                      <Text style={styles.cardPhotoInitials}>{getInitials(mockUserData.name)}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.cardRight}>
                <View style={styles.cardField}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  <Text style={styles.fieldValue}>{mockUserData.name}</Text>
                </View>

                <View style={styles.cardField}>
                  <Text style={styles.fieldLabel}>ID Number</Text>
                  <Text style={styles.fieldValue}>{mockUserData.touristId}</Text>
                </View>

                <View style={styles.cardField}>
                  <Text style={styles.fieldLabel}>Nationality</Text>
                  <Text style={styles.fieldValue}>{mockUserData.nationality}</Text>
                </View>

                <View style={styles.cardFieldRow}>
                  <View style={styles.cardFieldHalf}>
                    <Text style={styles.fieldLabel}>Valid From</Text>
                    <Text style={styles.fieldValue}>{mockUserData.issuedDate}</Text>
                  </View>
                  <View style={styles.cardFieldHalf}>
                    <Text style={styles.fieldLabel}>Valid Until</Text>
                    <Text style={styles.fieldValue}>{mockUserData.validUntil}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Authorized Destinations */}
            <View style={styles.destinationsSection}>
              <Text style={styles.destinationsTitle}>Authorized Destinations</Text>
              <View style={styles.destinationsList}>
                {mockUserData.destinations.map((destination, index) => (
                  <View key={index} style={styles.destinationTag}>
                    <Text style={styles.destinationText}>{destination}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.footerLeft}>
                <Text style={styles.issuePlace}>Issued at {mockUserData.issuePlace}</Text>
                <Text style={styles.blockchainText}>Secured by Blockchain</Text>
              </View>
              <View style={styles.footerRight}>
                <View style={styles.securityPattern}>
                  <View style={styles.securityDot} />
                  <View style={styles.securityDot} />
                  <View style={styles.securityDot} />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.primaryAction} onPress={handleShareID}>
            <View style={styles.actionIcon}>
              <View style={styles.shareIcon} />
            </View>
            <Text style={styles.actionText}>Share ID</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryAction} onPress={handleDownloadPDF}>
              <View style={styles.actionIcon}>
                <View style={styles.downloadIcon} />
              </View>
              <Text style={styles.secondaryActionText}>Download PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleVerifyBlockchain}>
              <View style={styles.actionIcon}>
                <View style={styles.blockchainIcon} />
              </View>
              <Text style={styles.secondaryActionText}>Verify on Blockchain</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Status Information */}
        <Animated.View 
          style={[
            styles.statusSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Identity verified and active</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.statusText}>Blockchain secured</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.statusText}>Valid for {mockUserData.destinations.length} destinations</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    backgroundColor: '#22C55E',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0A0A0A',
  },
  verifiedIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  idContainer: {
    alignItems: 'center',
  },
  idLabel: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    marginRight: 12,
  },
  copyButton: {
    padding: 8,
  },
  copyIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#666666',
    borderRadius: 2,
  },

  // QR Section
  qrSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  qrContainer: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  qrCode: {
    alignItems: 'center',
  },
  qrPattern: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrDot: {
    flex: 1,
    margin: 1,
    backgroundColor: 'transparent',
  },
  qrDotFilled: {
    backgroundColor: '#000000',
  },
  qrLabel: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  qrPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  qrPlaceholderIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#333333',
    borderRadius: 24,
    marginBottom: 16,
  },
  qrPlaceholderText: {
    color: '#666666',
    fontSize: 14,
  },

  // ID Card
  idCardSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  govHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  govEmblem: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
  },
  govTextContainer: {
    flex: 1,
  },
  govText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardType: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '500',
  },
  cardFlag: {
    width: 32,
    height: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
  },
  cardLeft: {
    marginRight: 20,
  },
  cardPhoto: {
    width: 80,
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardPhotoImage: {
    width: '100%',
    height: '100%',
  },
  cardPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  cardPhotoInitials: {
    color: '#6B7280',
    fontSize: 24,
    fontWeight: '700',
  },
  cardRight: {
    flex: 1,
  },
  cardField: {
    marginBottom: 12,
  },
  cardFieldRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cardFieldHalf: {
    flex: 1,
  },
  fieldLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  destinationsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  destinationsTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  destinationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  destinationTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  destinationText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerLeft: {
    flex: 1,
  },
  issuePlace: {
    color: '#6B7280',
    fontSize: 11,
    marginBottom: 2,
  },
  blockchainText: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: '600',
  },
  footerRight: {
    // Footer right styles
  },
  securityPattern: {
    flexDirection: 'row',
    gap: 4,
  },
  securityDot: {
    width: 6,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },

  // Actions Section
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  primaryAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  actionIcon: {
    marginRight: 12,
  },
  shareIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#0A0A0A',
    borderRadius: 10,
  },
  actionText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  downloadIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#666666',
    borderRadius: 10,
    marginBottom: 8,
  },
  blockchainIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    marginBottom: 8,
  },
  secondaryActionText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Status Section
  statusSection: {
    paddingHorizontal: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#22C55E',
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    color: '#666666',
    fontSize: 14,
  },
});