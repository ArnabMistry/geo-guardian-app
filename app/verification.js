import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DataStorage } from '../tourist-api/services/DataStorage';

const { width, height } = Dimensions.get('window');

export default function DocumentVerification() {
  return (
    <SafeAreaProvider>
      <DocumentVerificationContent />
    </SafeAreaProvider>
  );
}

function DocumentVerificationContent() {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [documentType, setDocumentType] = useState('Document');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const overlayAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start animations
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

    // Scanning overlay animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

const handleCapture = async () => {
  if (cameraRef.current && !isProcessing) {
    try {
      setIsProcessing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false
      });

      console.log('Document captured:', photo.uri);

      // Save verification data
      await DataStorage.storeFormData('verification', { documentUri: photo.uri });

      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert(
          'Document Captured!',
          'Your document has been successfully captured.',
          [
            {
              text: 'Continue',
              onPress: () => router.push("/tripdetail") // Go to Trip Details
            }
          ]
        );
      }, 1500);

    } catch (error) {
      console.error('Capture error:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to capture document. Please try again.');
    }
  }
};

  const selectFromGallery = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Document selected:', result.assets[0].uri);
        setTimeout(() => {
          setIsProcessing(false);
          Alert.alert(
            'Document Selected!',
            'Your document has been uploaded and is being processed.',
            [
              {
                text: 'Continue',
                onPress: () => router.push("/tripdetail")
              }
            ]
          );
        }, 1000);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  // Permission loading state
  if (!permission) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Progress Indicator */}
        <Animated.View 
          style={[
            styles.progressContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Step 3 of 4</Text>
        </Animated.View>

        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Please grant camera permission to scan your {documentType.toLowerCase()} document, 
            or you can upload from your gallery instead.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={selectFromGallery}>
            <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main camera view
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Progress Indicator */}
      <Animated.View 
        style={[
          styles.progressContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>Step 3 of 4</Text>
      </Animated.View>

      {/* Header Section */}
      <Animated.View 
        style={[
          styles.headerContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Text style={styles.headerTitle}>Document Verification</Text>
        <Text style={styles.headerSubtitle}>Scan your {documentType}</Text>
        <View style={styles.headerUnderline} />
      </Animated.View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        >
          {/* Scanning Overlay */}
          <View style={styles.overlay}>
            <Animated.View 
              style={[
                styles.scanningFrame,
                { opacity: overlayAnim }
              ]}
            >
              <View style={styles.corner} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </Animated.View>
            
            {/* Instructions */}
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Position your {documentType.toLowerCase()} within the frame
              </Text>
              <Text style={styles.instructionSubtext}>
                Ensure good lighting and all corners are visible
              </Text>
            </View>

            {isProcessing && (
              <View style={styles.processingIndicator}>
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.actionContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <TouchableOpacity
          style={[styles.captureButton, isProcessing && styles.disabledButton]}
          onPress={handleCapture}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.captureButtonText}>
            {isProcessing ? 'Processing...' : 'Capture Document'}
          </Text>
          <Text style={styles.buttonIcon}>📷</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadActionButton, isProcessing && styles.disabledButton]}
          onPress={selectFromGallery}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadActionButtonText}>
            {isProcessing ? 'Processing...' : 'Upload from Gallery'}
          </Text>
          <Text style={styles.buttonIcon}>📁</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Security Assurance */}
      <Animated.View 
        style={[
          styles.securityContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>Your data is encrypted and secure</Text>
        </View>
        <Text style={styles.securitySubtext}>
          Documents are processed securely and never stored permanently
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    width: '75%', // Step 3 of 4
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  progressText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 15,
  },
  headerUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#059669',
    borderRadius: 1.5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scanningFrame: {
    width: width * 0.7,
    height: width * 0.5,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#059669',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  instructionSubtext: {
    color: '#E5E7EB',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  processingIndicator: {
    position: 'absolute',
    top: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  processingText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 10,
  },
  uploadActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadActionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 18,
  },
  securityContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  securitySubtext: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});