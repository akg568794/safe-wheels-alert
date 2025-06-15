
import { useState, useEffect } from 'react';
import DrowsinessDetector from '@/components/DrowsinessDetector';
import DashboardStats from '@/components/DashboardStats';
import AlertPanel from '@/components/AlertPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Activity, Settings, Shield } from 'lucide-react';

interface DetectionStats {
  totalAlerts: number;
  sessionDuration: number;
  averageEAR: number;
  yawnCount: number;
  blinkRate: number;
}

const Index = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'none' | 'warning' | 'danger'>('none');
  const [stats, setStats] = useState<DetectionStats>({
    totalAlerts: 0,
    sessionDuration: 0,
    averageEAR: 0.3,
    yawnCount: 0,
    blinkRate: 15
  });
  const [currentEAR, setCurrentEAR] = useState(0.3);
  const [currentMAR, setCurrentMAR] = useState(0.5);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setStats(prev => ({ ...prev, sessionDuration: 0 }));
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setAlertLevel('none');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          sessionDuration: prev.sessionDuration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-full">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Driver Drowsiness Detection System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced real-time monitoring system using computer vision to detect driver fatigue and prevent accidents
          </p>
        </div>

        {/* Main Control Panel */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-3">
              <Shield className="h-6 w-6" />
              <span>Monitoring Control</span>
              <div className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                isMonitoring 
                  ? 'bg-green-400 text-green-900' 
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {isMonitoring ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                onClick={startMonitoring}
                disabled={isMonitoring}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                size="lg"
              >
                Start Monitoring
              </Button>
              <Button
                onClick={stopMonitoring}
                disabled={!isMonitoring}
                variant="destructive"
                className="px-8 py-3 text-lg"
                size="lg"
              >
                Stop Monitoring
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatTime(stats.sessionDuration)}</div>
                <div className="text-sm text-gray-600">Session Duration</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{currentEAR.toFixed(3)}</div>
                <div className="text-sm text-gray-600">Current EAR</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.totalAlerts}</div>
                <div className="text-sm text-gray-600">Total Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Panel */}
        <AlertPanel alertLevel={alertLevel} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md">
            <TabsTrigger value="monitor" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Live Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <DrowsinessDetector
              isMonitoring={isMonitoring}
              onStatsUpdate={setStats}
              onAlertChange={setAlertLevel}
              onEARChange={setCurrentEAR}
              onMARChange={setCurrentMAR}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <DashboardStats stats={stats} currentEAR={currentEAR} currentMAR={currentMAR} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
