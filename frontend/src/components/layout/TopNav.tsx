import { Bell, Search, Menu, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4 w-full max-w-md">
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search analytics, models, or settings..."
            className="w-full pl-9 bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" />}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {[
                { title: "Yield Prediction Updated", desc: "Expected yield increased by 14% based on recent weather data.", time: "2h ago", unread: true },
                { title: "Market Alert", desc: "Blueberry prices dropped in your local mandi. Hold selling.", time: "5h ago", unread: false },
                { title: "Plantation Advice", desc: "Soil moisture is low. Consider irrigating sector 4.", time: "1d ago", unread: false },
              ].map((notif, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start p-4 cursor-pointer gap-1">
                  <div className="flex w-full items-center justify-between">
                    <span className={`text-sm font-semibold ${notif.unread ? 'text-primary' : ''}`}>{notif.title}</span>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>
                  <span className="text-sm text-muted-foreground line-clamp-2">{notif.desc}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full justify-center text-primary cursor-pointer font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}>
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'F'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Farmer'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'farmer@example.com'}
                </p>
                <p className="text-xs font-semibold text-primary mt-1">
                  {user?.farmName || 'Demo Farm'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
