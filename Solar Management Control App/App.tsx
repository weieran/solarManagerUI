import React, { useState, useEffect } from 'react';
import { SolarDashboard } from './components/SolarDashboard';
import { PowerMonitoring } from './components/PowerMonitoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { Settings, Activity } from 'lucide-react';

export default function App() {
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Detect if running in Capacitor (native app)
    const checkNativeApp = () => {
      if (typeof window !== 'undefined') {
        // Check for Capacitor
        setIsNativeApp(!!(window as any).Capacitor);
      }
    };
    
    checkNativeApp();
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isNativeApp ? 'pt-safe-top pb-safe-bottom' : ''}`}>
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="control" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="control" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Control</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Monitor</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="control" className="mt-0">
            <SolarDashboard />
          </TabsContent>
          
          <TabsContent value="monitoring" className="mt-0">
            <PowerMonitoring />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}