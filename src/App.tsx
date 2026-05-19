import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';
import TradesPage from './pages/Trades';
import RiskPage from './pages/Risk';
import TreasuryPage from './pages/Treasury';
import DepositsPage from './pages/Deposits';
import PricingPage from './pages/Pricing';
import AccountingPage from './pages/Accounting';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/auth/LoginPage';
import FinancialAccountsPage from './pages/Accounting/FinancialAccpounts';
import Khazaneh from './pages/Accounting/Khazaneh';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={
                  <ProtectedRoute permission="dashboard">
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/financial-accounts" element={
                  <ProtectedRoute permission="dashboard">
                    <Khazaneh />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute permission="users">
                    <UsersPage />
                  </ProtectedRoute>
                } />
                <Route path="/trades" element={
                  <ProtectedRoute permission="trades">
                    <TradesPage />
                  </ProtectedRoute>
                } />
                <Route path="/risk" element={
                  <ProtectedRoute permission="risk">
                    <RiskPage />
                  </ProtectedRoute>
                } />
                <Route path="/treasury" element={
                  <ProtectedRoute permission="treasury">
                    <TreasuryPage />
                  </ProtectedRoute>
                } />
                <Route path="/deposits" element={
                  <ProtectedRoute permission="deposits">
                    <DepositsPage />
                  </ProtectedRoute>
                } />
                <Route path="/pricing" element={
                  <ProtectedRoute permission="pricing">
                    <PricingPage />
                  </ProtectedRoute>
                } />
                <Route path="/accounting" element={
                  <ProtectedRoute permission="accounting">
                    <AccountingPage />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute permission="reports">
                    <ReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}