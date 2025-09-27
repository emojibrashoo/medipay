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
            <Route index element={<DoctorDashboard />} />
            <Route path="create" element={<div>Create Invoice</div>} />
            <Route path="invoices" element={<div>Doctor Invoices</div>} />
            <Route path="reports" element={<div>Doctor Reports</div>} />
            <Route path="profile" element={<div>Doctor Profile</div>} />
            <Route path="settings" element={<div>Doctor Settings</div>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export { Router };
