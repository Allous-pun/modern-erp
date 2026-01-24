import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { Dashboard } from "@/pages/dashboards/Dashboard";
import { FinanceDashboard } from "@/pages/dashboards/FinanceDashboard";
import { HRDashboard } from "@/pages/dashboards/HRDashboard";
import { SalesDashboard } from "@/pages/dashboards/SalesDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes with main layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Finance Module */}
                <Route path="finance" element={<FinanceDashboard />} />
                <Route path="finance/*" element={<FinanceDashboard />} />
                
                {/* HR Module */}
                <Route path="hr" element={<HRDashboard />} />
                <Route path="hr/*" element={<HRDashboard />} />
                
                {/* Sales Module */}
                <Route path="sales" element={<SalesDashboard />} />
                <Route path="sales/*" element={<SalesDashboard />} />
                
                {/* Procurement Module - placeholder */}
                <Route path="procurement/*" element={<Dashboard />} />
                
                {/* Inventory Module - placeholder */}
                <Route path="inventory/*" element={<Dashboard />} />
                
                {/* Projects Module - placeholder */}
                <Route path="projects/*" element={<Dashboard />} />
                
                {/* Reports - placeholder */}
                <Route path="reports" element={<Dashboard />} />
                
                {/* Admin - placeholder */}
                <Route path="admin/*" element={<Dashboard />} />
                
                {/* Profile and settings */}
                <Route path="profile" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                
                {/* Employee self-service */}
                <Route path="my-leave" element={<Dashboard />} />
                <Route path="my-timesheet" element={<Dashboard />} />
                <Route path="my-tasks" element={<Dashboard />} />
                <Route path="my-payslips" element={<Dashboard />} />
                
                {/* Portal routes */}
                <Route path="portal/*" element={<Dashboard />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
