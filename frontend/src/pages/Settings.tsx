import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  MapPin, 
  Bell, 
  Monitor, 
  ShieldCheck, 
  Key,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="farmer@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
            </CardFooter>
          </Card>
        );
      
      case "farm":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Farm Information</CardTitle>
              <CardDescription>Manage details about your agricultural property.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name</Label>
                <Input id="farmName" defaultValue="Green Valley Estate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="Pune, Maharashtra" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Total Area (Acres)</Label>
                  <Input id="area" type="number" defaultValue="12.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crop">Primary Crop</Label>
                  <Select defaultValue="blueberry">
                    <SelectTrigger id="crop">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="tomato">Tomato</SelectItem>
                      <SelectItem value="strawberry">Strawberry</SelectItem>
                      <SelectItem value="potato">Potato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
            </CardFooter>
          </Card>
        );

      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what alerts you want to receive from AgroVision AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="price-alerts" className="flex flex-col space-y-1">
                  <span>Market Price Alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">Receive notifications when your crop prices fluctuate significantly.</span>
                </Label>
                <Switch id="price-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="weather-alerts" className="flex flex-col space-y-1">
                  <span>Severe Weather Alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">Get instant warnings for heavy rain, frost, or extreme heat.</span>
                </Label>
                <Switch id="weather-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="disease-alerts" className="flex flex-col space-y-1">
                  <span>Disease Detection Alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">Be notified immediately if AI detects high disease risk in your scans.</span>
                </Label>
                <Switch id="disease-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="irrigation-alerts" className="flex flex-col space-y-1">
                  <span>Irrigation Reminders</span>
                  <span className="font-normal text-xs text-muted-foreground">Receive daily recommendations on watering schedules.</span>
                </Label>
                <Switch id="irrigation-alerts" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="prediction-alerts" className="flex flex-col space-y-1">
                  <span>Yield Prediction Updates</span>
                  <span className="font-normal text-xs text-muted-foreground">Weekly summaries of your estimated harvest yield.</span>
                </Label>
                <Switch id="prediction-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
        );

      case "display":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Display & Preferences</CardTitle>
              <CardDescription>Customize the appearance and localization of the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <Label className="text-base">Theme</Label>
                <RadioGroup defaultValue="system" className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="font-normal">Light Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="font-normal">Dark Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="font-normal">System Default</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="language" className="text-base">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Measurement Units</Label>
                <RadioGroup defaultValue="metric" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="unit-metric" />
                    <Label htmlFor="unit-metric" className="font-normal">Metric (kg, °C, mm)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="unit-imperial" />
                    <Label htmlFor="unit-imperial" className="font-normal">Imperial (lbs, °F, in)</Label>
                  </div>
                </RadioGroup>
              </div>

            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Save Preferences</Button>
            </CardFooter>
          </Card>
        );

      case "api":
        return (
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage external API keys for advanced integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weatherKey">OpenWeatherMap API Key (Optional Override)</Label>
                <Input id="weatherKey" type="password" placeholder="••••••••••••••••••••••••••••••••" />
                <p className="text-xs text-muted-foreground">Leave blank to use the system default weather API key.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketKey">Market Data API Key (Optional Override)</Label>
                <Input id="marketKey" type="password" placeholder="••••••••••••••••••••••••••••••••" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="gap-2"><Save className="h-4 w-4" /> Save Keys</Button>
            </CardFooter>
          </Card>
        );

      case "security":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Protect your AgroVision AI account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Change Password</h4>
                <div className="space-y-2">
                  <Label htmlFor="currentPwd">Current Password</Label>
                  <Input id="currentPwd" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPwd">New Password</Label>
                  <Input id="newPwd" type="password" />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">Update Password</Button>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="2fa" className="flex flex-col space-y-1">
                    <span>Two-Factor Authentication (2FA)</span>
                    <span className="font-normal text-xs text-muted-foreground">Add an extra layer of security to your account.</span>
                  </Label>
                  <Switch id="2fa" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "farm", label: "Farm Information", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display & Preferences", icon: Monitor },
    { id: "api", label: "API Configuration", icon: Key },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" /> Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and application preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>

      </div>

    </div>
  );
}
