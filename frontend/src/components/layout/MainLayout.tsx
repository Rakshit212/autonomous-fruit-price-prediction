import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 print:hidden">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <VisuallyHidden><SheetTitle>Navigation Menu</SheetTitle></VisuallyHidden>
          <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 print:overflow-visible">
        <div className="print:hidden">
          <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 print:p-0 print:overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
