import { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Cpu, 
  AlertTriangle, 
  Bug, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  FileWarning, 
  Microscope,
  HelpCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// --- API Contracts ---
interface DiseaseAnalysisResponse {
  success: boolean;
  status: "analyzed" | "invalid_image" | "uncertain_image" | "uncertain_disease" | "error";
  isPlant: boolean;
  plantConfidence: number;
  message?: string | null;
  disease?: string | null;
  diseaseConfidence?: number | null;
  severity?: number | null;
  riskLevel?: "Low" | "Moderate" | "High" | "Critical" | null;
  symptoms?: string[] | null;
  detectedEvidence?: string[] | null;
  riskFactors?: string[] | null;
  recommendedActions?: string[] | null;
  recommendation?: string | null;
  plantStage?: string | null;
}

interface ScanHistoryItem {
  id: string;
  timestamp: string;
  fileName: string;
  status: "analyzed" | "invalid_image" | "uncertain_image";
  isPlant: boolean;
  plantConfidence: number;
  diseaseName?: string;
  diseaseConfidence?: number;
  message?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [result, setResult] = useState<DiseaseAnalysisResponse | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load scan history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("agrovision_disease_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load scan history:", e);
    }
  }, []);

  const saveToHistory = (item: ScanHistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 10);
      try {
        localStorage.setItem("agrovision_disease_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save history:", e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("agrovision_disease_history");
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientError(null);
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setClientError(null);
    setResult(null);

    // Validate size (max 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setClientError("Image is too large. Maximum allowed size is 5 MB.");
      return;
    }

    // Validate format
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png)$/i)) {
      setClientError("Unsupported image format. Please upload JPG, JPEG, or PNG.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setClientError(null);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setClientError(null);
    setResult(null);

    try {
      // Step 1: Upload & Validate
      setLoadingStep("Validating image...");
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Plant vs Non-Plant Detection
      setLoadingStep("Checking whether this is a plant image...");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/disease-detection/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: DiseaseAnalysisResponse = await res.json();

      // Check Stage 1 plant validation result
      if (data.isPlant && data.status === "analyzed") {
        setLoadingStep("Plant detected. Analyzing for disease...");
        await new Promise((r) => setTimeout(r, 500));
      }

      setResult(data);

      // Save to Scan History
      const historyEntry: ScanHistoryItem = {
        id: `SCAN-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fileName: selectedFile.name,
        status: data.status === "analyzed" ? "analyzed" : (data.status === "uncertain_image" ? "uncertain_image" : "invalid_image"),
        isPlant: data.isPlant,
        plantConfidence: data.plantConfidence,
        diseaseName: data.isPlant && data.status === "analyzed" ? data.disease || "Healthy Plant" : undefined,
        diseaseConfidence: data.diseaseConfidence || undefined,
        message: data.message || undefined
      };
      saveToHistory(historyEntry);

    } catch (err: any) {
      console.error("Analysis pipeline failure:", err);
      setClientError("We couldn't complete the disease analysis. Please try again with another clear plant image.");
    } finally {
      setIsAnalyzing(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Disease Detection</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Two-Stage Intelligent Plant Pathology Engine: Automated visual plant validation and disease diagnosis.
        </p>
      </div>

      {clientError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Notice</AlertTitle>
          <AlertDescription>{clientError}</AlertDescription>
        </Alert>
      )}

      {/* VIEW STATE 1: UPLOAD & WORKSPACE (Shown when no result yet) */}
      {!result ? (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Analysis Workspace</CardTitle>
                <CardDescription>Upload a clear image of the plant leaf, stem, fruit, or crop.</CardDescription>
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
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border bg-muted/20 min-h-[300px] flex items-center justify-center">
                      <img src={previewUrl!} alt="Preview" className="max-h-[400px] max-w-full object-contain" />
                      {!isAnalyzing && (
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-80 hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); clearFile(); }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* File Meta Info */}
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg text-sm">
                      <div className="flex items-center gap-2 truncate">
                        <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium truncate">{selectedFile.name}</span>
                        <span className="text-muted-foreground text-xs">({formatFileSize(selectedFile.size)})</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Ready for Validation</Badge>
                    </div>

                    {/* Live Multi-Stage Progress State */}
                    {isAnalyzing && (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between text-sm font-semibold text-primary">
                          <span className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 animate-spin" />
                            {loadingStep || "Processing image..."}
                          </span>
                          <span className="text-xs text-muted-foreground">Stage 1 & 2 Pipeline</span>
                        </div>
                        <Progress value={loadingStep.includes("Plant detected") ? 85 : (loadingStep.includes("Checking") ? 50 : 25)} className="h-2" />
                      </div>
                    )}
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
                      <><Cpu className="mr-2 h-4 w-4 animate-pulse" /> Validating & Analyzing...</>
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
                    <span>1. Upload</span>
                  </div>
                  <ArrowRight className="hidden sm:block h-4 w-4 opacity-30" />
                  <div className={`flex flex-col items-center gap-2 ${isAnalyzing && loadingStep.includes("Checking") ? 'text-primary' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isAnalyzing ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span>2. Plant Validation</span>
                  </div>
                  <ArrowRight className="hidden sm:block h-4 w-4 opacity-30" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      <Bug className="h-5 w-5" />
                    </div>
                    <span>3. Disease Detection</span>
                  </div>
                  <ArrowRight className="hidden sm:block h-4 w-4 opacity-30" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span>4. Treatment Actions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Scan History */}
          <div className="lg:col-span-4">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Scan History
                  </CardTitle>
                  {history.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs text-muted-foreground h-7">
                      Clear
                    </Button>
                  )}
                </div>
                <CardDescription>Recent upload and validation attempts.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center border-2 border-dashed rounded-lg bg-muted/10">
                    <FileWarning className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No recent scans found.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div key={item.id} className="p-3 rounded-lg border bg-card text-xs space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate max-w-[140px]">{item.fileName}</span>
                          <span className="text-muted-foreground text-[11px]">{item.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          {item.status === "analyzed" ? (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px]">
                              Analyzed
                            </Badge>
                          ) : item.status === "uncertain_image" ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                              Uncertain Image
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-500/90 text-[10px]">
                              Rejected (Non-Plant)
                            </Badge>
                          )}
                          <span className="text-muted-foreground">
                            {item.status === "analyzed" 
                              ? `${Math.round(item.plantConfidence * 100)}% Plant` 
                              : "No Plant Detected"}
                          </span>
                        </div>
                        {item.diseaseName && (
                          <div className="text-muted-foreground truncate font-medium text-[11px] pt-0.5">
                            {item.diseaseName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : result.status === "invalid_image" ? (
        /* VIEW STATE 2: REJECTED NON-PLANT IMAGE (ZERO DISEASE INFORMATION DISPLAYED) */
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-2 border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-3">
                <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                ⚠️ Unrecognized Image
              </CardTitle>
              <CardDescription className="text-base text-amber-800/80 dark:text-amber-300/80 mt-1">
                We couldn&apos;t identify a plant in this image. Please upload a clear photo of a plant leaf, stem, fruit, flower, or crop.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-background border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Validation Gate:</span>
                  <Badge variant="destructive">Stage 1: Rejected</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Plant Content Confidence:</span>
                  <span className="font-bold text-red-600">{Math.round(result.plantConfidence * 100)}% (Threshold: 80%)</span>
                </div>
                {result.message && (
                  <div className="pt-2 border-t text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Reason: </span>
                    {result.message}
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="relative rounded-lg overflow-hidden border max-h-56 flex items-center justify-center bg-muted/10">
                  <img src={previewUrl} alt="Rejected sample" className="max-h-52 object-contain opacity-70" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" className="w-full bg-primary" onClick={clearFile}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Another Image
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : result.status === "uncertain_image" ? (
        /* VIEW STATE 3: UNCERTAIN PLANT IMAGE */
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-2 border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/10 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                Image Not Clear Enough
              </CardTitle>
              <CardDescription className="text-base text-blue-800/80 dark:text-blue-300/80 mt-1">
                Please upload a clearer photo where the plant or affected leaf is clearly visible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-background border space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Status:</span>
                  <Badge variant="outline" className="text-amber-600 border-amber-300">Uncertain Content</Badge>
                </div>
                {result.message && (
                  <p className="text-muted-foreground pt-1">{result.message}</p>
                )}
              </div>
              {previewUrl && (
                <div className="relative rounded-lg overflow-hidden border max-h-56 flex items-center justify-center bg-muted/10">
                  <img src={previewUrl} alt="Unclear sample" className="max-h-52 object-contain" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-primary" onClick={clearFile}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Another Image
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : result.status === "uncertain_disease" ? (
        /* VIEW STATE 4: VALID PLANT BUT UNCERTAIN DISEASE */
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-2 border-primary/40 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Microscope className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Plant Verified: Unable to Confirm Pathology</CardTitle>
              <CardDescription className="text-base mt-1">
                {result.message || "Please upload a clearer image of the affected plant leaf or stem."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plant Verification (Stage 1):</span>
                  <Badge className="bg-green-600">Confirmed ({Math.round(result.plantConfidence * 100)}%)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Disease Diagnostic Confidence:</span>
                  <span className="font-semibold text-amber-600">
                    {result.diseaseConfidence ? `${Math.round(result.diseaseConfidence * 100)}%` : "Low"} (Threshold: 60%)
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={clearFile}>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Another Image
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        /* VIEW STATE 5: VALID PLANT WITH FULL DISEASE PATHOLOGY REPORT */
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="font-bold text-amber-800 dark:text-amber-300">Important Disclaimer</AlertTitle>
            <AlertDescription className="font-medium">
              AI results are for informational agricultural guidance. Please consult with a certified agronomist before applying chemical treatments.
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left Column: Image and Key Metrics */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="overflow-hidden border-2 border-primary/20">
                <div className="h-64 bg-muted relative">
                  <img src={previewUrl!} alt="Analyzed leaf" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="default" className="bg-primary shadow-lg text-xs px-2.5 py-0.5">
                      Stage 1: Plant Verified
                    </Badge>
                    <Badge variant="secondary" className="shadow-lg text-xs">
                      {Math.round(result.plantConfidence * 100)}%
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Detected Condition</p>
                    <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                      result.disease?.includes("Healthy") ? "text-green-600" : "text-red-600"
                    }`}>
                      {result.disease?.includes("Healthy") ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Bug className="h-6 w-6" />
                      )}
                      {result.disease}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Diagnosis Confidence</p>
                      <p className="text-xl font-bold text-primary">
                        {result.diseaseConfidence ? `${Math.round(result.diseaseConfidence * 100)}%` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                      <Badge variant="outline" className={`font-bold ${
                        result.riskLevel === 'Low' ? 'text-green-600 border-green-300' :
                        result.riskLevel === 'Moderate' ? 'text-amber-600 border-amber-300' : 'text-red-600 border-red-300'
                      }`}>
                        <ShieldAlert className="h-3 w-3 mr-1" /> {result.riskLevel || "Low"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm text-muted-foreground">Infection Severity</p>
                      <span className="text-xl font-bold">{result.severity ?? 0}%</span>
                    </div>
                    <Progress value={result.severity ?? 0} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {(result.severity ?? 0) === 0 ? "No active foliar disease detected. Foliage is healthy." :
                       (result.severity ?? 0) < 30 ? "Early stages of infection detected." : 
                       (result.severity ?? 0) < 70 ? "Moderate infection spread." : "Severe infection. Immediate action required."}
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

            {/* Right Column: Detailed Breakdown */}
            <div className="lg:col-span-8">
              <Card className="h-full border-primary/10">
                <CardHeader className="bg-primary/5 pb-4 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" /> Pathology & Treatment Report
                  </CardTitle>
                  <CardDescription>Detailed agronomic breakdown of foliar condition.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-red-700">
                          <AlertTriangle className="h-4 w-4" /> Observed Symptoms
                        </h4>
                        <ul className="space-y-2">
                          {result.symptoms?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-amber-700">
                          <Activity className="h-4 w-4" /> Environmental Risk Factors
                        </h4>
                        <ul className="space-y-2">
                          {result.riskFactors?.map((item, idx) => (
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
                          <CheckCircle2 className="h-4 w-4" /> Diagnostic Evidence
                        </h4>
                        <ul className="space-y-2">
                          {result.detectedEvidence?.map((item, idx) => (
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
                          {result.recommendedActions?.map((item, idx) => (
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
