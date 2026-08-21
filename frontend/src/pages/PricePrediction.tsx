import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Cpu, AlertTriangle, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

// --- Mock API Interfaces & Functions ---
interface PriceHistoryPoint {
  date: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  isPredicted?: boolean;
}

interface PricePredictionResult {
  currentPrice: number;
  predictedPrice: number;
  expectedChangePercent: number;
  trend: "RISING" | "FALLING" | "STABLE";
  confidence: number;
  recommendation: "WAIT TO SELL" | "SELL NOW" | "HOLD";
  reason: string;
  predictedDataPoints: PriceHistoryPoint[];
}

const simulatePriceHistoryAPI = async (): Promise<PriceHistoryPoint[]> => {
  return [
    { date: "Aug 15", market: "Azadpur Mandi", minPrice: 380, maxPrice: 410, avgPrice: 395 },
    { date: "Aug 16", market: "Azadpur Mandi", minPrice: 385, maxPrice: 415, avgPrice: 400 },
    { date: "Aug 17", market: "Azadpur Mandi", minPrice: 390, maxPrice: 420, avgPrice: 405 },
    { date: "Aug 18", market: "Azadpur Mandi", minPrice: 395, maxPrice: 425, avgPrice: 410 },
    { date: "Aug 19", market: "Azadpur Mandi", minPrice: 400, maxPrice: 430, avgPrice: 415 },
    { date: "Aug 20", market: "Azadpur Mandi", minPrice: 405, maxPrice: 435, avgPrice: 420 },
  ];
};

const simulatePricePredictionAPI = async (horizon: string): Promise<PricePredictionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let predictedPoints: PriceHistoryPoint[] = [];
      
      if (horizon === "tomorrow") {
        predictedPoints = [
          { date: "Aug 21 (Pred)", market: "Azadpur Mandi", minPrice: 415, maxPrice: 440, avgPrice: 428, isPredicted: true },
        ];
        resolve({
          currentPrice: 420,
          predictedPrice: 428,
          expectedChangePercent: 1.9,
          trend: "RISING",
          confidence: 92,
          recommendation: "HOLD",
          reason: "Prices are showing a slight upward trend tomorrow. Hold for better margins.",
          predictedDataPoints: predictedPoints,
        });
      } else if (horizon === "7days") {
        predictedPoints = [
          { date: "Aug 21 (Pred)", market: "Azadpur Mandi", minPrice: 410, maxPrice: 440, avgPrice: 425, isPredicted: true },
          { date: "Aug 23 (Pred)", market: "Azadpur Mandi", minPrice: 420, maxPrice: 450, avgPrice: 435, isPredicted: true },
          { date: "Aug 25 (Pred)", market: "Azadpur Mandi", minPrice: 430, maxPrice: 460, avgPrice: 445, isPredicted: true },
          { date: "Aug 27 (Pred)", market: "Azadpur Mandi", minPrice: 440, maxPrice: 470, avgPrice: 455, isPredicted: true },
        ];
        resolve({
          currentPrice: 420,
          predictedPrice: 455,
          expectedChangePercent: 8.3,
          trend: "RISING",
          confidence: 84,
          recommendation: "WAIT TO SELL",
          reason: "Market price is expected to increase significantly over the next 7 days due to festive demand.",
          predictedDataPoints: predictedPoints,
        });
      } else {
        // 30 days
        predictedPoints = [
          { date: "Aug 25 (Pred)", market: "Azadpur Mandi", minPrice: 430, maxPrice: 460, avgPrice: 445, isPredicted: true },
          { date: "Sep 01 (Pred)", market: "Azadpur Mandi", minPrice: 410, maxPrice: 440, avgPrice: 425, isPredicted: true },
          { date: "Sep 10 (Pred)", market: "Azadpur Mandi", minPrice: 380, maxPrice: 410, avgPrice: 395, isPredicted: true },
          { date: "Sep 20 (Pred)", market: "Azadpur Mandi", minPrice: 360, maxPrice: 390, avgPrice: 375, isPredicted: true },
        ];
        resolve({
          currentPrice: 420,
          predictedPrice: 375,
          expectedChangePercent: -10.7,
          trend: "FALLING",
          confidence: 76,
          recommendation: "SELL NOW",
          reason: "Prices are expected to drop over the next 30 days due to oversupply in the market.",
          predictedDataPoints: predictedPoints,
        });
      }
    }, 1500);
  });
};


