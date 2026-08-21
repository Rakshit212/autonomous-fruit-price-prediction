import { useState } from "react";
import { Leaf, MapPin, Droplets, Sprout, ShieldAlert, CheckCircle2, Activity, CloudRain, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

// --- Mock API Interfaces & Functions ---
interface CropRecommendation {
  id: string;
  name: string;
  suitabilityScore: number;
  climateMatch: number;
  soilMatch: number;
  waterRequirement: "Low" | "Medium" | "High";
  riskLevel: "Low" | "Medium" | "High";
  reasons: string[];
  radarData: { subject: string; A: number; fullMark: number }[];
}

const simulatePlantationRecommendationAPI = async (): Promise<{ topCrops: CropRecommendation[], alternativeCrops: string[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        topCrops: [
          {
            id: "crop-1",
            name: "Blueberry",
            suitabilityScore: 92,
            climateMatch: 95,
            soilMatch: 90,
            waterRequirement: "Medium",
            riskLevel: "Low",
            reasons: [
              "Suitable acidic soil pH (4.5 - 5.5) detected.",
              "Optimal temperature range matching.",
              "Adequate rainfall for early growth stages.",
              "Good humidity levels.",
              "Perfect match for the upcoming season."
            ],
            radarData: [
              { subject: 'Soil', A: 90, fullMark: 100 },
              { subject: 'Temperature', A: 95, fullMark: 100 },
              { subject: 'Rainfall', A: 85, fullMark: 100 },
              { subject: 'Humidity', A: 88, fullMark: 100 },
              { subject: 'Season', A: 100, fullMark: 100 },
            ]
          },
          {
            id: "crop-2",
            name: "Strawberry",
            suitabilityScore: 86,
            climateMatch: 82,
            soilMatch: 88,
            waterRequirement: "Medium",
            riskLevel: "Medium",
            reasons: [
              "Good soil moisture retention.",
              "Temperature slightly higher than optimal, but manageable.",
              "Excellent soil NPK balance.",
              "Appropriate season for planting."
            ],
            radarData: [
              { subject: 'Soil', A: 88, fullMark: 100 },
              { subject: 'Temperature', A: 75, fullMark: 100 },
              { subject: 'Rainfall', A: 80, fullMark: 100 },
              { subject: 'Humidity', A: 90, fullMark: 100 },
              { subject: 'Season', A: 95, fullMark: 100 },
            ]
          },
          {
            id: "crop-3",
            name: "Raspberry",
            suitabilityScore: 74,
            climateMatch: 70,
            soilMatch: 80,
            waterRequirement: "High",
            riskLevel: "High",
            reasons: [
              "Acceptable soil drainage.",
              "Rainfall is lower than ideal, requiring irrigation.",
              "Temperature is suitable.",
              "Pest risk is slightly elevated based on humidity."
            ],
            radarData: [
              { subject: 'Soil', A: 80, fullMark: 100 },
              { subject: 'Temperature', A: 85, fullMark: 100 },
              { subject: 'Rainfall', A: 60, fullMark: 100 },
              { subject: 'Humidity', A: 65, fullMark: 100 },
              { subject: 'Season', A: 80, fullMark: 100 },
            ]
          }
        ],
        alternativeCrops: ["Blackberry", "Cranberry", "Grapes"]
      });
    }, 1500);
  });
};

