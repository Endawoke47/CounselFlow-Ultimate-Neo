import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { EntitiesPage } from '@/pages/entities/EntitiesPage'
import { ContractsPage } from '@/pages/contracts/ContractsPage'
import { DisputesPage } from '@/pages/disputes/DisputesPage'
import { MattersPage } from '@/pages/matters/MattersPage'
import { RiskManagementPage } from '@/pages/risk/RiskManagementPage'
import { PolicyManagementPage } from '@/pages/policy/PolicyManagementPage'
import { KnowledgeManagementPage } from '@/pages/knowledge/KnowledgeManagementPage'
import { LicensingPage } from '@/pages/licensing/LicensingPage'
import { OutsourcingPage } from '@/pages/outsourcing/OutsourcingPage'
import { TaskManagementPage } from '@/pages/tasks/TaskManagementPage'
import { AIAssistantPage } from '@/pages/ai/AIAssistantPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Helmet
          titleTemplate="%s | CounselFlow Ultimate Neo"
          defaultTitle="CounselFlow Ultimate Neo - Enterprise Legal Management"
        >
          <meta name="description" content="AI-powered enterprise legal management system for modern legal teams" />
        </Helmet>
        
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Legal Modules */}
              <Route path="entities" element={<EntitiesPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="disputes" element={<DisputesPage />} />
              <Route path="matters" element={<MattersPage />} />
              <Route path="risk" element={<RiskManagementPage />} />
              <Route path="policy" element={<PolicyManagementPage />} />
              <Route path="knowledge" element={<KnowledgeManagementPage />} />
              <Route path="licensing" element={<LicensingPage />} />
              <Route path="outsourcing" element={<OutsourcingPage />} />
              <Route path="tasks" element={<TaskManagementPage />} />
              
              {/* AI & Tools */}
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}