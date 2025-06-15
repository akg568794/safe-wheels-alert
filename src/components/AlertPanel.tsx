
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Volume2, VolumeX, X } from 'lucide-react';

interface AlertPanelProps {
  alertLevel: 'none' | 'warning' | 'danger';
}

const AlertPanel = ({ alertLevel }: AlertPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setIsVisible(alertLevel !== 'none');
    
    if (alertLevel !== 'none' && audioEnabled) {
      playAlertSound(alertLevel);
    }
  }, [alertLevel, audioEnabled]);

  // Early return if alert level is 'none' or not visible
  if (!isVisible || alertLevel === 'none') return null;

  const playAlertSound = (level: 'warning' | 'danger') => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      generateAlertTone(ctx, level);
    } else {
      generateAlertTone(audioContext, level);
    }
  };

  const generateAlertTone = (ctx: AudioContext, level: 'warning' | 'danger') => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Different frequencies for different alert levels
    const frequency = level === 'danger' ? 800 : 600;
    const duration = level === 'danger' ? 0.5 : 0.3;
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const dismissAlert = () => {
    setIsVisible(false);
  };

  const alertConfig = {
    warning: {
      bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      textColor: 'text-white',
      title: 'Drowsiness Warning',
      message: 'Signs of fatigue detected. Please take a break if needed.',
      icon: AlertTriangle,
      borderColor: 'border-yellow-400'
    },
    danger: {
      bgColor: 'bg-gradient-to-r from-red-500 to-red-700',
      textColor: 'text-white',
      title: 'DANGER: Severe Drowsiness',
      message: 'Immediate attention required! Pull over safely and rest.',
      icon: AlertTriangle,
      borderColor: 'border-red-500'
    }
  };

  const config = alertConfig[alertLevel as keyof typeof alertConfig];
  const IconComponent = config.icon;

  return (
    <Card className={`border-4 ${config.borderColor} shadow-2xl animate-pulse`}>
      <CardContent className={`${config.bgColor} ${config.textColor} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{config.title}</h3>
              <p className="text-lg opacity-90">{config.message}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              onClick={dismissAlert}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {alertLevel === 'danger' && (
          <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
            <h4 className="font-semibold mb-2">Safety Recommendations:</h4>
            <ul className="text-sm space-y-1">
              <li>• Find a safe place to pull over immediately</li>
              <li>• Take a 15-20 minute nap</li>
              <li>• Have some caffeine if available</li>
              <li>• Consider switching drivers if possible</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertPanel;
