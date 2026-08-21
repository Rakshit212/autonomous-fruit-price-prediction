import { Leaf, Sprout, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  Pie, 
  PieChart, 
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from "recharts";

// Mock Data
const distributionData = [
  { name: "Bud", value: 12, color: "#9ca3af" },
  { name: "Ext. Bud", value: 18, color: "#607967" },
  { name: "Full Bloom", value: 32, color: "#1e5631" },
  { name: "Green Fruit", value: 21, color: "#22c55e" },
  { name: "Petal Fall", value: 8, color: "#fbbf24" },
];

const historicalData = [
  { date: "Aug 01", bud: 45, bloom: 10, fruit: 0 },
  { date: "Aug 05", bud: 35, bloom: 25, fruit: 2 },
  { date: "Aug 10", bud: 20, bloom: 40, fruit: 5 },
  { date: "Aug 15", bud: 15, bloom: 35, fruit: 12 },
  { date: "Aug 20", bud: 12, bloom: 32, fruit: 21 },
];

const tableData = [
  { stage: "Bud", count: 12, percentage: "13.2%", confidence: "94.2%" },
  { stage: "Extended Bud", count: 18, percentage: "19.8%", confidence: "92.1%" },
  { stage: "Full Bloom", count: 32, percentage: "35.2%", confidence: "95.5%" },
  { stage: "Green Fruit", count: 21, percentage: "23.1%", confidence: "89.8%" },
  { stage: "Petal Fall", count: 8, percentage: "8.8%", confidence: "87.3%" },
];

export function PlantAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Plant Growth Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Deep dive into AI detection results and historical trends.
          </p>
        </div>
        <Link to="/plant-analysis">
          <Button variant="outline">
            Back to Upload
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detected</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91</div>
            <p className="text-xs text-muted-foreground mt-1">Across all stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Green Fruits</CardTitle>
            <Sprout className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">21</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +31.2% from last scan
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Blooms</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <div className="flex items-center text-xs text-destructive mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -8.5% from last scan
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84/100</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent trajectory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stage Distribution</CardTitle>
                <CardDescription>Current plant phase breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Growth</CardTitle>
                <CardDescription>Trends over the last 20 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8e4" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8e4' }} />
                    <Line type="monotone" dataKey="bud" stroke="#9ca3af" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="bloom" stroke="#1e5631" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="fruit" stroke="#22c55e" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detection Details</CardTitle>
              <CardDescription>High-precision YOLOv8 model outputs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Growth Stage</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="text-right">Avg Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.stage}>
                      <TableCell className="font-medium">{row.stage}</TableCell>
                      <TableCell className="text-right">{row.count}</TableCell>
                      <TableCell className="text-right">{row.percentage}</TableCell>
                      <TableCell className="text-right text-primary">{row.confidence}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plant Health Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className="bg-green-500 hover:bg-green-600">Excellent</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flower-to-Fruit Conversion</span>
                  <span className="font-semibold">65.6%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65.6%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fruit Formation Rate</span>
                  <span className="font-semibold">23.1%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[23.1%] rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-primary/5 border-primary/20">
            <Sprout className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">AI Insights</AlertTitle>
            <AlertDescription className="text-muted-foreground text-sm mt-2 space-y-2">
              <p>Fruit formation is increasing rapidly (+31.2%) compared with the previous scan, indicating a highly successful pollination period.</p>
              <p>The high conversion rate from Full Bloom to Green Fruit suggests optimal weather and soil conditions.</p>
              <p className="font-semibold text-primary">Recommendation: Maintain current irrigation schedule. Prepare for early harvest.</p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Comparison vs Previous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Green Fruit</span>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-bold">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +31.2%
                  </div>
                  <span className="text-xs text-muted-foreground">16 → 21</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Full Bloom</span>
                <div className="text-right">
                  <div className="flex items-center text-destructive text-sm font-bold">
                    <ArrowDownRight className="h-3 w-3 mr-1" /> -8.5%
                  </div>
                  <span className="text-xs text-muted-foreground">35 → 32</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Buds</span>
                <div className="text-right">
                  <div className="flex items-center text-destructive text-sm font-bold">
                    <ArrowDownRight className="h-3 w-3 mr-1" /> -20.0%
                  </div>
                  <span className="text-xs text-muted-foreground">15 → 12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
