import { useState, useEffect } from "react";
import { BrainCircuit, LineChart, Droplets, Sprout, Bug, CheckCircle2, Activity, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

// --- Mock API Interfaces & Functions ---
interface Recommendation {
  id: string;
  category: string;
  icon: any; // Storing icon component reference for easy mapping
  decision: string;
  confidence: number;
  reason: string;
  supportingData: string;
  explanationLogic: string[];
  status: "positive" | "warning" | "neutral";
}

interface TimelineEvent {
  timeframe: string;
  action: string;
  type: "todo" | "monitor" | "wait";
}

interface UnifiedRecommendations {
  farmScore: number;
  scoreBreakdown: {
    weather: number;
    yield: number;
    disease: number;
  };
  recommendations: Recommendation[];
  timeline: TimelineEvent[];
}

const simulateAggregatedRecommendationsAPI = async (): Promise<UnifiedRecommendations> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        farmScore: 82,
        scoreBreakdown: {
          weather: 8,
          yield: 12,
          disease: -5
        },
        recommendations: [
          {
            id: "market",
            category: "Market Strategy",
            icon: LineChart,
            decision: "WAIT TO SELL",
            confidence: 87,
            reason: "Market price is predicted to increase by 8.3% over the next 7 days.",
            supportingData: "Current: ₹420/kg | Predicted: ₹455/kg",
            explanationLogic: [
              "Time series model detected a strong upward price trend matching historical pre-festival data.",
              "Supply in the local market (Delhi) is currently high but expected to drop next week.",
              "Selling now would result in an estimated 8% loss in potential revenue."
            ],
            status: "neutral"
          },
          {
            id: "water",
            category: "Water Management",
            icon: Droplets,
            decision: "SKIP IRRIGATION",
            confidence: 94,
            reason: "High probability of significant rainfall today and optimal soil moisture.",
            supportingData: "Soil Moisture: 68% | Rain Prob: 85%",
            explanationLogic: [
              "OpenWeatherMap API forecasts 15mm of rain in the next 12 hours.",
              "Current soil moisture sensor reading is 68% (optimal range is 50-70%).",
              "Irrigating now would risk waterlogging and root rot."
            ],
            status: "positive"
          },
          {
            id: "planting",
            category: "Planting Strategy",
            icon: Sprout,
            decision: "WAIT TO PLANT",
            confidence: 82,
            reason: "Heavy rainfall expected to wash away seeds or damage young seedlings.",
            supportingData: "7-Day Rain Volume: High",
            explanationLogic: [
              "Plantation suitability for Blueberry is currently high (92%).",
              "However, the immediate weather forecast indicates extreme downpours.",
              "Delaying planting by 3 days increases seedling survival rate by 40%."
            ],
            status: "warning"
          },
          {
            id: "health",
            category: "Crop Health",
            icon: Bug,
            decision: "MONITOR DISEASE",
            confidence: 76,
            reason: "High humidity and upcoming rain create favorable conditions for fungal growth.",
            supportingData: "Disease Risk: Moderate",
            explanationLogic: [
              "YOLO model detected minor leaf spotting on 4% of scanned canopy yesterday.",
              "Humidity is sustained above 85% with warm temperatures.",
              "Conditions perfectly match the Early Blight propagation model."
            ],
            status: "warning"
          },
          {
            id: "yield",
            category: "Harvest Prediction",
            icon: Activity,
            decision: "EXPECTED YIELD: 8.7 kg/plant",
            confidence: 89,
            reason: "Strong full-bloom counts and favorable temperatures during the pollination window.",
            supportingData: "Green Fruit Count: High",
            explanationLogic: [
              "Plant Analysis detected a 30% increase in Green Fruits compared to last week.",
              "Flower-to-fruit conversion rate was optimal (82%).",
              "No extreme heat events occurred during critical growth stages."
            ],
            status: "positive"
          }
        ],
        timeline: [
          { timeframe: "Today", action: "Skip irrigation due to rain forecast.", type: "todo" },
          { timeframe: "Tomorrow", action: "Monitor lower leaves for early blight progression.", type: "monitor" },
          { timeframe: "Next 3 Days", action: "Prepare fields for delayed planting.", type: "todo" },
          { timeframe: "Next 7 Days", action: "Hold harvest inventory; wait for target price of ₹450/kg.", type: "wait" }
        ]
      });
    }, 1500);
  });
};


export function AIRecommendationEngine() {
  const [data, setData] = useState<UnifiedRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await simulateAggregatedRecommendationsAPI();
      setData(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
        <h2 className="text-xl font-semibold text-muted-foreground animate-pulse">Aggregating AI Models...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER & SCORE CARD */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <BrainCircuit className="h-8 w-8" /> AI Recommendation Engine
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Unified intelligence from Plant Analysis, Weather, Market, and Soil models to provide you with actionable, data-driven farming directives.
          </p>
        </div>

        <Card className="w-full md:w-72 shrink-0 border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-2">Overall AI Farm Score</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-black text-primary">{data.farmScore}</span>
              <span className="text-2xl text-muted-foreground font-medium">/ 100</span>
            </div>
            <Progress value={data.farmScore} className="h-2 mt-4 bg-primary/20" />
            <div className="mt-4 flex justify-between text-xs font-medium text-muted-foreground px-2">
              <span className="text-green-600">+ Yield (+12)</span>
              <span className="text-green-600">+ Weather (+8)</span>
              <span className="text-amber-600">- Disease (-5)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Recommendation Cards */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" /> Actionable Directives
          </h3>
          
          <div className="space-y-4">
            {data.recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card key={rec.id} className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{
                  borderLeftColor: rec.status === 'positive' ? '#22c55e' : rec.status === 'warning' ? '#f59e0b' : '#3b82f6'
                }}>
                  <CardHeader className="pb-3 flex flex-row items-start justify-between bg-muted/20">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">{rec.category}</span>
                      </div>
                      <CardTitle className={`text-2xl font-black ${
                        rec.status === 'positive' ? 'text-green-700' : rec.status === 'warning' ? 'text-amber-700' : 'text-blue-700'
                      }`}>
                        {rec.decision}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-background text-sm py-1 px-2 border-primary/20 shadow-sm">
                      Confidence: <span className="font-bold ml-1 text-primary">{rec.confidence}%</span>
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-base font-medium leading-relaxed">{rec.reason}</p>
                      <Badge variant="secondary" className="shrink-0 whitespace-nowrap">{rec.supportingData}</Badge>
                    </div>

                    {/* XAI Accordion */}
                    {/* @ts-ignore */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="explain" className="border-none">
                        <AccordionTrigger className="text-sm text-primary hover:no-underline py-2 bg-primary/5 px-3 rounded-md">
                          <span className="flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4" /> Why did AI make this recommendation?
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 px-2 space-y-3">
                          {rec.explanationLogic.map((logic, idx) => (
                            <div key={idx} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-foreground text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <p className="leading-snug">{logic}</p>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Action Timeline */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-6">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5" /> Action Timeline
              </CardTitle>
              <CardDescription>Your prioritized operational schedule based on AI directives.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {data.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-muted last:before:hidden">
                    <div className={`absolute left-[-4px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background ${
                      event.type === 'todo' ? 'bg-green-500' : event.type === 'monitor' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <p className="text-sm font-bold mb-1">{event.timeframe}</p>
                    <p className="text-sm text-muted-foreground">{event.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-4 text-xs text-muted-foreground text-center flex justify-center">
              Timeline auto-updates as new scans and API data are received.
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
