import { useState } from "react";
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Trash2, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Sprout,
  LineChart,
  Droplets,
  Bug,
  BrainCircuit,
  TrendingUp,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Mock Data ---
type AnalysisCategory = "All" | "Plant" | "Yield" | "Price" | "Plantation" | "Disease" | "Irrigation" | "Recommendations";

interface HistoryRecord {
  id: string;
  date: string;
  category: AnalysisCategory;
  crop: string;
  resultSummary: string;
  confidence: number;
  status: "success" | "warning" | "error";
  details: any;
}

const mockHistoryData: HistoryRecord[] = [
  {
    id: "REC-001",
    date: "2023-10-25 14:30",
    category: "Plant",
    crop: "Blueberry",
    resultSummary: "342 Green Fruits, 12 Full Blooms",
    confidence: 94,
    status: "success",
    details: { notes: "Canopy is healthy. No signs of stress." }
  },
  {
    id: "REC-002",
    date: "2023-10-25 09:15",
    category: "Irrigation",
    crop: "Strawberry",
    resultSummary: "SKIP IRRIGATION (Rain Expected)",
    confidence: 88,
    status: "success",
    details: { moisture: "62%", rainProb: "85%" }
  },
  {
    id: "REC-003",
    date: "2023-10-24 16:45",
    category: "Disease",
    crop: "Tomato",
    resultSummary: "Early Blight Detected (Severity: High)",
    confidence: 91,
    status: "error",
    details: { recommendedAction: "Apply fungicide immediately." }
  },
  {
    id: "REC-004",
    date: "2023-10-24 11:20",
    category: "Yield",
    crop: "Blueberry",
    resultSummary: "Predicted: 8.4 kg/plant",
    confidence: 76,
    status: "warning",
    details: { factor: "Slight drop due to recent temperature spike." }
  },
  {
    id: "REC-005",
    date: "2023-10-23 08:00",
    category: "Recommendations",
    crop: "All",
    resultSummary: "Farm Score: 82/100",
    confidence: 100,
    status: "success",
    details: { directives: "Wait to sell, Monitor for disease." }
  },
  {
    id: "REC-006",
    date: "2023-10-22 10:10",
    category: "Price",
    crop: "Blueberry",
    resultSummary: "Predicted ₹455/kg (Rising)",
    confidence: 85,
    status: "success",
    details: { market: "Delhi Azadpur", trend: "Upward" }
  },
  {
    id: "REC-007",
    date: "2023-10-21 15:30",
    category: "Plantation",
    crop: "None",
    resultSummary: "Recommended: Blueberry (92% Match)",
    confidence: 92,
    status: "success",
    details: { soilMatch: "High", climateMatch: "Perfect" }
  }
];

export function AnalysisHistory() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  // Filter Data
  const filteredData = mockHistoryData.filter((record) => {
    const matchesTab = activeTab === "All" || record.category === activeTab;
    const matchesSearch = record.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.resultSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Plant": return <Sprout className="h-4 w-4 text-emerald-500" />;
      case "Yield": return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "Price": return <LineChart className="h-4 w-4 text-indigo-500" />;
      case "Plantation": return <MapPin className="h-4 w-4 text-amber-500" />;
      case "Disease": return <Bug className="h-4 w-4 text-red-500" />;
      case "Irrigation": return <Droplets className="h-4 w-4 text-cyan-500" />;
      case "Recommendations": return <BrainCircuit className="h-4 w-4 text-purple-500" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <History className="h-8 w-8" /> Analysis History
        </h1>
        <p className="text-muted-foreground mt-1">
          Review, filter, and manage all past AI scans and model predictions.
        </p>
      </div>

      {/* Tabs & Filters */}
      <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        <div className="flex flex-col xl:flex-row justify-between gap-4 mb-4">
          <TabsList className="bg-muted/50 h-auto flex-wrap justify-start p-1">
            <TabsTrigger value="All" className="py-2">All Records</TabsTrigger>
            <TabsTrigger value="Plant" className="py-2">Plant Analysis</TabsTrigger>
            <TabsTrigger value="Yield" className="py-2">Yield</TabsTrigger>
            <TabsTrigger value="Price" className="py-2">Price</TabsTrigger>
            <TabsTrigger value="Disease" className="py-2">Disease</TabsTrigger>
            <TabsTrigger value="Irrigation" className="py-2">Irrigation</TabsTrigger>
            <TabsTrigger value="Recommendations" className="py-2">Recommendations</TabsTrigger>
          </TabsList>

          <div className="flex gap-3">
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-9 bg-background" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as string)}>
              <SelectTrigger className="w-[140px] bg-background">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Action Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            {filteredData.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[160px]">Date</TableHead>
                    <TableHead>Category / Crop</TableHead>
                    <TableHead>Result Summary</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id} className="group hover:bg-muted/20">
                      <TableCell className="font-medium text-muted-foreground">{record.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(record.category)}
                          <span className="font-medium">{record.category}</span>
                          <span className="text-muted-foreground text-xs px-2 py-0.5 bg-muted rounded-full">{record.crop}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{record.resultSummary}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs font-bold w-8">{record.confidence}%</span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${record.confidence}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          record.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                          record.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }>
                          {record.status === 'success' ? 'Nominal' : record.status === 'warning' ? 'Warning' : 'Critical'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setSelectedRecord(record)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-bold">No records found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                  We couldn't find any analysis records matching your current filters. Try adjusting your search or clearing the filters.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => {setSearchQuery(""); setStatusFilter("all");}}>
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">Showing 1 to {filteredData.length} of {filteredData.length} records</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </Tabs>

      {/* Details Dialog Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRecord && getCategoryIcon(selectedRecord.category)}
              {selectedRecord?.category} Analysis Record
            </DialogTitle>
            <DialogDescription>
              Detailed view of the AI model output.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Date & Time</p>
                  <p className="font-semibold text-sm">{selectedRecord.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Target Crop</p>
                  <p className="font-semibold text-sm">{selectedRecord.crop}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Record ID</p>
                  <p className="font-mono text-sm">{selectedRecord.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Confidence</p>
                  <p className="font-semibold text-sm text-primary">{selectedRecord.confidence}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Result Summary</p>
                <div className={`p-3 rounded-md border ${
                  selectedRecord.status === 'success' ? 'border-green-200 bg-green-50 text-green-800' :
                  selectedRecord.status === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' :
                  'border-red-200 bg-red-50 text-red-800'
                }`}>
                  <p className="font-bold">{selectedRecord.resultSummary}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Raw JSON Output / Details</p>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-md text-xs overflow-x-auto font-mono">
                  {JSON.stringify(selectedRecord.details, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}
