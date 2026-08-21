import { Outlet } from "react-router-dom";
import { Sprout } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side: Branding / Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12 text-primary-foreground relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>

        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <Sprout className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">AGROVISION AI</h1>
          <p className="text-xl text-primary-foreground/80 font-medium mb-8">
            "See. Predict. Grow."
          </p>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 text-left">
            <p className="text-sm leading-relaxed text-primary-foreground/90">
              "The AgroVision platform has completely transformed how we monitor our fields. The yield predictions are incredibly accurate, allowing us to negotiate better prices before harvest even begins."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">JD</div>
              <div>
                <p className="text-sm font-semibold">Jonathan Davis</p>
                <p className="text-xs text-primary-foreground/70">Chief Agronomist, Green Valley</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary tracking-tight">AGROVISION AI</span>
        </div>
        <div className="w-full max-w-md space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
