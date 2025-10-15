import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { AuditList } from './pages/audits/AuditList'
import AuditForm from './pages/audits/AuditForm'
import { AuditExecution } from './pages/audits/AuditExecution'
import { AuditDetails } from './pages/audits/AuditDetails'
import Checklists from './pages/Checklists'
import ChecklistNew from './pages/ChecklistNew'
import ChecklistEdit from './pages/ChecklistEdit'
import ChecklistView from './pages/ChecklistView'
import { NonConformityList } from './pages/non-conformities/NonConformityList'
import { NonConformityForm } from './pages/non-conformities/NonConformityForm'
import { NonConformityDetails } from './pages/non-conformities/NonConformityDetails'
import { Planning } from './pages/Planning'
import { ReportsLayout } from './pages/reports/ReportsLayout'
import { Dashboard as ReportsDashboard } from './pages/reports/Dashboard'
import { AuditReports } from './pages/reports/AuditReports'
import { NonConformityReports } from './pages/reports/NonConformityReports'
import { PerformanceReports } from './pages/reports/PerformanceReports'
import { CustomReports } from './pages/reports/CustomReports'
import { ScheduleReports } from './pages/reports/ScheduleReports'
import { Settings } from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        {/* Rota padrão - redireciona para dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Auditorias */}
        <Route path="/audits" element={<AuditList />} />
        <Route path="/audits/new" element={<AuditForm />} />
        <Route path="/audits/:id" element={<AuditDetails />} />
        <Route path="/audits/:id/edit" element={<AuditForm />} />
        <Route path="/audits/:id/execute" element={<AuditExecution />} />
        
        {/* Checklists */}
        <Route path="/checklists" element={<Checklists />} />
        <Route path="/checklists/new" element={<ChecklistNew />} />
        <Route path="/checklists/:id" element={<ChecklistView />} />
        <Route path="/checklists/:id/edit" element={<ChecklistEdit />} />
        
        {/* Não Conformidades */}
        <Route path="/non-conformities" element={<NonConformityList />} />
        <Route path="/non-conformities/new" element={<NonConformityForm />} />
        <Route path="/non-conformities/:id" element={<NonConformityDetails />} />
        <Route path="/non-conformities/:id/edit" element={<NonConformityForm />} />
        
        {/* Planejamento */}
        <Route path="/planning" element={<Planning />} />
        
        {/* Relatórios */}
        <Route path="/reports" element={<ReportsLayout />}>
          <Route index element={<ReportsDashboard />} />
          <Route path="audits" element={<AuditReports />} />
          <Route path="non-conformities" element={<NonConformityReports />} />
          <Route path="performance" element={<PerformanceReports />} />
          <Route path="custom" element={<CustomReports />} />
          <Route path="schedule" element={<ScheduleReports />} />
        </Route>
        
        {/* Configurações */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Rota 404 - redireciona para dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
