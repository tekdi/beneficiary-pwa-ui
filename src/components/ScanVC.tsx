import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, Text, useTheme, Button, HStack, useToast } from '@chakra-ui/react';
import Layout from './common/layout/Layout';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';

interface ScanVCProps {
  onScanResult?: (result: string) => void;
}

const ScanVC: React.FC<ScanVCProps> = ({ onScanResult }) => {
  const theme = useTheme();
  const toast = useToast();
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const qrReaderRef = useRef<any>(null);
  const hasScanned = useRef(false);
  const errorCountRef = useRef(0);
  const lastErrorTimeRef = useRef(0);

  // Cleanup function to stop all camera streams
  const cleanupCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
    } catch (error) {
      console.error('Error during camera cleanup:', error);
    }
  };

  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsCameraStarting(true);
    setCameraError(null);
    hasScanned.current = false;
    errorCountRef.current = 0;
    lastErrorTimeRef.current = 0;
    
    try {
      // Try to get the camera stream with environment-facing camera first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment'
        }
      });
      
      streamRef.current = stream;
      setScanning(true);
      toast({
        title: "Camera Started",
        description: "QR code scanner is ready",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Camera initialization error:', err);
      let errorMessage = 'Failed to start camera. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'Camera is in use by another application.';
        } else {
          errorMessage += err.message;
        }
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCameraStarting(false);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    cleanupCamera();
    setCameraError(null);
    errorCountRef.current = 0;
    lastErrorTimeRef.current = 0;
    toast({
      title: "Camera Stopped",
      description: "Camera has been turned off",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleScan = (result: string | null) => {
    if (!result || hasScanned.current) return;
    
    hasScanned.current = true;
    console.log('Raw scan result:', result);
    const cleanResult = result.trim();
    console.log('Cleaned result:', cleanResult);
    
    if (onScanResult) {
      onScanResult(cleanResult);
      stopCamera();
    }
  };

  const handleError = (error: Error) => {
    const now = Date.now();
    const timeSinceLastError = now - lastErrorTimeRef.current;
    
    // Only log errors that aren't related to the QR code scanning process
    // and haven't been logged too frequently
    if (!error.message?.includes('e2') && timeSinceLastError > 5000) {
      console.error('QR Scanner error:', error);
      if (error.message?.includes('Permission') || error.message?.includes('hardware')) {
        setCameraError(error.message);
        toast({
          title: "Camera Error",
          description: "Please check camera permissions or hardware",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      lastErrorTimeRef.current = now;
      errorCountRef.current++;
      
      // If too many errors occur, stop the camera
      if (errorCountRef.current > 10) {
        console.log('Too many errors, stopping camera');
        stopCamera();
        toast({
          title: "Camera Error",
          description: "Too many errors occurred. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select event triggered');
    hasScanned.current = false;
    
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    try {
      if (!file.type.startsWith('image/')) {
        console.log('Invalid file type:', file.type);
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        console.log('File loaded successfully');
        const img = new Image();
        
        img.onload = () => {
          console.log('Image loaded, dimensions:', img.width, 'x', img.height);
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            console.error('Failed to get canvas context');
            toast({
              title: "Error",
              description: "Failed to process image",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            console.log('Image data extracted, scanning for QR code...');
            
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              console.log('QR code found:', code.data);
              hasScanned.current = true;
              // Pass the QR code result to DocumentScanner
              if (onScanResult) {
                onScanResult(code.data.trim());
                toast({
                  title: "Success",
                  description: "QR code scanned successfully",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }
            } else {
              console.log('No QR code found in image');
              toast({
                title: "No QR Code Found",
                description: "The image does not contain a valid QR code",
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
            }
          } catch (error) {
            console.error('Error processing image data:', error);
            toast({
              title: "Error",
              description: "Failed to process image data",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        };

        img.onerror = (error) => {
          console.error('Error loading image:', error);
          toast({
            title: "Error loading image",
            description: "Failed to load the selected image",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        };

        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          console.error('No result from FileReader');
          toast({
            title: "Error",
            description: "Failed to read the image file",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
          title: "Error reading file",
          description: "Failed to read the selected file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      };

      console.log('Starting to read file...');
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File scan error:', error);
      toast({
        title: "Error scanning file",
        description: "Failed to scan the image. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout
      _heading={{
        heading: 'Scan Documents',
        handleBack: () => window.history.back(),
      }}
    >
      <Box shadow="md" borderWidth="1px" borderRadius="md" p={4}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="medium" color={theme.colors.text}>
            QR Code Scanner
          </Text>
          
          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              onClick={scanning ? stopCamera : startCamera}
              isLoading={isCameraStarting}
              loadingText="Starting Camera..."
            >
              {scanning ? 'Stop Scanning' : 'Start Camera Scan'}
            </Button>
            
            <Button
              as="label"
              htmlFor="file-input"
              colorScheme="blue"
              variant="outline"
            >
              Scan from File
            </Button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </HStack>

          {scanning && !hasScanned.current && (
            <Box width="100%" height="300px" position="relative" ref={qrReaderRef}>
              <QrReader
                constraints={{ 
                  facingMode: 'environment'
                }}
                onResult={(result, error) => {
                  if (result?.getText() && !hasScanned.current) {
                    handleScan(result.getText());
                  }
                  if (error) {
                    handleError(error);
                  }
                }}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                scanDelay={500}
              />
              {cameraError && (
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  bg="rgba(255, 0, 0, 0.7)"
                  color="white"
                  p={4}
                  borderRadius="md"
                  maxWidth="80%"
                  textAlign="center"
                >
                  <Text>{cameraError}</Text>
                  <Button
                    mt={2}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => {
                      setCameraError(null);
                      startCamera();
                    }}
                  >
                    Try Again
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </VStack>
      </Box>
    </Layout>
  );
};

export default ScanVC;