import { useState } from "react";
import { Calculator, Download, Save, TrendingUp, Cpu, Info, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

// Mock API Response Type
interface YieldPredictionResult {
  predicted_yield_kg: number;
  expected_fruits: number;
  confidence: number;
  max_potential_yield: number;
  factors: {
    positive: string[];
    negative: string[];
  };
  explanation: string;
}

// Simulated API Call
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const simulateYieldPredictionAPI = async (_payload: any): Promise<YieldPredictionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        predicted_yield_kg: 8.7,
        expected_fruits: 1245,
        confidence: 87,
        max_potential_yield: 10.0,
        factors: {
          positive: [
            "High concentration of Full Blooms (32) and Green Fruits (21).",
            "Optimal temperature and humidity ranges.",
            "Strong historical yield baseline."
          ],
          negative: [
            "Slightly below-average rainfall expected in the coming weeks.",
            "Pest risk is moderately elevated due to humidity."
          ]
        },
        explanation: "Strong full-bloom and green-fruit counts are contributing positively to predicted yield. The high flower-to-fruit conversion rate observed offsets minor environmental risks."
      });
    }, 2000);
  });
};

const historicalYieldData = [
  { year: "2021", yield: 7.2 },
  { year: "2022", yield: 7.8 },
  { year: "2023", yield: 8.1 },
  { year: "2024 (Pred)", yield: 8.7, isPredicted: true },
];

export function YieldPrediction() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<YieldPredictionResult | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    plantCrop: "blueberry",
    plantAge: "3",
    plantArea: "1.5",
    growthStage: "mixed",
    temperature: "24",
    humidity: "65",
    rainfall: "12",
    historicalYield: "8.1",
    // YOLO mock counts
    bud: 0,
    extendedBud: 0,
    fullBloom: 0,
    greenFruit: 0,
    petalFall: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const useLatestAnalysis = () => {
    setFormData((prev) => ({
      ...prev,
      bud: 12,
      extendedBud: 18,
      fullBloom: 32,
      greenFruit: 21,
      petalFall: 8,
    }));
  };

  const runPrediction = async () => {
    setIsPredicting(true);
    setResult(null);
    try {
      const data = await simulateYieldPredictionAPI(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Yield Prediction</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Estimate future crop yield using AI-powered analysis and environmental factors.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Prediction Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prediction Input</CardTitle>
                  <CardDescription>Configure the parameters for the prediction model.</CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={useLatestAnalysis} className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
                  <Cpu className="mr-2 h-4 w-4" /> Use Latest Plant Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Crop Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plant / Crop</Label>
                    <Select value={formData.plantCrop} onValueChange={(v) => v && handleInputChange("plantCrop", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Crop" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="strawberry">Strawberry</SelectItem>
                        <SelectItem value="raspberry">Raspberry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Growth Stage</Label>
                    <Select value={formData.growthStage} onValueChange={(v) => v && handleInputChange("growthStage", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Stage" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bud">Budding</SelectItem>
                        <SelectItem value="bloom">Blooming</SelectItem>
                        <SelectItem value="fruit">Fruiting</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Plant Age (Years)</Label>
                    <Input type="number" value={formData.plantAge} onChange={(e) => handleInputChange("plantAge", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Plant Area (Acres)</Label>
                    <Input type="number" value={formData.plantArea} onChange={(e) => handleInputChange("plantArea", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Environmental Data */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Environmental & Historical Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Avg Temperature (°C)</Label>
                    <Input type="number" value={formData.temperature} onChange={(e) => handleInputChange("temperature", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Avg Humidity (%)</Label>
                    <Input type="number" value={formData.humidity} onChange={(e) => handleInputChange("humidity", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Rainfall (mm)</Label>
                    <Input type="number" value={formData.rainfall} onChange={(e) => handleInputChange("rainfall", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Historical Yield (kg/acre)</Label>
                    <Input type="number" value={formData.historicalYield} onChange={(e) => handleInputChange("historicalYield", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* YOLO Data (Auto-filled) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Detection Counts</h3>
                  {(formData.fullBloom > 0 || formData.greenFruit > 0) && (
                    <Badge variant="outline" className="text-[10px] h-5 bg-green-500/10 text-green-600 border-green-500/20">Synced</Badge>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Bud</Label>
                    <Input className="h-8 px-2 text-sm" type="number" value={formData.bud} onChange={(e) => handleInputChange("bud", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ext. Bud</Label>
                    <Input className="h-8 px-2 text-sm" type="number" value={formData.extendedBud} onChange={(e) => handleInputChange("extendedBud", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Bloom</Label>
                    <Input className="h-8 px-2 text-sm" type="number" value={formData.fullBloom} onChange={(e) => handleInputChange("fullBloom", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Fruit</Label>
                    <Input className="h-8 px-2 text-sm" type="number" value={formData.greenFruit} onChange={(e) => handleInputChange("greenFruit", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Drop</Label>
                    <Input className="h-8 px-2 text-sm" type="number" value={formData.petalFall} onChange={(e) => handleInputChange("petalFall", e.target.value)} />
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={runPrediction}
                disabled={isPredicting}
              >
                {isPredicting ? (
                  <>
                    <Cpu className="mr-2 h-4 w-4 animate-pulse" />
                    Running ML Model...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Run Prediction
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* SECTION 2: Prediction Result */}
        <div className="space-y-6">
          {!result && !isPredicting && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/30">
              <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-center">Configure inputs and run the prediction to view yield forecasts.</p>
            </div>
          )}

          {isPredicting && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
               <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                <Cpu className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-primary">AI Inference in Progress</h3>
                <p className="text-sm text-muted-foreground mt-1">Analyzing environmental factors and crop counts...</p>
              </div>
            </div>
          )}
          
          {result && !isPredicting && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main KPI Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="col-span-2 bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm font-medium opacity-80">Predicted Yield (per acre)</p>
                        <p className="text-5xl font-bold mt-1">{result.predicted_yield_kg} <span className="text-2xl font-normal opacity-80">kg</span></p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none text-sm px-3 py-1">
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                    
                    {/* Gauge / Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm opacity-90">
                        <span>Yield Potential Achieved</span>
                        <span>{((result.predicted_yield_kg / result.max_potential_yield) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(result.predicted_yield_kg / result.max_potential_yield) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs opacity-70">
                        <span>0 kg</span>
                        <span>Max {result.max_potential_yield} kg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Expected Fruits</p>
                    <p className="text-3xl font-bold">{result.expected_fruits.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Growth Trend</p>
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <TrendingUp className="h-6 w-6" />
                      <p className="text-2xl font-bold">Positive</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Yield Factors */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-green-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Positive Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {result.factors.positive.map((factor, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="h-3 w-3 mr-2 mt-1 shrink-0 text-green-500" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-amber-700">
                      <AlertTriangle className="h-4 w-4 mr-2" /> Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {result.factors.negative.map((factor, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="h-3 w-3 mr-2 mt-1 shrink-0 text-amber-500" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Historical vs Predicted Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalYieldData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8e4" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: '#f3f4f6' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8e4' }}
                        />
                        <Bar dataKey="yield" radius={[4, 4, 0, 0]} maxBarSize={50}>
                          {historicalYieldData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isPredicted ? "#1e5631" : "#9ca3af"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">Prediction Rationale</AlertTitle>
                <AlertDescription className="text-muted-foreground text-sm mt-1">
                  {result.explanation}
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" /> Save Prediction
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download Report
                </Button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
