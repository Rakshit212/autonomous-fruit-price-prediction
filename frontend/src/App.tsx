import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { PlantAnalysis } from "./pages/PlantAnalysis";
import { PlantAnalytics } from "./pages/PlantAnalytics";
import { YieldPrediction } from "./pages/YieldPrediction";
import { PricePrediction } from "./pages/PricePrediction";
import { PlantationRecommendation } from "./pages/PlantationRecommendation";
import { WeatherDashboard } from "./pages/WeatherDashboard";
import { DiseaseDetection } from "./pages/DiseaseDetection";
import { IrrigationRecommendation } from "./pages/IrrigationRecommendation";
import { AIRecommendationEngine } from "./pages/AIRecommendationEngine";
import { AnalysisHistory } from "./pages/AnalysisHistory";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected App Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plant-analysis" element={<PlantAnalysis />} />
        <Route path="/plant-analysis/analytics" element={<PlantAnalytics />} />
        <Route path="/yield" element={<YieldPrediction />} />
        <Route path="/price" element={<PricePrediction />} />
        <Route path="/plantation" element={<PlantationRecommendation />} />
        <Route path="/weather" element={<WeatherDashboard />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/irrigation" element={<IrrigationRecommendation />} />
        <Route path="/recommendations" element={<AIRecommendationEngine />} />
        <Route path="/history" element={<AnalysisHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
