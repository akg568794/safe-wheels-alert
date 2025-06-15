
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, AlertTriangle, CheckCircle } from 'lucide-react';

interface DrowsinessDetectorProps {
  isMonitoring: boolean;
  onStatsUpdate: (stats: any) => void;
  onAlertChange: (level: 'none' | 'warning' | 'danger') => void;
  onEARChange: (ear: number) => void;
  onMARChange: (mar: number) => void;
}

const DrowsinessDetector = ({ 
  isMonitoring, 
  onStatsUpdate, 
  onAlertChange, 
  onEARChange, 
  onMARChange 
}: DrowsinessDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStatus, setCameraStatus] = useState<'inactive' | 'active' | 'error'>('inactive');
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEAR, setCurrentEAR] = useState(0.3);
  const [currentMAR, setCurrentMAR] = useState(0.5);
  const [alertCount, setAlertCount] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [yawnDetected, setYawnDetected] = useState(false);

  // Eye landmarks indices for MediaPipe Face Mesh
  const LEFT_EYE_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
  const RIGHT_EYE_INDICES = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
  const MOUTH_INDICES = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStatus('active');
        
        // Start face detection when video is ready
        videoRef.current.onloadedmetadata = () => {
          if (isMonitoring) {
            startFaceDetection();
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraStatus('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraStatus('inactive');
    setFaceDetected(false);
  };

  const calculateEAR = (eyeLandmarks: any[]) => {
    // Simplified EAR calculation
    // In a real implementation, you'd use actual landmark coordinates
    const p1 = eyeLandmarks[1];
    const p2 = eyeLandmarks[5];
    const p3 = eyeLandmarks[2];
    const p4 = eyeLandmarks[4];
    const p5 = eyeLandmarks[0];
    const p6 = eyeLandmarks[3];

    // Calculate vertical distances
    const vertical1 = Math.sqrt(Math.pow(p2.x - p6.x, 2) + Math.pow(p2.y - p6.y, 2));
    const vertical2 = Math.sqrt(Math.pow(p3.x - p5.x, 2) + Math.pow(p3.y - p5.y, 2));
    
    // Calculate horizontal distance
    const horizontal = Math.sqrt(Math.pow(p1.x - p4.x, 2) + Math.pow(p1.y - p4.y, 2));

    // EAR formula
    const ear = (vertical1 + vertical2) / (2.0 * horizontal);
    return ear;
  };

  const calculateMAR = (mouthLandmarks: any[]) => {
    // Simplified MAR calculation
    const top = mouthLandmarks[2];
    const bottom = mouthLandmarks[6];
    const left = mouthLandmarks[0];
    const right = mouthLandmarks[4];

    const vertical = Math.sqrt(Math.pow(top.x - bottom.x, 2) + Math.pow(top.y - bottom.y, 2));
    const horizontal = Math.sqrt(Math.pow(left.x - right.x, 2) + Math.pow(left.y - right.y, 2));

    return vertical / horizontal;
  };

  const startFaceDetection = () => {
    // Simulate face detection and drowsiness detection
    const interval = setInterval(() => {
      if (!isMonitoring) {
        clearInterval(interval);
        return;
      }

      // Simulate detection values
      const simulatedEAR = 0.25 + Math.random() * 0.1; // Random EAR between 0.25-0.35
      const simulatedMAR = 0.4 + Math.random() * 0.3; // Random MAR between 0.4-0.7
      
      setCurrentEAR(simulatedEAR);
      setCurrentMAR(simulatedMAR);
      onEARChange(simulatedEAR);
      onMARChange(simulatedMAR);
      
      setFaceDetected(true);

      // Drowsiness detection logic
      const earThreshold = 0.28;
      const marThreshold = 0.6;
      
      const eyesClosedNow = simulatedEAR < earThreshold;
      const yawnDetectedNow = simulatedMAR > marThreshold;
      
      setEyesClosed(eyesClosedNow);
      setYawnDetected(yawnDetectedNow);

      // Alert logic
      if (eyesClosedNow || yawnDetectedNow) {
        if (eyesClosedNow && yawnDetectedNow) {
          onAlertChange('danger');
        } else {
          onAlertChange('warning');
        }
        
        setAlertCount(prev => {
          const newCount = prev + 1;
          onStatsUpdate((prevStats: any) => ({
            ...prevStats,
            totalAlerts: newCount,
            yawnCount: yawnDetectedNow ? prevStats.yawnCount + 1 : prevStats.yawnCount,
            averageEAR: simulatedEAR,
            blinkRate: Math.floor(Math.random() * 10) + 10
          }));
          return newCount;
        });
      } else {
        onAlertChange('none');
      }

      // Draw detection results on canvas
      drawDetectionResults();
    }, 500); // Update every 500ms
  };

  const drawDetectionResults = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    if (faceDetected) {
      // Draw face bounding box
      ctx.strokeStyle = eyesClosed || yawnDetected ? '#ef4444' : '#22c55e';
      ctx.lineWidth = 3;
      ctx.strokeRect(canvas.width * 0.2, canvas.height * 0.2, canvas.width * 0.6, canvas.height * 0.6);
      
      // Draw eye regions
      ctx.strokeStyle = eyesClosed ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 2;
      // Left eye
      ctx.strokeRect(canvas.width * 0.3, canvas.height * 0.35, canvas.width * 0.1, canvas.height * 0.05);
      // Right eye
      ctx.strokeRect(canvas.width * 0.6, canvas.height * 0.35, canvas.width * 0.1, canvas.height * 0.05);
      
      // Draw mouth region
      ctx.strokeStyle = yawnDetected ? '#ef4444' : '#3b82f6';
      ctx.strokeRect(canvas.width * 0.45, canvas.height * 0.6, canvas.width * 0.1, canvas.height * 0.08);
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isMonitoring]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Camera Feed */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Live Camera Feed</span>
              </div>
              <Badge 
                variant={cameraStatus === 'active' ? 'default' : cameraStatus === 'error' ? 'destructive' : 'secondary'}
                className="capitalize"
              >
                {cameraStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              
              {!isMonitoring && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Camera Inactive</p>
                    <p className="text-sm opacity-75">Start monitoring to begin detection</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection Status */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Detection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Face Detection</span>
              <div className="flex items-center space-x-2">
                {faceDetected ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-gray-300" />
                )}
                <span className={`text-sm ${faceDetected ? 'text-green-600' : 'text-gray-500'}`}>
                  {faceDetected ? 'Detected' : 'Not Detected'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Eyes Status</span>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${eyesClosed ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className={`text-sm ${eyesClosed ? 'text-red-600' : 'text-green-600'}`}>
                  {eyesClosed ? 'Closed/Drowsy' : 'Open/Alert'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Yawn Detection</span>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${yawnDetected ? 'bg-orange-500' : 'bg-green-500'}`} />
                <span className={`text-sm ${yawnDetected ? 'text-orange-600' : 'text-green-600'}`}>
                  {yawnDetected ? 'Yawning' : 'Normal'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Eye Aspect Ratio (EAR)</span>
                <span className="font-mono">{currentEAR.toFixed(3)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentEAR < 0.28 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(currentEAR * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Threshold: 0.28 (below indicates drowsiness)
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mouth Aspect Ratio (MAR)</span>
                <span className="font-mono">{currentMAR.toFixed(3)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentMAR > 0.6 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(currentMAR * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Threshold: 0.60 (above indicates yawning)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DrowsinessDetector;
