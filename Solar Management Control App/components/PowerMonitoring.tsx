import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Sun, Home, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PowerData {
  timestamp: string;
  solarGeneration: number;
  houseConsumption: number;
  gridFlow: number; // positive = exporting, negative = importing
}

export function PowerMonitoring() {
  const [currentData, setCurrentData] = useState({
    solarGeneration: 3.2, // kW
    houseConsumption: 2.8, // kW
    gridFlow: 0.4, // kW (positive = exporting)
  });

  const [historicalData, setHistoricalData] = useState<PowerData[]>([]);

  // Mock real-time data updates
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      // Simulate realistic solar generation based on time of day
      const hour = now.getHours();
      let solarMultiplier = 0;
      if (hour >= 6 && hour <= 18) {
        // Simulate solar generation curve
        const normalizedHour = (hour - 6) / 12; // 0 to 1 from 6am to 6pm
        solarMultiplier = Math.sin(normalizedHour * Math.PI) * 0.8 + 0.2;
      }
      
      const baseSolar = 4.5; // Peak solar capacity
      const solarGeneration = Math.max(0, baseSolar * solarMultiplier + (Math.random() - 0.5) * 0.5);
      
      // House consumption varies throughout the day
      const baseConsumption = 2.5;
      const consumptionVariation = Math.sin((hour + Math.random() * 2) / 24 * 2 * Math.PI) * 1.5 + 1.5;
      const houseConsumption = Math.max(0.5, baseConsumption + consumptionVariation + (Math.random() - 0.5) * 0.8);
      
      const gridFlow = solarGeneration - houseConsumption;

      const newData = {
        timestamp: timeString,
        solarGeneration: Number(solarGeneration.toFixed(1)),
        houseConsumption: Number(houseConsumption.toFixed(1)),
        gridFlow: Number(gridFlow.toFixed(1)),
      };

      setCurrentData({
        solarGeneration: newData.solarGeneration,
        houseConsumption: newData.houseConsumption,
        gridFlow: newData.gridFlow,
      });

      setHistoricalData(prev => {
        const updated = [...prev, newData];
        // Keep only last 20 data points
        return updated.slice(-20);
      });
    };

    // Generate initial data
    const initialData = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date();
      time.setMinutes(time.getMinutes() - i * 3);
      const hour = time.getHours();
      
      let solarMultiplier = 0;
      if (hour >= 6 && hour <= 18) {
        const normalizedHour = (hour - 6) / 12;
        solarMultiplier = Math.sin(normalizedHour * Math.PI) * 0.8 + 0.2;
      }
      
      const solarGeneration = Math.max(0, 4.5 * solarMultiplier + (Math.random() - 0.5) * 0.5);
      const houseConsumption = Math.max(0.5, 2.5 + Math.sin((hour + Math.random() * 2) / 24 * 2 * Math.PI) * 1.5 + 1.5 + (Math.random() - 0.5) * 0.8);
      
      initialData.push({
        timestamp: time.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        solarGeneration: Number(solarGeneration.toFixed(1)),
        houseConsumption: Number(houseConsumption.toFixed(1)),
        gridFlow: Number((solarGeneration - houseConsumption).toFixed(1)),
      });
    }
    
    setHistoricalData(initialData);
    setCurrentData({
      solarGeneration: initialData[initialData.length - 1]?.solarGeneration || 0,
      houseConsumption: initialData[initialData.length - 1]?.houseConsumption || 0,
      gridFlow: initialData[initialData.length - 1]?.gridFlow || 0,
    });

    // Update every 30 seconds
    const interval = setInterval(generateMockData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getGridFlowStatus = (flow: number) => {
    if (flow > 0.1) return { status: 'exporting', color: 'text-green-500', icon: TrendingUp, text: 'Exporting to Grid' };
    if (flow < -0.1) return { status: 'importing', color: 'text-red-500', icon: TrendingDown, text: 'Importing from Grid' };
    return { status: 'balanced', color: 'text-yellow-500', icon: Minus, text: 'Balanced' };
  };

  const gridStatus = getGridFlowStatus(currentData.gridFlow);
  const GridIcon = gridStatus.icon;

  const formatTooltipValue = (value: number, name: string) => {
    const unit = 'kW';
    const color = name === 'solarGeneration' ? '#22c55e' : name === 'houseConsumption' ? '#f59e0b' : '#3b82f6';
    return [`${value} ${unit}`, name === 'solarGeneration' ? 'Solar Generation' : name === 'houseConsumption' ? 'House Consumption' : 'Grid Flow'];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-semibold">Power Monitoring</h1>
        </div>
        <p className="text-muted-foreground">Real-time energy generation and consumption</p>
      </div>

      {/* Current Power Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solar Generation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Solar Generation</CardTitle>
              <Sun className="h-6 w-6 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-green-600">
                {currentData.solarGeneration} kW
              </div>
              <div className="text-sm text-muted-foreground">
                Current output from panels
              </div>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* House Consumption */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">House Consumption</CardTitle>
              <Home className="h-6 w-6 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-orange-600">
                {currentData.houseConsumption} kW
              </div>
              <div className="text-sm text-muted-foreground">
                Total household usage
              </div>
              <Badge variant="outline" className="text-orange-600">
                Consuming
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Grid Flow */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Grid Flow</CardTitle>
              <GridIcon className={`h-6 w-6 ${gridStatus.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-3xl font-semibold ${gridStatus.color}`}>
                {Math.abs(currentData.gridFlow)} kW
              </div>
              <div className="text-sm text-muted-foreground">
                {gridStatus.text}
              </div>
              <Badge 
                variant="outline" 
                className={gridStatus.status === 'exporting' ? 'text-green-600' : gridStatus.status === 'importing' ? 'text-red-600' : 'text-yellow-600'}
              >
                {gridStatus.status === 'exporting' ? 'Surplus' : gridStatus.status === 'importing' ? 'Deficit' : 'Balanced'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Power Flow Over Time</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time power generation and consumption (last hour)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="solarGeneration" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                  name="Solar Generation"
                />
                <Line 
                  type="monotone" 
                  dataKey="houseConsumption" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                  name="House Consumption"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Energy Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Energy Balance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Net energy flow and grid interaction
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Net Power (kW)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    `${value} kW`, 
                    value >= 0 ? 'Exporting to Grid' : 'Importing from Grid'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gridFlow" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Today's Generation</p>
              <p className="text-2xl font-semibold text-green-600">24.8 kWh</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Today's Consumption</p>
              <p className="text-2xl font-semibold text-orange-600">31.2 kWh</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Grid Import</p>
              <p className="text-2xl font-semibold text-red-600">6.4 kWh</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Self Sufficiency</p>
              <p className="text-2xl font-semibold text-blue-600">79.5%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}