export function PlantationRecommendation() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ topCrops: CropRecommendation[], alternativeCrops: string[] } | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const data = await simulatePlantationRecommendationAPI();
      setResults(data);
      if (data.topCrops.length > 0) {
        setSelectedCrop(data.topCrops[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Farm Suitability Assessment</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Recommend the most suitable crops based on soil, weather, climate, and location.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Farm Parameters</CardTitle>
              <CardDescription>Enter details to analyze suitability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center text-sm font-semibold text-primary">
                  <MapPin className="w-4 h-4 mr-2" /> Location
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input placeholder="e.g. 28.7041" defaultValue="28.7041" />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input placeholder="e.g. 77.1025" defaultValue="77.1025" />
                  </div>
                </div>
              </div>

              {/* Soil Section */}
              <div className="space-y-4">
                <div className="flex items-center text-sm font-semibold text-amber-600">
                  <Sprout className="w-4 h-4 mr-2" /> Soil Chemistry
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nitrogen (N)</Label>
                    <Input placeholder="mg/kg" defaultValue="45" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phosphorus (P)</Label>
                    <Input placeholder="mg/kg" defaultValue="22" />
                  </div>
                  <div className="space-y-2">
                    <Label>Potassium (K)</Label>
                    <Input placeholder="mg/kg" defaultValue="30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>pH Level</Label>
                    <Input placeholder="e.g. 6.5" defaultValue="5.2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Moisture (%)</Label>
                    <Input placeholder="e.g. 40" defaultValue="42" />
                  </div>
                </div>
              </div>

              {/* Environment Section */}
              <div className="space-y-4">
                <div className="flex items-center text-sm font-semibold text-blue-600">
                  <CloudRain className="w-4 h-4 mr-2" /> Environment
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Temperature (°C)</Label>
                    <Input placeholder="Avg °C" defaultValue="22" />
                  </div>
                  <div className="space-y-2">
                    <Label>Humidity (%)</Label>
                    <Input placeholder="Avg %" defaultValue="65" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Rainfall (mm)</Label>
                    <Input placeholder="Annual mm" defaultValue="850" />
                  </div>
                </div>
              </div>

              {/* Season Section */}
              <div className="space-y-4">
                <div className="flex items-center text-sm font-semibold text-orange-500">
                  <Sun className="w-4 h-4 mr-2" /> Season
                </div>
                <div className="space-y-2">
                  <Select defaultValue="kharif">
                    <SelectTrigger><SelectValue placeholder="Select Season" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                      <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                      <SelectItem value="yearround">Year-round</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Activity className="mr-2 h-4 w-4 animate-pulse" /> Analyzing Farm...</>
                ) : (
                  <><Activity className="mr-2 h-4 w-4" /> Analyze Farm</>
                )}
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Results & Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          {results ? (
            <>
              {/* TOP RECOMMENDED CROPS */}
              <div>
                <h2 className="text-xl font-bold mb-4">Top Recommended Crops</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {results.topCrops.map((crop, index) => (
                    <Card 
                      key={crop.id} 
                      className={`cursor-pointer transition-all hover:border-primary/50 ${selectedCrop?.id === crop.id ? 'border-primary ring-1 ring-primary shadow-sm bg-primary/5' : ''}`}
                      onClick={() => setSelectedCrop(crop)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={index === 0 ? "default" : "secondary"} className={index === 0 ? "bg-green-600" : ""}>
                            #{index + 1}
                          </Badge>
                          <span className="text-2xl font-bold text-primary">{crop.suitabilityScore}%</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{crop.name}</h3>
                        <div className="space-y-1 text-xs text-muted-foreground mt-3">
                          <div className="flex justify-between">
                            <span>Climate Match</span>
                            <span className="font-medium text-foreground">{crop.climateMatch}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Soil Match</span>
                            <span className="font-medium text-foreground">{crop.soilMatch}%</span>
                          </div>
                        </div>
                        <Progress value={crop.suitabilityScore} className="h-1 mt-3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* DETAILED EXPLANATION */}
              {selectedCrop && (
                <Card className="border-2 border-primary/20">
                  <CardHeader className="bg-primary/5 pb-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Leaf className="h-6 w-6 text-primary" /> {selectedCrop.name.toUpperCase()}
                        </CardTitle>
                        <CardDescription className="mt-1">Detailed suitability analysis</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Overall Suitability</p>
                        <p className="text-3xl font-bold text-primary">{selectedCrop.suitabilityScore}%</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                      
                      {/* WHY RECOMMENDED */}
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-4">
                            <CheckCircle2 className="h-5 w-5 text-green-600" /> Why recommended:
                          </h4>
                          <ul className="space-y-3">
                            {selectedCrop.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Water Requirement</p>
                            <Badge variant="outline" className="flex items-center gap-1 w-max">
                              <Droplets className="h-3 w-3 text-blue-500" /> {selectedCrop.waterRequirement}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                            <Badge variant="outline" className={`flex items-center gap-1 w-max ${
                              selectedCrop.riskLevel === 'Low' ? 'text-green-600' : 
                              selectedCrop.riskLevel === 'Medium' ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              <ShieldAlert className="h-3 w-3" /> {selectedCrop.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* RADAR CHART */}
                      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <h4 className="font-bold text-sm text-center mb-2">Suitability Dimensions</h4>
                        <div className="w-full h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selectedCrop.radarData}>
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar
                                name={selectedCrop.name}
                                dataKey="A"
                                stroke="#16a34a"
                                fill="#16a34a"
                                fillOpacity={0.4}
                              />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ALTERNATIVE CROPS */}
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Sprout className="h-4 w-4" /> Alternative Crops:
                  </div>
                  <div className="flex gap-2">
                    {results.alternativeCrops.map(alt => (
                      <Badge key={alt} variant="secondary" className="font-normal">{alt}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10 p-8 text-center">
              <Sprout className="h-16 w-16 mb-4 text-muted" />
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to Analyze</h3>
              <p className="max-w-md">Enter your farm's location, soil chemistry, and environmental parameters on the left to receive AI-powered crop recommendations.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