export function PricePrediction() {
  const [historyData, setHistoryData] = useState<PriceHistoryPoint[]>([]);
  const [prediction, setPrediction] = useState<PricePredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    fruit: "blueberry",
    state: "delhi",
    market: "azadpur",
    horizon: "7days",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Load initial history
  useEffect(() => {
    const loadHistory = async () => {
      const hist = await simulatePriceHistoryAPI();
      setHistoryData(hist);
      // Initialize chart with just history
      const formatted = hist.map(pt => ({
        date: pt.date,
        historicalPrice: pt.avgPrice,
        predictedPrice: null
      }));
      setChartData(formatted);
    };
    loadHistory();
  }, []);

  const runAnalysis = async () => {
    setIsPredicting(true);
    try {
      const predResult = await simulatePricePredictionAPI(formData.horizon);
      setPrediction(predResult);

      // Merge history and prediction for the chart
      const mergedChartData: Array<{ date: string, historicalPrice: number | null, predictedPrice: number | null }> = historyData.map(pt => ({
        date: pt.date,
        historicalPrice: pt.avgPrice,
        predictedPrice: null
      }));
      
      // Connect the lines by adding the last historical point to the predicted series
      if (historyData.length > 0 && predResult.predictedDataPoints.length > 0) {
        const lastHist = historyData[historyData.length - 1];
        mergedChartData[mergedChartData.length - 1].predictedPrice = lastHist.avgPrice;
      }

      predResult.predictedDataPoints.forEach(pt => {
        mergedChartData.push({
          date: pt.date,
          historicalPrice: null,
          predictedPrice: pt.avgPrice
        });
      });

      setChartData(mergedChartData);

    } catch (error) {
      console.error(error);
    } finally {
      setIsPredicting(false);
    }
  };


  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Market Intelligence</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Predict future fruit prices and identify the best time to sell using AI.
        </p>
      </div>

      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Current Market Price</p>
            <div className="flex items-center mt-2">
              <p className="text-3xl font-bold">₹{prediction ? prediction.currentPrice : "420"}</p>
              <span className="text-sm text-muted-foreground ml-1">/kg</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Predicted Price</p>
            <div className="flex items-center mt-2">
              <p className="text-3xl font-bold text-primary">₹{prediction ? prediction.predictedPrice : "---"}</p>
              <span className="text-sm text-muted-foreground ml-1">/kg</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Expected Change</p>
            <div className="flex items-center mt-2">
              <p className={`text-3xl font-bold ${prediction ? (prediction.expectedChangePercent > 0 ? "text-green-600" : prediction.expectedChangePercent < 0 ? "text-red-600" : "text-muted-foreground") : "text-muted-foreground"}`}>
                {prediction ? `${prediction.expectedChangePercent > 0 ? "+" : ""}${prediction.expectedChangePercent}%` : "---"}
              </p>
              {prediction && prediction.expectedChangePercent > 0 && <ArrowUpRight className="ml-2 h-6 w-6 text-green-600" />}
              {prediction && prediction.expectedChangePercent < 0 && <ArrowDownRight className="ml-2 h-6 w-6 text-red-600" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Trend</p>
            <div className="flex items-center mt-2">
              <p className="text-3xl font-bold uppercase tracking-wider">{prediction ? prediction.trend : "---"}</p>
              {prediction?.trend === "RISING" && <TrendingUp className="ml-2 h-6 w-6 text-green-600" />}
              {prediction?.trend === "FALLING" && <TrendingDown className="ml-2 h-6 w-6 text-red-600" />}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Input & Recommendation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Parameters</CardTitle>
              <CardDescription>Select market details to run AI price prediction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fruit</Label>
                <Select value={formData.fruit} onValueChange={(v) => v && handleInputChange("fruit", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Fruit" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="mango">Mango</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={formData.state} onValueChange={(v) => v && handleInputChange("state", v)}>
                  <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Market</Label>
                <Select value={formData.market} onValueChange={(v) => v && handleInputChange("market", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Market" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="azadpur">Azadpur Mandi</SelectItem>
                    <SelectItem value="ghazipur">Ghazipur Mandi</SelectItem>
                    <SelectItem value="okhla">Okhla Mandi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prediction Horizon</Label>
                <Select value={formData.horizon} onValueChange={(v) => v && handleInputChange("horizon", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Horizon" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={runAnalysis}
                disabled={isPredicting}
              >
                {isPredicting ? (
                  <><Cpu className="mr-2 h-4 w-4 animate-pulse" /> Analyzing Market...</>
                ) : (
                  <><Activity className="mr-2 h-4 w-4" /> Analyze Market</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Selling Recommendation */}
          {prediction && (
            <Alert className={`border-2 ${
              prediction.recommendation === "WAIT TO SELL" ? "border-amber-500/50 bg-amber-500/10" :
              prediction.recommendation === "SELL NOW" ? "border-green-500/50 bg-green-500/10" :
              "border-blue-500/50 bg-blue-500/10"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {prediction.recommendation === "WAIT TO SELL" && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                {prediction.recommendation === "SELL NOW" && <TrendingUp className="h-5 w-5 text-green-600" />}
                {prediction.recommendation === "HOLD" && <Info className="h-5 w-5 text-blue-600" />}
                <AlertTitle className="text-lg font-bold uppercase tracking-wider mb-0">
                  {prediction.recommendation}
                </AlertTitle>
              </div>
              <AlertDescription className="text-sm mt-2 opacity-90 font-medium">
                {prediction.reason}
              </AlertDescription>
            </Alert>
          )}

          {/* Confidence Badge */}
          {prediction && (
             <Card>
               <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex items-center text-muted-foreground">
                   <Cpu className="h-4 w-4 mr-2" />
                   <span className="text-sm font-medium">Prediction Confidence</span>
                 </div>
                 <Badge variant="secondary" className="text-sm font-bold bg-primary/10 text-primary">
                   {prediction.confidence}%
                 </Badge>
               </CardContent>
             </Card>
          )}
        </div>

        {/* RIGHT COLUMN: Visualizations & Data */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Forecast Chart</CardTitle>
              <CardDescription>Historical price vs AI predicted price over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8e4" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                    <Line 
                      type="monotone" 
                      dataKey="historicalPrice" 
                      name="Historical Price (₹)" 
                      stroke="#1e5631" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#1e5631", strokeWidth: 0 }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predictedPrice" 
                      name="Predicted Price (₹)" 
                      stroke="#f59e0b" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Market History</CardTitle>
                <CardDescription>Recent recorded prices at selected market.</CardDescription>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex flex-col items-end">
                  <span className="text-muted-foreground text-xs">7-Day Avg</span>
                  <span className="font-semibold">₹408</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-muted-foreground text-xs">30-Day Avg</span>
                  <span className="font-semibold">₹395</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead className="text-right">Min Price</TableHead>
                    <TableHead className="text-right">Max Price</TableHead>
                    <TableHead className="text-right">Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Append prediction points to history for table view if prediction exists */}
                  {[...historyData, ...(prediction ? prediction.predictedDataPoints : [])].slice(-6).map((item, index) => (
                    <TableRow key={index} className={item.isPredicted ? "bg-amber-50/50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {item.date}
                          {item.isPredicted && <Badge variant="outline" className="text-[10px] h-4 px-1 ml-2 text-amber-600 border-amber-200">AI</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{item.market}</TableCell>
                      <TableCell className="text-right">₹{item.minPrice}</TableCell>
                      <TableCell className="text-right">₹{item.maxPrice}</TableCell>
                      <TableCell className="text-right font-bold">₹{item.avgPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
