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
import { ChartOfAccountsPage } from "@/pages/finance/ChartOfAccountsPage";
import { GeneralLedgerPage } from "@/pages/finance/GeneralLedgerPage";
import { InvoicesPage } from "@/pages/finance/InvoicesPage";
import { PaymentsPage } from "@/pages/finance/PaymentsPage";
import { ExpensesPage } from "@/pages/finance/ExpensesPage";
import { BudgetsPage } from "@/pages/finance/BudgetsPage";
import { HRDashboard } from "@/pages/dashboards/HRDashboard";
import { EmployeesPage } from "@/pages/hr/EmployeesPage";
import { RecruitmentPage } from "@/pages/hr/RecruitmentPage";
import { AttendancePage } from "@/pages/hr/AttendancePage";
import { LeavePage } from "@/pages/hr/LeavePage";
import { PayrollPage } from "@/pages/hr/PayrollPage";
import { PerformancePage } from "@/pages/hr/PerformancePage";
import { TrainingPage } from "@/pages/hr/TrainingPage";
import { SalesDashboard } from "@/pages/dashboards/SalesDashboard";
import { LeadsPage } from "@/pages/sales/LeadsPage";
import { OpportunitiesPage } from "@/pages/sales/OpportunitiesPage";
import { CustomersPage } from "@/pages/sales/CustomersPage";
import { QuotationsPage } from "@/pages/sales/QuotationsPage";
import { SalesOrdersPage } from "@/pages/sales/SalesOrdersPage";
import { POSPage } from "@/pages/sales/POSPage";
import { SupportTicketsPage } from "@/pages/sales/SupportTicketsPage";
import { CampaignsPage } from "@/pages/sales/CampaignsPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { RolesPage } from "@/pages/admin/RolesPage";
import { OrganizationPage } from "@/pages/admin/OrganizationPage";
import { ModulesPage } from "@/pages/admin/ModulesPage";
import { WorkflowsPage } from "@/pages/admin/WorkflowsPage";
import { LanguagePage } from "@/pages/admin/LanguagePage";
import { AuditLogsPage } from "@/pages/admin/AuditLogsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { ProcurementDashboard } from "@/pages/procurement/ProcurementDashboard";
import { SuppliersPage } from "@/pages/procurement/SuppliersPage";
import { RequisitionsPage } from "@/pages/procurement/RequisitionsPage";
import { PurchaseOrdersPage } from "@/pages/procurement/PurchaseOrdersPage";
import { GoodsReceivedPage } from "@/pages/procurement/GoodsReceivedPage";
import { InventoryDashboard } from "@/pages/inventory/InventoryDashboard";
import { ItemsPage } from "@/pages/inventory/ItemsPage";
import { StockLevelsPage } from "@/pages/inventory/StockLevelsPage";
import { WarehousesPage } from "@/pages/inventory/WarehousesPage";
import { StockMovementsPage } from "@/pages/inventory/StockMovementsPage";
import { ReorderRulesPage } from "@/pages/inventory/ReorderRulesPage";
import { ProjectsDashboard } from "@/pages/projects/ProjectsDashboard";
import { ProjectListPage } from "@/pages/projects/ProjectListPage";
import { TasksPage } from "@/pages/projects/TasksPage";
import { TimesheetsPage } from "@/pages/projects/TimesheetsPage";
import { ResourcesPage } from "@/pages/projects/ResourcesPage";
import { MilestonesPage } from "@/pages/projects/MilestonesPage";
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
                <Route path="finance/accounts" element={<ChartOfAccountsPage />} />
                <Route path="finance/ledger" element={<GeneralLedgerPage />} />
                <Route path="finance/invoices" element={<InvoicesPage />} />
                <Route path="finance/payments" element={<PaymentsPage />} />
                <Route path="finance/expenses" element={<ExpensesPage />} />
                <Route path="finance/budgets" element={<BudgetsPage />} />
                <Route path="finance/*" element={<FinanceDashboard />} />
                
                {/* HR Module */}
                <Route path="hr" element={<HRDashboard />} />
                <Route path="hr/employees" element={<EmployeesPage />} />
                <Route path="hr/recruitment" element={<RecruitmentPage />} />
                <Route path="hr/attendance" element={<AttendancePage />} />
                <Route path="hr/leave" element={<LeavePage />} />
                <Route path="hr/payroll" element={<PayrollPage />} />
                <Route path="hr/performance" element={<PerformancePage />} />
                <Route path="hr/training" element={<TrainingPage />} />
                <Route path="hr/*" element={<HRDashboard />} />
                
                {/* Sales Module */}
                <Route path="sales" element={<SalesDashboard />} />
                <Route path="sales/leads" element={<LeadsPage />} />
                <Route path="sales/opportunities" element={<OpportunitiesPage />} />
                <Route path="sales/customers" element={<CustomersPage />} />
                <Route path="sales/quotations" element={<QuotationsPage />} />
                <Route path="sales/orders" element={<SalesOrdersPage />} />
                <Route path="sales/pos" element={<POSPage />} />
                <Route path="sales/tickets" element={<SupportTicketsPage />} />
                <Route path="sales/support" element={<SupportTicketsPage />} />
                <Route path="sales/campaigns" element={<CampaignsPage />} />
                <Route path="sales/*" element={<SalesDashboard />} />
                
                {/* Procurement Module */}
                <Route path="procurement" element={<ProcurementDashboard />} />
                <Route path="procurement/suppliers" element={<SuppliersPage />} />
                <Route path="procurement/requisitions" element={<RequisitionsPage />} />
                <Route path="procurement/orders" element={<PurchaseOrdersPage />} />
                <Route path="procurement/grn" element={<GoodsReceivedPage />} />
                <Route path="procurement/*" element={<ProcurementDashboard />} />
                
                {/* Inventory Module */}
                <Route path="inventory" element={<InventoryDashboard />} />
                <Route path="inventory/items" element={<ItemsPage />} />
                <Route path="inventory/stock" element={<StockLevelsPage />} />
                <Route path="inventory/warehouses" element={<WarehousesPage />} />
                <Route path="inventory/movements" element={<StockMovementsPage />} />
                <Route path="inventory/reorder" element={<ReorderRulesPage />} />
                <Route path="inventory/*" element={<InventoryDashboard />} />
                
                {/* Projects Module */}
                <Route path="projects" element={<ProjectsDashboard />} />
                <Route path="projects/list" element={<ProjectListPage />} />
                <Route path="projects/tasks" element={<TasksPage />} />
                <Route path="projects/timesheets" element={<TimesheetsPage />} />
                <Route path="projects/resources" element={<ResourcesPage />} />
                <Route path="projects/milestones" element={<MilestonesPage />} />
                <Route path="projects/*" element={<ProjectsDashboard />} />
                
                {/* Reports Module */}
                <Route path="reports" element={<ReportsPage />} />
                
                {/* Admin Module */}
                <Route path="admin/users" element={<UsersPage />} />
                <Route path="admin/roles" element={<RolesPage />} />
                <Route path="admin/organization" element={<OrganizationPage />} />
                <Route path="admin/modules" element={<ModulesPage />} />
                <Route path="admin/workflows" element={<WorkflowsPage />} />
                <Route path="admin/languages" element={<LanguagePage />} />
                <Route path="admin/audit" element={<AuditLogsPage />} />
                <Route path="admin/settings" element={<SettingsPage />} />
                
                {/* Profile and settings */}
                <Route path="profile" element={<Dashboard />} />
                <Route path="settings" element={<SettingsPage />} />
                
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
