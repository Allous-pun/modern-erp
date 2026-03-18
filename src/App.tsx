import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { SetupPage } from "@/pages/auth/SetupPage";
import { LandingPage } from "@/pages/LandingPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import PricingPage from "@/pages/PricingPage";
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
import { POSSessionsPage } from "@/pages/pos/POSSessionsPage";
import { POSSalesHistoryPage } from "@/pages/pos/POSSalesHistoryPage";
import { CampaignsPage } from "@/pages/sales/CampaignsPage";

// ============================================
// SYSTEM MODULE IMPORTS (Existing Admin Pages)
// ============================================
import { UsersPage } from "@/pages/admin/UsersPage";
import { RolesPage } from "@/pages/admin/RolesPage";
import { AuditLogsPage } from "@/pages/admin/AuditLogsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { ModulesPage } from "@/pages/admin/ModulesPage";
import { WorkflowsPage } from "@/pages/admin/WorkflowsPage";
import { LanguagePage } from "@/pages/admin/LanguagePage";
import { OrganizationPage } from "@/pages/admin/OrganizationPage";

// ============================================
// SYSTEM MODULE IMPORTS (New pages - COMMENTED OUT)
// ============================================
// Security & Compliance Pages
// import { SecurityPoliciesPage } from "@/pages/system/SecurityPoliciesPage";
// import { CompliancePage } from "@/pages/system/CompliancePage";
// import { ComplianceFrameworksPage } from "@/pages/system/ComplianceFrameworksPage";
// import { ComplianceChecklistsPage } from "@/pages/system/ComplianceChecklistsPage";
// import { ComplianceAuditsPage } from "@/pages/system/ComplianceAuditsPage";

// Risk Management Pages
// import { RiskDashboardPage } from "@/pages/system/RiskDashboardPage";
// import { RisksPage } from "@/pages/system/RisksPage";
// import { RiskAssessmentsPage } from "@/pages/system/RiskAssessmentsPage";

// Data Privacy Pages
// import { PrivacySettingsPage } from "@/pages/system/PrivacySettingsPage";
// import { DataSubjectRequestsPage } from "@/pages/system/DataSubjectRequestsPage";
// import { PrivacyPoliciesPage } from "@/pages/system/PrivacyPoliciesPage";
// import { DataBreachesPage } from "@/pages/system/DataBreachesPage";
// import { GDPRReportPage } from "@/pages/system/GDPRReportPage";
import { SystemConfigPage } from "@/pages/admin/SystemConfigPage";
import { SecurityPoliciesPage } from "@/pages/admin/SecurityPoliciesPage";
import { CompliancePage } from "@/pages/admin/CompliancePage";
import { RisksPage } from "@/pages/admin/RisksPage";
import { PrivacyPage } from "@/pages/admin/PrivacyPage";

// Backup Pages
import { BackupsPage } from "@/pages/system/BackupsPage";
// import { BackupDetailsPage } from "@/pages/system/BackupDetailsPage";

// Other modules
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
import { ManufacturingDashboard } from "@/pages/manufacturing/ManufacturingDashboard";
import { WorkOrdersPage } from "@/pages/manufacturing/WorkOrdersPage";
import { BOMPage } from "@/pages/manufacturing/BOMPage";
import { ProductionPlanningPage } from "@/pages/manufacturing/ProductionPlanningPage";
import { WorkCentersPage } from "@/pages/manufacturing/WorkCentersPage";
import { QualityControlPage } from "@/pages/manufacturing/QualityControlPage";
import { ProfilePage } from "@/pages/ProfilePage";
import NotFound from "./pages/NotFound";

