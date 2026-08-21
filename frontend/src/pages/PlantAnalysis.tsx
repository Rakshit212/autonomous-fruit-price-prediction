import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { UploadCloud, Image as ImageIcon, X, Loader2, Save, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

// Mock API Response Type
interface DetectionResult {
  total_objects: number;
  counts: {
    bud: number;
    extended_bud: number;
    full_bloom: number;
    green_fruit: number;
    petal_fall: number;
  };
  percentages: {
    bud: number;
    extended_bud: number;
    full_bloom: number;
    green_fruit: number;
    petal_fall: number;
  };
  growth_score: number;
  fruit_formation_rate: number;
  confidence: number;
  annotated_image: string;
}

// Simulated API Call
const simulateDetectionAPI = async (imageFile: File): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total_objects: 87,
        counts: { bud: 12, extended_bud: 18, full_bloom: 32, green_fruit: 17, petal_fall: 8 },
        percentages: { bud: 13.8, extended_bud: 20.7, full_bloom: 36.8, green_fruit: 19.5, petal_fall: 9.2 },
        growth_score: 78,
        fruit_formation_rate: 19.5,
        confidence: 0.92,
        annotated_image: URL.createObjectURL(imageFile) // Using original image as placeholder for annotated image
      });
    }, 2500); // 2.5s simulated processing time
  });
};

export function PlantAnalysis() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 15));
    }, 300);

    try {
      const data = await simulateDetectionAPI(selectedImage);
      clearInterval(interval);
      setProgress(100);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setTimeout(() => setIsAnalyzing(false), 400); // Give progress bar time to show 100%
    }
  };

  const chartData = result ? [
    { name: "Bud", value: result.percentages.bud, count: result.counts.bud, color: "#9ca3af" },
    { name: "Ext. Bud", value: result.percentages.extended_bud, count: result.counts.extended_bud, color: "#607967" },
    { name: "Full Bloom", value: result.percentages.full_bloom, count: result.counts.full_bloom, color: "#1e5631" },
    { name: "Green Fruit", value: result.percentages.green_fruit, count: result.counts.green_fruit, color: "#22c55e" },
    { name: "Petal Fall", value: result.percentages.petal_fall, count: result.counts.petal_fall, color: "#fbbf24" },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Plant Analysis</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Upload plant imagery to detect growth stages and forecast fruit formation using the YOLO model.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT PANEL: UPLOAD */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>Select or drag a high-resolution image of your plants.</CardDescription>
            </CardHeader>
            <CardContent>
              {!previewUrl ? (
                <div 
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-1">Upload Plant Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag & drop an image here or browse files</p>
                  <p className="text-xs text-muted-foreground">Supported: JPG, JPEG, PNG (Max 10MB)</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border bg-muted aspect-video flex items-center justify-center group">
                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    {!isAnalyzing && !result && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); removeImage(); }}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-background rounded-md shrink-0">
                        <ImageIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{selectedImage?.name}</p>
                        <p className="text-xs text-muted-foreground">{(selectedImage?.size ? selectedImage.size / 1024 / 1024 : 0).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {!isAnalyzing && !result && (
                      <Button variant="ghost" size="sm" onClick={removeImage}>Remove</Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                disabled={!selectedImage || isAnalyzing || !!result}
                onClick={analyzeImage}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : result ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Analysis Complete
                  </>
                ) : (
                  "Analyze Plant"
                )}
              </Button>
            </CardFooter>
          </Card>

          {isAnalyzing && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full animate-pulse">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">AI Analysis in Progress</h3>
                  <p className="text-sm text-muted-foreground mt-1">Detecting plant growth stages using YOLOv8...</p>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="space-y-6">
          {!result && !isAnalyzing && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/30">
              <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-center">Upload and analyze an image to view the AI detection results.</p>
            </div>
          )}
          
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Detection Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="col-span-2 sm:col-span-3 bg-primary text-primary-foreground">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-80">Total Objects Detected</p>
                      <p className="text-3xl font-bold">{result.total_objects}</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                      {(result.confidence * 100).toFixed(1)}% Confidence
                    </Badge>
                  </CardContent>
                </Card>
                
                {chartData.map((stage) => (
                  <Card key={stage.name} className="overflow-hidden">
                    <div className="h-1 w-full" style={{ backgroundColor: stage.color }}></div>
                    <CardContent className="p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">{stage.name}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{stage.count}</span>
                        <span className="text-sm text-muted-foreground mb-1">({stage.value}%)</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chart & Health */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Growth Stage Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8e4" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                          <Tooltip 
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8e4' }}
                          />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Fruit Formation Rate</p>
                    <p className="text-4xl font-bold text-primary">{result.fruit_formation_rate}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Growth Health</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold">{result.growth_score}</span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">GOOD</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* AI Interpretation */}
              <Alert className="bg-primary/5 border-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">AI Interpretation</AlertTitle>
                <AlertDescription className="text-muted-foreground text-sm mt-1">
                  Strong flowering activity detected with healthy fruit formation. The high concentration of "Full Bloom" ({result.counts.full_bloom}) indicates an upcoming peak in fruit development.
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link to="/plant-analysis/analytics" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <TrendingUp className="mr-2 h-4 w-4" /> View Detailed Analytics
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1" onClick={removeImage}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Analyze Another
                </Button>
                <Button variant="outline" className="flex-1">
                  <Save className="mr-2 h-4 w-4" /> Save Result
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
