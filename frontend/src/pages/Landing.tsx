import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, Activity, LineChart, MapPin, CloudSun, Target, ArrowRight } from "lucide-react";

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary tracking-tight">AGROVISION AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium hover:text-primary transition-colors">How it works</a>
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  YOLOv8 Powered Detection
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  AI-Powered Intelligence for Smarter Agriculture
                </h1>
                <p className="max-w-[600px] text-lg text-primary-foreground/80 leading-relaxed">
                  Detect plant growth, predict yield and prices, and discover the best plantation strategies using artificial intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold">
                      Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground">
                      Explore Platform
                    </Button>
                  </a>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none relative">
                {/* Mockup visualization */}
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-white/5 to-white/20 p-2 shadow-2xl backdrop-blur-sm border border-white/10">
                  <div className="w-full h-full rounded-xl bg-card overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f23f5b721e0?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-80 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-green-500 rounded-lg relative bg-green-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                        <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded font-mono font-bold">Flower: 98%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50 border-y">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">5</h4>
                <p className="text-sm font-medium text-muted-foreground">Growth Stages Detected</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">AI</h4>
                <p className="text-sm font-medium text-muted-foreground">Powered Analysis</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">Live</h4>
                <p className="text-sm font-medium text-muted-foreground">Real-Time Data</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">100%</h4>
                <p className="text-sm font-medium text-muted-foreground">Data-Driven Decisions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-[800px] mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Complete Agricultural Intelligence</h2>
              <p className="text-muted-foreground text-lg">A fully integrated suite of AI tools designed to optimize your entire growing cycle from plantation to market.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Target, title: "AI Plant Detection", desc: "Identify flower and fruit stages instantly with our advanced YOLOv8 computer vision model." },
                { icon: Activity, title: "Yield Prediction", desc: "Forecast harvest volumes based on precise flower counting and historical growth analytics." },
                { icon: LineChart, title: "Market Intelligence", desc: "Predict future fruit prices by analyzing local market supply, demand, and yield forecasts." },
                { icon: MapPin, title: "Plantation Recommendation", desc: "Discover the optimal crops to plant based on your specific soil metrics and climate." },
                { icon: CloudSun, title: "Weather Intelligence", desc: "Real-time localized weather monitoring integrated directly into your yield predictions." },
                { icon: Sprout, title: "AI Recommendations", desc: "Get autonomous, actionable advice on irrigation, selling times, and crop treatment." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-16">The AgroVision Workflow</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
              {['Capture', 'Analyze', 'Predict', 'Recommend'].map((step, i) => (
                <div key={step} className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
                  <div className="flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold backdrop-blur-sm mb-4">
                      0{i + 1}
                    </div>
                    <h3 className="text-lg font-semibold">{step}</h3>
                  </div>
                  {i < 3 && <ArrowRight className="hidden md:block h-8 w-8 text-white/30" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-primary tracking-tight">AGROVISION AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AgroVision AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
