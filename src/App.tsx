import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SuiWalletProvider } from "@/contexts/SuiWalletContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TransactionExplorer from "./pages/TransactionExplorer";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientInvoices from "./pages/patient/PatientInvoices";
import PatientTransactions from "./pages/patient/PatientTransactions";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import NewDoctorDashboard from "./pages/doctor/NewDoctorDashboard";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import InsuranceDashboard from "./pages/insurance/InsuranceDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SuiWalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/transactions" element={<TransactionExplorer />} />
          
          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PatientDashboard />} />
            <Route path="invoices" element={<PatientInvoices />} />
            <Route path="transactions" element={<PatientTransactions />} />
            <Route path="profile" element={<div>Patient Profile</div>} />
            <Route path="settings" element={<div>Patient Settings</div>} />
          </Route>
          
          {/* Doctor Routes */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<NewDoctorDashboard />} />
            <Route path="legacy" element={<DoctorDashboard />} />
            <Route path="create" element={<div>Create Invoice</div>} />
            <Route path="invoices" element={<div>Doctor Invoices</div>} />
            <Route path="records" element={<div>Medical Records</div>} />
            <Route path="prescriptions" element={<div>Prescriptions</div>} />
            <Route path="reports" element={<div>Doctor Reports</div>} />
            <Route path="profile" element={<div>Doctor Profile</div>} />
            <Route path="settings" element={<div>Doctor Settings</div>} />
          </Route>

          {/* Institution Routes */}
          <Route path="/institution" element={
            <ProtectedRoute allowedRoles={['institution']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<InstitutionDashboard />} />
            <Route path="transactions" element={<div>Institution Transactions</div>} />
            <Route path="insurance-payments" element={<div>Insurance Payments</div>} />
            <Route path="products" element={<div>Product Management</div>} />
            <Route path="users" element={<div>User Management</div>} />
            <Route path="reports" element={<div>Financial Reports</div>} />
            <Route path="profile" element={<div>Institution Profile</div>} />
            <Route path="settings" element={<div>Institution Settings</div>} />
          </Route>

          {/* Insurance Routes */}
          <Route path="/insurance" element={
            <ProtectedRoute allowedRoles={['insurance']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<InsuranceDashboard />} />
            <Route path="claims" element={<div>Insurance Claims</div>} />
            <Route path="transactions" element={<div>Patient Transactions</div>} />
            <Route path="reports" element={<div>Analytics & Reports</div>} />
            <Route path="profile" element={<div>Insurance Profile</div>} />
            <Route path="settings" element={<div>Insurance Settings</div>} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </SuiWalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
