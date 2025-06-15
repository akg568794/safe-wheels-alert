
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Volume2, 
  Eye, 
  Timer, 
  Camera, 
  Save,
  RotateCcw 
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPanel = () => {
  const [earThreshold, setEarThreshold] = useState([0.28]);
  const [marThreshold, setMarThreshold] = useState([0.6]);
  const [alertDelay, setAlertDelay] = useState([2]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [visualAlertsEnabled, setVisualAlertsEnabled] = useState(true);
  const [cameraResolution, setCameraResolution] = useState('640x480');
  const [detectionSensitivity, setDetectionSensitivity] = useState([75]);
  const [alertVolume, setAlertVolume] = useState([70]);
  const [autoCalibration, setAutoCalibration] = useState(true);

  const saveSettings = () => {
    const settings = {
      earThreshold: earThreshold[0],
      marThreshold: marThreshold[0],
      alertDelay: alertDelay[0],
      audioEnabled,
      visualAlertsEnabled,
      cameraResolution,
      detectionSensitivity: detectionSensitivity[0],
      alertVolume: alertVolume[0],
      autoCalibration
    };
    
    localStorage.setItem('drowsinessDetectionSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const resetToDefaults = () => {
    setEarThreshold([0.28]);
    setMarThreshold([0.6]);
    setAlertDelay([2]);
    setAudioEnabled(true);
    setVisualAlertsEnabled(true);
    setCameraResolution('640x480');
    setDetectionSensitivity([75]);
    setAlertVolume([70]);
    setAutoCalibration(true);
    toast.info('Settings reset to defaults');
  };

  const startCalibration = () => {
    toast.info('Calibration started. Please keep your eyes open and look straight ahead for 10 seconds.');
    // Simulate calibration process
    setTimeout(() => {
      toast.success('Calibration completed successfully!');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Detection Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Detection Thresholds</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Eye Aspect Ratio (EAR) Threshold</Label>
            <div className="mt-2 space-y-2">
              <Slider
                value={earThreshold}
                onValueChange={setEarThreshold}
                max={0.5}
                min={0.1}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Sensitive (0.1)</span>
                <Badge variant="outline">{earThreshold[0].toFixed(3)}</Badge>
                <span>Less Sensitive (0.5)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lower values trigger drowsiness alerts more easily
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Mouth Aspect Ratio (MAR) Threshold</Label>
            <div className="mt-2 space-y-2">
              <Slider
                value={marThreshold}
                onValueChange={setMarThreshold}
                max={1.0}
                min={0.3}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Sensitive (0.3)</span>
                <Badge variant="outline">{marThreshold[0].toFixed(2)}</Badge>
                <span>Less Sensitive (1.0)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Higher values require wider mouth opening to detect yawns
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Detection Sensitivity</Label>
            <div className="mt-2 space-y-2">
              <Slider
                value={detectionSensitivity}
                onValueChange={setDetectionSensitivity}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low (10%)</span>
                <Badge variant="outline">{detectionSensitivity[0]}%</Badge>
                <span>High (100%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5" />
            <span>Alert Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Audio Alerts</Label>
              <p className="text-xs text-muted-foreground">Play sound when drowsiness is detected</p>
            </div>
            <Switch
              checked={audioEnabled}
              onCheckedChange={setAudioEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Visual Alerts</Label>
              <p className="text-xs text-muted-foreground">Show visual warnings on screen</p>
            </div>
            <Switch
              checked={visualAlertsEnabled}
              onCheckedChange={setVisualAlertsEnabled}
            />
          </div>

          {audioEnabled && (
            <div>
              <Label className="text-sm font-medium">Alert Volume</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={alertVolume}
                  onValueChange={setAlertVolume}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Silent</span>
                  <Badge variant="outline">{alertVolume[0]}%</Badge>
                  <span>Maximum</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Alert Delay (seconds)</Label>
            <div className="mt-2 space-y-2">
              <Slider
                value={alertDelay}
                onValueChange={setAlertDelay}
                max={10}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Immediate (0.5s)</span>
                <Badge variant="outline">{alertDelay[0]}s</Badge>
                <span>Delayed (10s)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              How long to wait before triggering an alert
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Camera Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Camera Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Camera Resolution</Label>
            <Select value={cameraResolution} onValueChange={setCameraResolution}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="320x240">320x240 (Low)</SelectItem>
                <SelectItem value="640x480">640x480 (Medium)</SelectItem>
                <SelectItem value="1280x720">1280x720 (High)</SelectItem>
                <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Higher resolutions provide better accuracy but use more processing power
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto Calibration</Label>
              <p className="text-xs text-muted-foreground">Automatically adjust thresholds based on user</p>
            </div>
            <Switch
              checked={autoCalibration}
              onCheckedChange={setAutoCalibration}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Manual Calibration</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Calibrate the system to your specific facial features
            </p>
            <Button onClick={startCalibration} variant="outline" className="w-full">
              <Timer className="h-4 w-4 mr-2" />
              Start Calibration Process
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button onClick={saveSettings} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button onClick={resetToDefaults} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Current Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">EAR Threshold:</span>
              <span className="ml-2">{earThreshold[0].toFixed(3)}</span>
            </div>
            <div>
              <span className="font-medium">MAR Threshold:</span>
              <span className="ml-2">{marThreshold[0].toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium">Alert Delay:</span>
              <span className="ml-2">{alertDelay[0]}s</span>
            </div>
            <div>
              <span className="font-medium">Resolution:</span>
              <span className="ml-2">{cameraResolution}</span>
            </div>
            <div>
              <span className="font-medium">Audio:</span>
              <span className="ml-2">{audioEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div>
              <span className="font-medium">Visual Alerts:</span>
              <span className="ml-2">{visualAlertsEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
