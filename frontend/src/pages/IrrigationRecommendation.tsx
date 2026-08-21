import { useState } from "react";
import { Droplets, Thermometer, CloudRain, Wind, CheckCircle2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// --- Mock API Interfaces & Functions ---
interface IrrigationPredictionResult {
  decision: "IRRIGATE TODAY" | "SKIP IRRIGATION";
  requirementLevel: "LOW" | "MEDIUM" | "HIGH";
  recommendedAmount: string;
  reason: string;
  gaugeData: any[];
  rainForecastData: any[];
  waterRequirementData: any[];
}

const simulateIrrigationAPI = async (payload: any): Promise<IrrigationPredictionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { soilMoisture, rainForecast, temp } = payload;
      
      let decision: "IRRIGATE TODAY" | "SKIP IRRIGATION" = "IRRIGATE TODAY";
      let requirementLevel: "LOW" | "MEDIUM" | "HIGH" = "HIGH";
      let recommendedAmount = "12–15 L/plant";
      let reason = "Low soil moisture combined with high temperature and low rainfall probability.";

      const moisture = parseInt(soilMoisture);
      const rain = parseInt(rainForecast);
      const t = parseInt(temp);

      if (rain > 70 || moisture > 60) {
        decision = "SKIP IRRIGATION";
        requirementLevel = "LOW";
        recommendedAmount = "0 L/plant";
        reason = moisture > 60 ? "Soil moisture is already optimal or high." : "High probability of significant rainfall today.";
      } else if (moisture > 40 && t < 25) {
        requirementLevel = "MEDIUM";
        recommendedAmount = "5–8 L/plant";
        reason = "Moderate soil moisture and cool temperatures require only maintenance watering.";
      }

      // Generate Chart Data
      const gaugeData = [
        { name: "Optimal", value: 100, fill: "#f3f4f6" },
        { name: "Current", value: moisture, fill: moisture < 30 ? "#ef4444" : moisture > 70 ? "#3b82f6" : "#22c55e" }
      ];

      const rainForecastData = [
        { day: "Mon", rain: rain },
        { day: "Tue", rain: Math.max(0, rain - 20) },
        { day: "Wed", rain: Math.max(0, rain - 40) },
        { day: "Thu", rain: 10 },
        { day: "Fri", rain: 0 },
        { day: "Sat", rain: 5 },
        { day: "Sun", rain: 0 }
      ];

      const waterRequirementData = [
        { stage: "Bud", need: 4 },
        { stage: "Extended", need: 6 },
        { stage: "Bloom", need: 12 },
        { stage: "Green", need: 15 },
        { stage: "Petal", need: 8 }
      ];

      resolve({
        decision,
        requirementLevel,
        recommendedAmount,
        reason,
        gaugeData,
        rainForecastData,
        waterRequirementData
      });
    }, 1500);
  });
};

export function IrrigationRecommendation() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IrrigationPredictionResult | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    crop: "blueberry",
    soilMoisture: "28",
    temperature: "32",
    humidity: "45",
    rainForecast: "10",
    growthStage: "greenfruit"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const data = await simulateIrrigationAPI(formData);
      setResult(data);
    } catch (error) {
      console.error("Failed to analyze:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Irrigation Recommendation</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          AI-driven watering schedules based on hyper-local environment and plant data.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Conditions</CardTitle>
              <CardDescription>Input current environmental metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="crop">Target Crop</Label>
                <Select value={formData.crop} onValueChange={(v) => handleInputChange('crop', v as string)}>
                  <SelectTrigger id="crop">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="strawberry">Strawberry</SelectItem>
                    <SelectItem value="tomato">Tomato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="growthStage">Growth Stage</Label>
                <Select value={formData.growthStage} onValueChange={(v) => handleInputChange('growthStage', v as string)}>
                  <SelectTrigger id="growthStage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bud">Bud</SelectItem>
                    <SelectItem value="bloom">Full Bloom</SelectItem>
                    <SelectItem value="greenfruit">Green Fruit</SelectItem>
                    <SelectItem value="ripe">Ripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="soilMoisture" 
                    type="number" 
                    className="pl-9" 
                    value={formData.soilMoisture}
                    onChange={(e) => handleInputChange('soilMoisture', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temp">Temp (°C)</Label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="temp" 
                      type="number" 
                      className="pl-9" 
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <div className="relative">
                    <Wind className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="humidity" 
                      type="number" 
                      className="pl-9" 
                      value={formData.humidity}
                      onChange={(e) => handleInputChange('humidity', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rain">Rain Probability (%)</Label>
                <div className="relative">
                  <CloudRain className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="rain" 
                    type="number" 
                    className="pl-9" 
                    value={formData.rainForecast}
                    onChange={(e) => handleInputChange('rainForecast', e.target.value)}
                  />
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing Environment..." : "Analyze Irrigation Need"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* RIGHT PANEL: Results & Visualizations */}
        <div className="lg:col-span-8 space-y-6">
          {!result ? (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <div className="text-center text-muted-foreground">
                <Droplets className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Enter field conditions and click Analyze to generate recommendations.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Decision Banner */}
              <Card className={`border-2 ${result.decision === 'IRRIGATE TODAY' ? 'border-blue-500 bg-blue-50/50' : 'border-green-500 bg-green-50/50'}`}>
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center shrink-0 ${result.decision === 'IRRIGATE TODAY' ? 'bg-blue-200 text-blue-700' : 'bg-green-200 text-green-700'}`}>
                      {result.decision === 'IRRIGATE TODAY' ? <Droplets className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-1">AI Recommendation</p>
                      <h2 className={`text-3xl font-black ${result.decision === 'IRRIGATE TODAY' ? 'text-blue-700' : 'text-green-700'}`}>
                        {result.decision}
                      </h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Recommended Volume</p>
                    <p className="text-2xl font-bold">{result.recommendedAmount}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Detail Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" /> Requirement Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Water Requirement</span>
                      <Badge variant="outline" className={`font-bold ${
                        result.requirementLevel === 'LOW' ? 'text-green-600 border-green-300' :
                        result.requirementLevel === 'MEDIUM' ? 'text-amber-600 border-amber-300' : 'text-red-600 border-red-300'
                      }`}>
                        {result.requirementLevel}
                      </Badge>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm font-medium mb-1">Reasoning:</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.reason}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg text-center">Soil Moisture Content</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center -mt-4">
                    <div className="h-[200px] w-full max-w-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="80%" 
                          innerRadius="60%" 
                          outerRadius="100%" 
                          barSize={20} 
                          data={result.gaugeData}
                          startAngle={180}
                          endAngle={0}
                        >
                          <RadialBar background dataKey="value" cornerRadius={10} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="text-center -mt-12 relative z-10">
                        <span className="text-3xl font-bold">{formData.soilMoisture}%</span>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Current Level</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">7-Day Rain Probability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.rainForecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <Tooltip cursor={{fill: '#f3f4f6'}} />
                          <Bar dataKey="rain" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Rain %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Water Need by Stage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.waterRequirementData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="need" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: "#10b981"}} name="L/plant" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
