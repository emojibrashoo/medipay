import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TransactionExplorer from "./pages/TransactionExplorer";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientInvoices from "./pages/patient/PatientInvoices";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import NotFound from "./pages/NotFound";
import NewDoctorDashboard from "./pages/doctor/NewDoctorDashboard";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import InsuranceDashboard from "./pages/insurance/InsuranceDashboard";
import UserManagement from "./components/institution/UserManagement";
import ProductManagement from "./components/institution/ProductManagement";

const Router = () => (

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
            <Route path="transactions" element={<div>Patient Transactions</div>} />
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
            <Route path="products" element={<ProductManagement />} />
            <Route path="users" element={<UserManagement />} />
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
);

export { Router };
