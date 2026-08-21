import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  LineChart,
  MapPin,
  CloudSun,
  Bug,
  BrainCircuit,
  History,
  FileText,
  Settings,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Plant Analysis", href: "/plant-analysis", icon: Sprout },
  { name: "Yield Prediction", href: "/yield", icon: TrendingUp },
  { name: "Price Prediction", href: "/price", icon: LineChart },
  { name: "Plantation", href: "/plantation", icon: MapPin },
  { name: "Weather", href: "/weather", icon: CloudSun },
  { name: "Irrigation", href: "/irrigation", icon: Droplets },
  { name: "Disease Detection", href: "/disease", icon: Bug },
  { name: "Recommendations", href: "/recommendations", icon: BrainCircuit },
  { name: "History", href: "/history", icon: History },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("flex h-full flex-col bg-card border-r px-4 py-6", className)}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
          <Sprout className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-primary tracking-tight truncate">AGROVISION AI</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 -mr-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-2 pt-4 border-t">
        <p className="text-xs text-muted-foreground font-medium text-center truncate">
          "See. Predict. Grow."
        </p>
      </div>
    </div>
  );
}
