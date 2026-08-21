import { useState, useEffect } from "react";
import { Cloud, Droplets, Wind, Thermometer, Search, AlertTriangle, CloudRain, Sun, Sprout, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";

export function WeatherDashboard() {
  const [location, setLocation] = useState("Delhi");
  const [searchInput, setSearchInput] = useState("Delhi");
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch Current Weather
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!currentRes.ok) throw new Error("City not found");
      const current = await currentRes.json();
      setWeatherData(current);

      // Fetch 5-Day Forecast (every 3 hours)
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      const forecast = await forecastRes.json();
      
      // Process forecast data to get daily aggregates
      const dailyDataMap = new Map();
      
      forecast.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
        if (!dailyDataMap.has(date)) {
          dailyDataMap.set(date, {
            date,
            temps: [],
            humidities: [],
            rainfall: 0
          });
        }
        
        const day = dailyDataMap.get(date);
        day.temps.push(item.main.temp);
        day.humidities.push(item.main.humidity);
        if (item.rain && item.rain['3h']) {
          day.rainfall += item.rain['3h'];
        }
      });

      const processedForecast = Array.from(dailyDataMap.values()).map(day => ({
        date: day.date,
        temperature: Math.round(day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length),
        humidity: Math.round(day.humidities.reduce((a: number, b: number) => a + b, 0) / day.humidities.length),
        rainfall: Number(day.rainfall.toFixed(1))
      })).slice(0, 5); // Take first 5 days

      setForecastData(processedForecast);
      setLocation(current.name);

    } catch (err: any) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput);
    }
  };

  // Generate agricultural advice based on current and forecast data
  const generateAgriAdvice = () => {
    if (!weatherData || forecastData.length === 0) return null;

    const currentTemp = weatherData.main.temp;
    const isRainingNow = weatherData.weather[0].main.toLowerCase().includes("rain");
    const heavyRainComing = forecastData.some(d => d.rainfall > 10);
    const highHumidityComing = forecastData.some(d => d.humidity > 85);

    let irrigation = "GOOD";
    let planting = "FAVORABLE";
    let diseaseRisk = "LOW";
    let alertMsg = null;
    let adviceMsg = "Conditions are stable. Continue standard farming operations.";

    if (isRainingNow || heavyRainComing) {
      irrigation = "HOLD";
      planting = "DELAY";
      alertMsg = heavyRainComing ? "Heavy rainfall expected in the coming days." : "Currently raining.";
      adviceMsg = "Delay irrigation and avoid planting new seeds until the rain passes to prevent waterlogging.";
    } else if (currentTemp > 35) {
      irrigation = "CRITICAL";
      planting = "POOR";
      alertMsg = "High temperatures detected.";
      adviceMsg = "Increase irrigation frequency to prevent heat stress. Avoid planting during peak heat.";
    }

    if (highHumidityComing && currentTemp > 25) {
      diseaseRisk = "HIGH";
      if (!alertMsg) alertMsg = "High humidity and warm temperatures detected.";
      adviceMsg += " High risk of fungal diseases. Consider applying preventative fungicides.";
    } else if (highHumidityComing || currentTemp > 25) {
      diseaseRisk = "MODERATE";
    }

    return { irrigation, planting, diseaseRisk, alertMsg, adviceMsg };
  };

  const advice = generateAgriAdvice();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Weather Intelligence</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time agricultural weather tracking and AI advisory.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex max-w-sm w-full gap-2">
          <Input 
            placeholder="Search location (e.g., Pune, IN)" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <span className="animate-pulse">...</span> : <Search className="w-4 h-4" />}
          </Button>
        </form>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {weatherData && advice && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">{location}, {weatherData.sys.country}</h2>
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">Live API Data</Badge>
          </div>

          {/* TOP METRICS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                  <p className="text-3xl font-bold mt-1">{Math.round(weatherData.main.temp)}°C</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Humidity</p>
                  <p className="text-3xl font-bold mt-1">{weatherData.main.humidity}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conditions</p>
                  <p className="text-xl font-bold mt-1 capitalize">{weatherData.weather[0].description}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Cloud className="h-6 w-6 text-slate-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wind Speed</p>
                  <p className="text-3xl font-bold mt-1">{(weatherData.wind.speed * 3.6).toFixed(1)} <span className="text-sm font-normal">km/h</span></p>
                </div>
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Wind className="h-6 w-6 text-teal-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Agricultural Conditions & Alerts */}
            <div className="space-y-6">
              
              {advice.alertMsg && (
                <Alert className="border-red-200 bg-red-50 text-red-900">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="font-bold text-red-800">Weather Alert</AlertTitle>
                  <AlertDescription className="font-medium text-red-700">
                    {advice.alertMsg}
                  </AlertDescription>
                </Alert>
              )}

              <Card className="border-primary/20 shadow-md">
                <CardHeader className="bg-primary/5 pb-4 border-b">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Sprout className="h-5 w-5" /> AI Agricultural Advice
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm font-medium leading-relaxed">
                    {advice.adviceMsg}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agricultural Conditions</CardTitle>
                  <CardDescription>Current suitability for farming operations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" /> Irrigation Need
                    </span>
                    <Badge variant="outline" className={`font-bold ${
                      advice.irrigation === 'GOOD' ? 'text-green-600 border-green-300' :
                      advice.irrigation === 'HOLD' ? 'text-amber-600 border-amber-300' : 'text-red-600 border-red-300'
                    }`}>
                      {advice.irrigation}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <Sun className="h-4 w-4 text-orange-500" /> Planting
                    </span>
                    <Badge variant="outline" className={`font-bold ${
                      advice.planting === 'FAVORABLE' ? 'text-green-600 border-green-300' :
                      advice.planting === 'DELAY' ? 'text-amber-600 border-amber-300' : 'text-red-600 border-red-300'
                    }`}>
                      {advice.planting}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-slate-500" /> Disease Risk
                    </span>
                    <Badge variant="outline" className={`font-bold ${
                      advice.diseaseRisk === 'LOW' ? 'text-green-600 border-green-300' :
                      advice.diseaseRisk === 'MODERATE' ? 'text-amber-600 border-amber-300' : 'text-red-600 border-red-300'
                    }`}>
                      {advice.diseaseRisk}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: 5-Day Forecast Chart */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>5-Day Forecast Trend</CardTitle>
                  <CardDescription>Temperature (°C) and Rainfall (mm) trajectory.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={forecastData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8e4" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                        <Bar 
                          yAxisId="right"
                          dataKey="rainfall" 
                          name="Rainfall (mm)" 
                          fill="#60a5fa" 
                          radius={[4, 4, 0, 0]} 
                          barSize={30}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="temperature" 
                          name="Temperature (°C)" 
                          stroke="#f97316" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }} 
                          activeDot={{ r: 6 }} 
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Ensure MapPin is imported correctly at the top. Let me add it to the import if missing.
// I will just add MapPin to the first import.
