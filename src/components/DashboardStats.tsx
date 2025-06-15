
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Eye, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStatsProps {
  stats: {
    totalAlerts: number;
    sessionDuration: number;
    averageEAR: number;
    yawnCount: number;
    blinkRate: number;
  };
  currentEAR: number;
  currentMAR: number;
}

const DashboardStats = ({ stats, currentEAR, currentMAR }: DashboardStatsProps) => {
  // Generate sample historical data
  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60000); // Last 30 minutes
      data.push({
        time: date.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
        ear: 0.25 + Math.random() * 0.1,
        mar: 0.4 + Math.random() * 0.3,
        alerts: Math.floor(Math.random() * 3)
      });
    }
    return data;
  };

  const historicalData = generateHistoricalData();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAlertFrequency = () => {
    if (stats.sessionDuration === 0) return 0;
    return (stats.totalAlerts / (stats.sessionDuration / 60)).toFixed(2); // alerts per minute
  };

  const getDrowsinessLevel = () => {
    if (currentEAR < 0.25) return { level: 'High', color: 'destructive' };
    if (currentEAR < 0.28) return { level: 'Medium', color: 'secondary' };
    return { level: 'Low', color: 'default' };
  };

  const drowsinessLevel = getDrowsinessLevel();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{formatTime(stats.sessionDuration)}</p>
                <p className="text-sm text-muted-foreground">Session Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAlerts}</p>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.blinkRate}</p>
                <p className="text-sm text-muted-foreground">Blinks/Min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{getAlertFrequency()}</p>
                <p className="text-sm text-muted-foreground">Alerts/Min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Current Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Eye Aspect Ratio (EAR)</span>
                <span className="font-mono text-lg">{currentEAR.toFixed(3)}</span>
              </div>
              <Progress value={currentEAR * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Drowsy (≤0.28)</span>
                <span>Alert (>0.28)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Mouth Aspect Ratio (MAR)</span>
                <span className="font-mono text-lg">{currentMAR.toFixed(3)}</span>
              </div>
              <Progress value={Math.min(currentMAR * 100, 100)} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Normal (≤0.60)</span>
                <span>Yawning (>0.60)</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Drowsiness Level</span>
                <Badge variant={drowsinessLevel.color as any}>
                  {drowsinessLevel.level}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Session Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.averageEAR.toFixed(3)}</div>
                <div className="text-sm text-gray-600">Avg EAR</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.yawnCount}</div>
                <div className="text-sm text-gray-600">Yawns</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Alert Frequency</span>
                <span className="text-sm font-medium">{getAlertFrequency()} per min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Blink Rate</span>
                <span className="text-sm font-medium">{stats.blinkRate} per min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Session Health</span>
                <Badge variant={stats.totalAlerts < 5 ? 'default' : stats.totalAlerts < 10 ? 'secondary' : 'destructive'}>
                  {stats.totalAlerts < 5 ? 'Good' : stats.totalAlerts < 10 ? 'Fair' : 'Poor'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-time EAR/MAR Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="ear" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="EAR"
                />
                <Line 
                  type="monotone" 
                  dataKey="mar" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="MAR"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
