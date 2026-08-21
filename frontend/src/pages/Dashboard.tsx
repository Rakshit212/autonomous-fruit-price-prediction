
import { Link } from "react-router-dom";
import { 
  Sprout, 
  TrendingUp, 
  LineChart, 
  MapPin, 
  Droplets, 
  CloudSun, 
  AlertTriangle, 
  ChevronRight, 
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// --- Mock Data ---
const plantHealthScore = 78;
const fruitCount = "1,245";
const predictedYield = "8.7 kg";
const currentPrice = "₹420/kg";
const predictedPrice = "₹455/kg";
const farmSuitability = "92%";

const growthStageData = [
  { name: 'Bud', value: 15, color: '#fcd34d' },
  { name: 'Full Bloom', value: 30, color: '#f472b6' },
  { name: 'Green Fruit', value: 45, color: '#4ade80' },
  { name: 'Ripe', value: 10, color: '#ef4444' }
];

const yieldTrendData = [
  { month: 'Jan', actual: 400, predicted: 420 },
  { month: 'Feb', actual: 300, predicted: 310 },
  { month: 'Mar', actual: 550, predicted: 500 },
  { month: 'Apr', actual: null, predicted: 620 },
  { month: 'May', actual: null, predicted: 680 },
];

const priceTrendData = [
  { day: 'Mon', price: 400 },
  { day: 'Tue', price: 410 },
  { day: 'Wed', price: 420 },
  { day: 'Thu', price: 435 },
  { day: 'Fri', price: 455 },
];

const recentAnalysisData = [
  { id: 1, date: "2023-10-25", plant: "Blueberry Row A", fruitCount: 342, score: 85, yield: "2.4 kg" },
  { id: 2, date: "2023-10-24", plant: "Blueberry Row B", fruitCount: 289, score: 72, yield: "1.8 kg" },
  { id: 3, date: "2023-10-22", plant: "Strawberry Patch", fruitCount: 512, score: 91, yield: "3.1 kg" },
  { id: 4, date: "2023-10-20", plant: "Tomato Greenhouse", fruitCount: 102, score: 68, yield: "5.5 kg" },
];

export function Dashboard() {
  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Good morning, Farmer</h1>
          <p className="text-muted-foreground mt-1">Here's your farm intelligence for today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/plant-analysis">
            <Button variant="outline" className="gap-2"><Sprout className="h-4 w-4" /> Analyze Plant</Button>
          </Link>
          <Link to="/yield">
            <Button variant="outline" className="gap-2"><TrendingUp className="h-4 w-4" /> Predict Yield</Button>
          </Link>
          <Link to="/price">
            <Button variant="outline" className="gap-2"><LineChart className="h-4 w-4" /> Check Price</Button>
          </Link>
          <Link to="/plantation">
            <Button className="gap-2 bg-primary"><MapPin className="h-4 w-4" /> Analyze Farm</Button>
          </Link>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">Plant Health</span>
              <Activity className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-primary">{plantHealthScore}<span className="text-base font-normal text-muted-foreground">/100</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">Fruit Count</span>
              <Sprout className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold">{fruitCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">Expected Yield</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{predictedYield}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">Current Price</span>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{currentPrice}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-primary">Predicted Price</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{predictedPrice}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">Farm Match</span>
              <MapPin className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{farmSuitability}</div>
          </CardContent>
        </Card>
      </div>

      {/* PRIORITY RECOMMENDATIONS & WEATHER */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Priority Recommendations */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Priority Directives
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">Market</Badge>
                <h4 className="font-black text-lg text-blue-700 mb-1">WAIT TO SELL</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">Price predicted to increase to ₹455/kg over next 7 days.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 bg-amber-50 text-amber-700 border-amber-200">Irrigation</Badge>
                <h4 className="font-black text-lg text-amber-700 mb-1">SKIP TODAY</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">72% chance of rain. Soil moisture is already optimal.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-rose-500 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 bg-rose-50 text-rose-700 border-rose-200">Health</Badge>
                <h4 className="font-black text-lg text-rose-700 mb-1">MONITOR</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">High humidity increasing Early Blight risk.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-sky-500" /> Current Weather
            </h3>
            <Link to="/weather" className="text-xs font-medium text-primary hover:underline flex items-center">
              Full forecast <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-sky-700 mb-1">Pune, Maharashtra</p>
                  <h4 className="text-4xl font-black text-sky-900">31°C</h4>
                  <p className="text-sm text-sky-700 mt-1">Scattered Clouds</p>
                </div>
                <CloudSun className="h-16 w-16 text-sky-400" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-sky-200/50 pt-4">
                <div>
                  <p className="text-xs text-sky-600 font-medium flex items-center gap-1"><Droplets className="h-3 w-3" /> Humidity</p>
                  <p className="text-lg font-bold text-sky-900">68%</p>
                </div>
                <div>
                  <p className="text-xs text-sky-600 font-medium flex items-center gap-1"><CloudSun className="h-3 w-3" /> Rain Prob.</p>
                  <p className="text-lg font-bold text-sky-900">72%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ANALYTICS CHARTS ROW */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Plant Analysis Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Growth Distribution</CardTitle>
              <Link to="/plant-analysis" className="text-muted-foreground hover:text-primary"><ChevronRight className="h-4 w-4" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={growthStageData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {growthStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {growthStageData.map((stage) => (
                <div key={stage.name} className="flex items-center gap-1 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-muted-foreground">{stage.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Yield Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Yield Trajectory</CardTitle>
              <Link to="/yield" className="text-muted-foreground hover:text-primary"><ChevronRight className="h-4 w-4" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="actual" stroke="#10b981" fillOpacity={1} fill="url(#colorYield)" />
                  <Area type="monotone" dataKey="predicted" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Market Forecast</CardTitle>
              <Link to="/price" className="text-muted-foreground hover:text-primary"><ChevronRight className="h-4 w-4" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={priceTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} domain={['dataMin - 10', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: "#3b82f6"}} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* RECENT ANALYSIS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans & Analysis</CardTitle>
          <CardDescription>Latest data processed by AgroVision AI models.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Plant / Zone</th>
                  <th className="px-4 py-3 font-medium">Fruit Count</th>
                  <th className="px-4 py-3 font-medium">Growth Score</th>
                  <th className="px-4 py-3 font-medium">Predicted Yield</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalysisData.map((row, i) => (
                  <tr key={row.id} className={i !== recentAnalysisData.length - 1 ? "border-b" : ""}>
                    <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 font-medium">{row.plant}</td>
                    <td className="px-4 py-3">{row.fruitCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${row.score}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{row.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">{row.yield}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
