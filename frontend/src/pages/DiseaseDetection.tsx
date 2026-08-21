import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Cpu, AlertTriangle, Bug, ArrowRight, CheckCircle2, ShieldAlert, Activity, FileWarning, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// --- Mock API Interfaces & Functions ---
interface DiseasePredictionResult {
  diseaseName: string;
  confidence: number;
  severity: number;
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  symptoms: string[];
  detectedEvidence: string[];
  riskFactors: string[];
  recommendedActions: string[];
  imageUrl: string;
}

const simulateDiseasePredictionAPI = async (imageFile: File): Promise<DiseasePredictionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        diseaseName: "Early Blight (Alternaria solani)",
        confidence: 91,
        severity: 23,
        riskLevel: "Moderate",
        symptoms: [
          "Small, dark, necrotic lesions on older leaves",
          "Concentric rings within the spots (target board appearance)",
          "Yellowing (chlorosis) around the lesions"
        ],
        detectedEvidence: [
          "Multiple 2-3mm brown spots identified",
          "Concentric rings present in 4 locations",
          "Minimal chlorosis detected, indicating early stage"
        ],
        riskFactors: [
          "High humidity conditions expected this week",
          "Warm temperatures (24-29°C)",
          "Overcrowded planting"
        ],
        recommendedActions: [
          "Prune and destroy infected lower leaves immediately.",
          "Apply a copper-based fungicide or chlorothalonil to prevent spread.",
          "Improve air circulation by thinning plants.",
          "Ensure irrigation occurs at the base of the plant, avoiding leaf wetness."
        ],
        imageUrl: URL.createObjectURL(imageFile)
      });
    }, 2500);
  });
};


export function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseasePredictionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Reset result when new file is selected
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      const prediction = await simulateDiseasePredictionAPI(selectedFile);
      setResult(prediction);
    } catch (error) {
      console.error("Failed to analyze image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Disease Detection</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Analyze plant images for possible diseases and receive actionable treatment recommendations.
        </p>
      </div>

      {!result ? (
        // STATE 1: UPLOAD AREA
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Analysis Workspace</CardTitle>
                <CardDescription>Upload a clear image of the affected plant leaf or stem.</CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedFile ? (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px]"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">Upload Plant Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">Drag & drop an image here or browse files</p>
                    <p className="text-xs text-muted-foreground/70">Supported: JPG, JPEG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border bg-muted/20 min-h-[300px] flex items-center justify-center">
                    <img src={previewUrl!} alt="Preview" className="max-h-[400px] max-w-full object-contain" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-80 hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/jpeg, image/png, image/jpg" 
                  className="hidden" 
                />

                <div className="mt-6 flex justify-end">
                  <Button 
                    size="lg" 
                    onClick={analyzeImage} 
                    disabled={!selectedFile || isAnalyzing}
                    className="w-full sm:w-auto"
                  >
                    {isAnalyzing ? (
                      <><Cpu className="mr-2 h-4 w-4 animate-pulse" /> Detecting Pathology...</>
                    ) : (
                      <><Microscope className="mr-2 h-4 w-4" /> Analyze for Disease</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Visualizer */}
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium text-muted-foreground">
                  <div className={`flex flex-col items-center gap-2 ${selectedFile ? 'text-primary' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedFile ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <span>Upload</span>
                  </div>
                  <ArrowRight className="hidden sm:block h-4 w-4 opacity-30" />
                  <div className={`flex flex-col items-center gap-2 ${isAnalyzing ? 'text-primary' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isAnalyzing ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                      <Cpu className="h-5 w-5" />
                    </div>
                    <span>Analyze</span>
                  </div>
                  <ArrowRight className="hidden sm:block h-4 w-4 opacity-30" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      <Bug className="h-5 w-5" />
                    </div>
                    <span>Disease Detection</span>
                  </div>
                  <ArrowRight className="hidden sm:block h-4 w-4 opacity-30" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span>Severity Analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Scan History</CardTitle>
                <CardDescription>Recently analyzed images.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center border-2 border-dashed rounded-lg bg-muted/10">
                  <FileWarning className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No recent scans found.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // STATE 2: ANALYSIS RESULTS
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="font-bold text-amber-800 dark:text-amber-300">Important Disclaimer</AlertTitle>
            <AlertDescription className="font-medium">
              AI results are for informational purposes only. Please verify these findings with a certified agricultural expert before applying any chemical treatments or making significant crop management decisions.
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left Column: Image and Key Metrics */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="overflow-hidden border-2 border-primary/20">
                <div className="h-64 bg-muted relative">
                  <img src={result.imageUrl} alt="Analyzed leaf" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="bg-primary shadow-lg text-sm px-3 py-1">
                      Analysis Complete
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Detected Pathology</p>
                    <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                      <Bug className="h-6 w-6" /> {result.diseaseName}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                      <p className="text-xl font-bold text-primary">{result.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                      <Badge variant="outline" className={`font-bold ${
                        result.riskLevel === 'Low' ? 'text-green-600 border-green-300' :
                        result.riskLevel === 'Moderate' ? 'text-amber-600 border-amber-300' : 'text-red-600 border-red-300'
                      }`}>
                        <ShieldAlert className="h-3 w-3 mr-1" /> {result.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm text-muted-foreground">Infection Severity</p>
                      <span className="text-xl font-bold">{result.severity}%</span>
                    </div>
                    <Progress value={result.severity} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {result.severity < 30 ? "Early stages of infection detected." : 
                       result.severity < 70 ? "Moderate infection spread." : "Severe infection. Immediate action required."}
                    </p>
                  </div>

                </CardContent>
                <CardFooter className="bg-muted/30 p-4 border-t">
                  <Button variant="outline" className="w-full" onClick={clearFile}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Another Image
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column: Detailed Information */}
            <div className="lg:col-span-8">
              <Card className="h-full border-primary/10">
                <CardHeader className="bg-primary/5 pb-4 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" /> Pathology Report
                  </CardTitle>
                  <CardDescription>Detailed breakdown of the detected condition.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-red-700">
                          <AlertTriangle className="h-4 w-4" /> Symptoms
                        </h4>
                        <ul className="space-y-2">
                          {result.symptoms.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-amber-700">
                          <Activity className="h-4 w-4" /> Risk Factors
                        </h4>
                        <ul className="space-y-2">
                          {result.riskFactors.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 space-y-6 bg-muted/10">
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-blue-700">
                          <CheckCircle2 className="h-4 w-4" /> Detected Evidence
                        </h4>
                        <ul className="space-y-2">
                          {result.detectedEvidence.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-green-700">
                          <ShieldAlert className="h-4 w-4" /> Recommended Actions
                        </h4>
                        <ul className="space-y-3">
                          {result.recommendedActions.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-sm p-3 bg-green-50/50 border border-green-100 rounded-md">
                              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-green-200 text-green-800 text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-medium text-green-900">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