// Executive Module
import { StrategicDashboard } from '@/pages/executive/StrategicDashboard';
import { GovernancePage } from '@/pages/executive/GovernancePage';
import { AnalyticsPage } from '@/pages/executive/AnalyticsPage';
import { OperationsPage } from '@/pages/executive/OperationsPage';
import { FinancialPage } from '@/pages/executive/FinancialPage';
import { TechnologyPage } from '@/pages/executive/TechnologyPage';
import { ITGovernancePage } from '@/pages/executive/ITGovernancePage';
import { PlanningPage } from '@/pages/executive/PlanningPage';
import { ExecutiveReportsPage } from '@/pages/executive/ExecutiveReportsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <OrganizationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - Landing page is now at root path */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<LoginPage />} />              
              
              {/* Protected routes with main layout */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* FINANCE MODULE */}
                <Route path="finance" element={<FinanceDashboard />} />
                <Route path="finance/accounts" element={<ChartOfAccountsPage />} />
                <Route path="finance/ledger" element={<GeneralLedgerPage />} />
                <Route path="finance/invoices" element={<InvoicesPage />} />
                <Route path="finance/payments" element={<PaymentsPage />} />
                <Route path="finance/expenses" element={<ExpensesPage />} />
                <Route path="finance/budgets" element={<BudgetsPage />} />
                <Route path="finance/*" element={<FinanceDashboard />} />
                
                {/* HR MODULE */}
                <Route path="hr" element={<HRDashboard />} />
                <Route path="hr/employees" element={<EmployeesPage />} />
                <Route path="hr/recruitment" element={<RecruitmentPage />} />
                <Route path="hr/attendance" element={<AttendancePage />} />
                <Route path="hr/leave" element={<LeavePage />} />
                <Route path="hr/payroll" element={<PayrollPage />} />
                <Route path="hr/performance" element={<PerformancePage />} />
                <Route path="hr/training" element={<TrainingPage />} />
                <Route path="hr/*" element={<HRDashboard />} />
                
                {/* SALES MODULE */}
                <Route path="sales" element={<SalesDashboard />} />
                <Route path="sales/leads" element={<LeadsPage />} />
                <Route path="sales/opportunities" element={<OpportunitiesPage />} />
                <Route path="sales/customers" element={<CustomersPage />} />
                <Route path="sales/quotations" element={<QuotationsPage />} />
                <Route path="sales/orders" element={<SalesOrdersPage />} />
                <Route path="sales/tickets" element={<SupportTicketsPage />} />
                <Route path="pos" element={<POSPage />} />
                <Route path="pos/sessions" element={<POSSessionsPage />} />
                <Route path="pos/history" element={<POSSalesHistoryPage />} />
                <Route path="sales/support" element={<SupportTicketsPage />} />
                <Route path="sales/campaigns" element={<CampaignsPage />} />
                <Route path="sales/*" element={<SalesDashboard />} />
                
                {/* PROCUREMENT MODULE */}
                <Route path="procurement" element={<ProcurementDashboard />} />
                <Route path="procurement/suppliers" element={<SuppliersPage />} />
                <Route path="procurement/requisitions" element={<RequisitionsPage />} />
                <Route path="procurement/orders" element={<PurchaseOrdersPage />} />
                <Route path="procurement/grn" element={<GoodsReceivedPage />} />
                <Route path="procurement/*" element={<ProcurementDashboard />} />
                
                {/* INVENTORY MODULE */}
                <Route path="inventory" element={<InventoryDashboard />} />
                <Route path="inventory/items" element={<ItemsPage />} />
                <Route path="inventory/stock" element={<StockLevelsPage />} />
                <Route path="inventory/warehouses" element={<WarehousesPage />} />
                <Route path="inventory/movements" element={<StockMovementsPage />} />
                <Route path="inventory/reorder" element={<ReorderRulesPage />} />
                <Route path="inventory/*" element={<InventoryDashboard />} />
                
                {/* PROJECTS MODULE */}
                <Route path="projects" element={<ProjectsDashboard />} />
                <Route path="projects/list" element={<ProjectListPage />} />
                <Route path="projects/tasks" element={<TasksPage />} />
                <Route path="projects/timesheets" element={<TimesheetsPage />} />
                <Route path="projects/resources" element={<ResourcesPage />} />
                <Route path="projects/milestones" element={<MilestonesPage />} />
                <Route path="projects/*" element={<ProjectsDashboard />} />
                
                {/* MANUFACTURING MODULE */}
                <Route path="manufacturing" element={<ManufacturingDashboard />} />
                <Route path="manufacturing/orders" element={<WorkOrdersPage />} />
                <Route path="manufacturing/bom" element={<BOMPage />} />
                <Route path="manufacturing/planning" element={<ProductionPlanningPage />} />
                <Route path="manufacturing/centers" element={<WorkCentersPage />} />
                <Route path="manufacturing/quality" element={<QualityControlPage />} />
                <Route path="manufacturing/*" element={<ManufacturingDashboard />} />
                
                {/* Executive Module */}
                <Route path="executive/strategic" element={<StrategicDashboard />} />
                <Route path="executive/governance" element={<GovernancePage />} />
                <Route path="executive/analytics" element={<AnalyticsPage />} />
                <Route path="executive/operations" element={<OperationsPage />} />
                <Route path="executive/financial" element={<FinancialPage />} />
                <Route path="executive/technology" element={<TechnologyPage />} />
                <Route path="executive/it-governance" element={<ITGovernancePage />} />
                <Route path="executive/planning" element={<PlanningPage />} />
                <Route path="executive/reports" element={<ExecutiveReportsPage />} />
                <Route path="executive" element={<StrategicDashboard />} />

                {/* Reports Module */}
                <Route path="reports" element={<ReportsPage />} />
                
                {/* ============================================
                     SYSTEM MODULE - SIMPLIFIED FOR NOW
                     Only using existing admin pages
                ============================================ */}
                
                {/* System Dashboard - COMMENTED OUT until component exists */}
                {/* <Route path="system" element={<SystemDashboard />} /> */}
                
                {/* User Management - Using existing admin pages */}
                <Route path="system/users" element={<UsersPage />} />
                {/* <Route path="system/users/:id" element={<UserDetailsPage />} /> */}
                {/* <Route path="system/users/new" element={<CreateUserPage />} /> */}
                
                {/* Role Management - Using existing admin pages */}
                <Route path="system/roles" element={<RolesPage />} />
                {/* <Route path="system/roles/:id" element={<RoleDetailsPage />} /> */}
                {/* <Route path="system/roles/new" element={<CreateRolePage />} /> */}
                
                {/* Permissions - COMMENTED OUT */}
                {/* <Route path="system/permissions" element={<PermissionsPage />} /> */}
                
                {/* Audit Logs - Using existing admin pages */}
                <Route path="system/audit-logs" element={<AuditLogsPage />} />
                {/* <Route path="system/audit-logs/:id" element={<AuditLogDetailsPage />} /> */}
                
                {/* Backup Management - COMMENTED OUT */}
                <Route path="system/backups" element={<BackupsPage />} />
                {/* <Route path="system/backups/:id" element={<BackupDetailsPage />} /> */}
                {/* <Route path="system/backups/new" element={<CreateBackupPage />} /> */}
                
                {/* System Configuration - COMMENTED OUT */}
                <Route path="system/config" element={<SystemConfigPage />} />
                
                {/* Security Policies - COMMENTED OUT */}
                <Route path="system/security" element={<SecurityPoliciesPage />} />
                
                {/* Compliance - Added from admin */}
                <Route path="system/compliance" element={<CompliancePage />} />
                
                {/* Risk Management - Added from admin */}
                <Route path="system/risks" element={<RisksPage />} />
                
                {/* Data Privacy - Added from admin */}
                <Route path="system/privacy" element={<PrivacyPage />} />
                
                {/* System Settings - Using existing admin pages */}
                <Route path="system/settings" element={<SettingsPage />} />
                <Route path="system/modules" element={<ModulesPage />} />
                <Route path="system/workflows" element={<WorkflowsPage />} />
                <Route path="system/languages" element={<LanguagePage />} />
                <Route path="system/organization" element={<OrganizationPage />} />
                
                {/* Redirect old admin paths */}
                <Route path="admin/users" element={<Navigate to="/app/system/users" replace />} />
                <Route path="admin/roles" element={<Navigate to="/app/system/roles" replace />} />
                <Route path="admin/audit" element={<Navigate to="/app/system/audit-logs" replace />} />
                <Route path="admin/settings" element={<Navigate to="/app/system/settings" replace />} />
                <Route path="admin/modules" element={<Navigate to="/app/system/modules" replace />} />
                <Route path="admin/workflows" element={<Navigate to="/app/system/workflows" replace />} />
                <Route path="admin/languages" element={<Navigate to="/app/system/language" replace />} />
                <Route path="admin/organization" element={<Navigate to="/app/system/organization" replace />} />
                
                {/* Profile and settings */}
                <Route path="profile" element={<ProfilePage />} />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </OrganizationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;