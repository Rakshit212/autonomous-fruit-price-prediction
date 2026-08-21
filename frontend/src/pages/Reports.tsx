import { useState } from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  RefreshCcw,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Sprout,
  Activity,
  MapPin,
  TrendingUp,
  CloudSun,
  BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function Reports() {
  const [reportType, setReportType] = useState("intelligence");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("PDF generation would occur here on the backend. Please use the Print button to 'Save as PDF' natively.");
  };

  // Mock data for the report preview
  const currentDate = new Date().toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-10">
      
      {/* Non-printable Header & Controls */}
      <div className="print:hidden space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <FileText className="h-8 w-8" /> Reports Generation
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate, preview, and export professional AI analysis reports.
          </p>
        </div>

        <Card className="border-primary/20 bg-muted/20">
          <CardContent className="p-4 flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-2 w-full md:w-1/3">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={(v) => setReportType(v as string)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intelligence">Farm Intelligence (Comprehensive)</SelectItem>
                  <SelectItem value="plant">Plant Analysis Report</SelectItem>
                  <SelectItem value="yield">Yield Prediction Report</SelectItem>
                  <SelectItem value="market">Market Forecast Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 w-full md:w-1/4">
              <label className="text-sm font-medium">Date Range</label>
              <Select defaultValue="last7">
                <SelectTrigger className="bg-background">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex justify-end gap-2">
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full md:w-auto">
                {isGenerating ? <RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                {isGenerating ? "Compiling..." : "Generate Preview"}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="hidden sm:flex">
                <Download className="h-4 w-4" />
              </Button>
              <Button onClick={handlePrint} variant="outline" className="hidden sm:flex">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable Report Preview Container */}
      <div className="flex justify-center print:block print:w-full print:m-0">
        <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-sm sm:p-12 p-6 print:shadow-none print:rounded-none print:p-0 relative overflow-hidden transition-all duration-300">
          
          {isGenerating ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <RefreshCcw className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium text-slate-600">Compiling Report Data...</p>
            </div>
          ) : null}

          {/* Report Header */}
          <div className="border-b-4 border-primary pb-6 mb-8 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sprout className="h-8 w-8" />
                <span className="text-2xl font-black tracking-tight">AGROVISION AI</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">
                {reportType === 'intelligence' ? 'Farm Intelligence Report' : 
                 reportType === 'plant' ? 'Plant Analysis Report' : 'Analytics Report'}
              </h2>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p className="font-semibold text-slate-700">Date Generated</p>
              <p>{currentDate}</p>
              <p className="font-semibold text-slate-700 mt-2">Report ID</p>
              <p>RPT-{Math.floor(Math.random() * 1000000)}</p>
            </div>
          </div>

          {/* Section A: Farm Info */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> 1. Farm Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-md">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Farm Name</p>
                <p className="text-sm font-medium">Green Valley Estate</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Location</p>
                <p className="text-sm font-medium">Pune, MH</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Primary Crop</p>
                <p className="text-sm font-medium">Blueberry</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Area</p>
                <p className="text-sm font-medium">12.5 Acres</p>
              </div>
            </div>
          </div>

          {/* Section B & C: Plant Analysis & Yield */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> 2. Plant Health
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md">
                  <span className="text-sm font-medium text-slate-600">Average Health Score</span>
                  <span className="text-lg font-bold text-emerald-600">78 / 100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md">
                  <span className="text-sm font-medium text-slate-600">Detected Diseases</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">1 (Early Blight - Mild)</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md">
                  <span className="text-sm font-medium text-slate-600">Total Fruit Count</span>
                  <span className="text-lg font-bold text-slate-800">1,245 units</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> 3. Yield & Growth
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-800 text-white rounded-md">
                  <span className="text-sm font-medium text-slate-300">Predicted Total Yield</span>
                  <span className="text-xl font-bold">8.7 kg / plant</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-md text-sm">
                  <p className="font-bold text-slate-700 mb-2">Growth Stage Distribution:</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="flex-1">Green Fruit</span> <span className="font-mono">45%</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-400"></div><span className="flex-1">Full Bloom</span> <span className="font-mono">30%</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div><span className="flex-1">Bud</span> <span className="font-mono">15%</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="flex-1">Ripe</span> <span className="font-mono">10%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Environmental */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-primary" /> 4. Environmental Context
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-sky-50 border border-sky-100 rounded-md flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-sky-700 uppercase">Current Weather</p>
                  <p className="text-2xl font-black text-sky-900 mt-1">31°C</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-sky-700 uppercase">Humidity</p>
                  <p className="text-lg font-bold text-sky-900">68%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-sky-700 uppercase">Rain Prob.</p>
                  <p className="text-lg font-bold text-sky-900">72%</p>
                </div>
              </div>
              <div className="flex-1 p-4 bg-emerald-50 border border-emerald-100 rounded-md flex flex-col justify-center items-center text-center">
                 <p className="text-xs font-bold text-emerald-700 uppercase">Farm Suitability Match</p>
                 <p className="text-2xl font-black text-emerald-900 mt-1">92%</p>
              </div>
            </div>
          </div>

          {/* Section E: AI Recommendations */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" /> 5. AI Directives
            </h3>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-bold text-sm uppercase">Market Strategy</span>
                </div>
                <p className="text-blue-900 font-bold text-lg">WAIT TO SELL</p>
                <p className="text-sm text-blue-700 mt-1">Market price is predicted to increase by 8.3% over the next 7 days (Target: ₹455/kg).</p>
              </div>
              
              <div className="p-3 border-l-4 border-amber-500 bg-amber-50 rounded-r-md">
                <div className="flex items-center gap-2 text-amber-800 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-bold text-sm uppercase">Water Management</span>
                </div>
                <p className="text-amber-900 font-bold text-lg">SKIP IRRIGATION</p>
                <p className="text-sm text-amber-700 mt-1">72% chance of rain today. Soil moisture is already at optimal levels (62%).</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>Generated by AgroVision AI Platform • Confidential & Proprietary</p>
            <p>Page 1 of 1</p>
          </div>

        </div>
      </div>

    </div>
  );
}
