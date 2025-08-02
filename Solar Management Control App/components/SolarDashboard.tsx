import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Play, Pause, RotateCcw, Wifi, WifiOff, Sun, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type SystemStatus = 'running' | 'paused' | 'restarting' | 'offline';
type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export function SolarDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('running');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isLoading, setIsLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');

  // Mock Azure IoT Hub command function
  const sendIoTCommand = async (command: string) => {
    setIsLoading(true);
    setLastCommand(command);
    
    try {
      // Mock API call to Azure IoT Hub
      // Replace this with actual Azure IoT Hub SDK calls
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Simulate command execution
      switch (command) {
        case 'restart':
          setSystemStatus('restarting');
          toast.success('Restart command sent successfully');
          setTimeout(() => setSystemStatus('running'), 3000);
          break;
        case 'pause':
          setSystemStatus('paused');
          toast.success('Solar management paused');
          break;
        case 'resume':
          setSystemStatus('running');
          toast.success('Solar management resumed');
          break;
      }
    } catch (error) {
      toast.error('Failed to send command. Please try again.');
      console.error('IoT Hub command failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'restarting': return 'bg-blue-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: SystemStatus) => {
    switch (status) {
      case 'running': return 'Running';
      case 'paused': return 'Paused';
      case 'restarting': return 'Restarting...';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sun className="h-8 w-8 text-yellow-500" />
          <h1 className="text-2xl font-semibold">Solar Management</h1>
        </div>
        <p className="text-muted-foreground">Control your solar energy system</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Connection Status</CardTitle>
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Azure IoT Hub: {connectionStatus === 'connected' ? 'Connected to your router' : 'Connection lost'}
          </p>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">System Status</CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus)} ${systemStatus === 'restarting' ? 'animate-pulse' : ''}`} />
              <Badge variant="outline">{getStatusText(systemStatus)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              Solar manager on router is {systemStatus}
            </span>
          </div>
          {lastCommand && (
            <p className="text-xs text-muted-foreground mt-2">
              Last command: {lastCommand} • {new Date().toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Control Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => sendIoTCommand('restart')}
              disabled={isLoading || connectionStatus !== 'connected'}
              variant="default"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
            
            <Button
              onClick={() => sendIoTCommand('pause')}
              disabled={isLoading || connectionStatus !== 'connected' || systemStatus === 'paused'}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            
            <Button
              onClick={() => sendIoTCommand('resume')}
              disabled={isLoading || connectionStatus !== 'connected' || systemStatus === 'running'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Resume
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Commands are sent directly to Azure IoT Hub
            </p>
            {isLoading && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Sending command...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Solar System Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Location</p>
                <p>Router</p>
              </div>
              <div>
                <p className="text-muted-foreground">Protocol</p>
                <p>Azure IoT Hub</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}