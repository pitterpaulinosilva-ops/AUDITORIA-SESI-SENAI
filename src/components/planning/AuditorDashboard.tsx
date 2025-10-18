import React, { useMemo } from 'react';
import { User, Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuditStore } from '../../store';
import { AuditStatus } from '../../types';
import type { Audit } from '../../types';
import { MyAuditsSection } from './MyAuditsSection';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditorDashboardProps {
  currentAuditor?: string; // Nome do auditor logado - por enquanto simulado
  onExecuteAudit: (auditId: string) => void;
  onAuditClick: (audit: Audit) => void;
}

export function AuditorDashboard({ 
  currentAuditor = "João Silva", // Simulando auditor logado
  onExecuteAudit, 
  onAuditClick 
}: AuditorDashboardProps) {
  const { audits } = useAuditStore();

  // Filtrar auditorias do auditor atual
  const myAudits = useMemo(() => {
    return audits.filter(audit => audit.auditor === currentAuditor);
  }, [audits, currentAuditor]);

  // Estatísticas do auditor
  const auditorStats = useMemo(() => {
    const total = myAudits.length;
    const planned = myAudits.filter(a => a.status === AuditStatus.PLANNED).length;
    const inProgress = myAudits.filter(a => a.status === AuditStatus.IN_PROGRESS).length;
    const completed = myAudits.filter(a => a.status === AuditStatus.COMPLETED).length;
    
    // Auditorias por período
    const today = myAudits.filter(a => 
      a.scheduledDate && isToday(new Date(a.scheduledDate))
    ).length;
    
    const tomorrow = myAudits.filter(a => 
      a.scheduledDate && isTomorrow(new Date(a.scheduledDate))
    ).length;
    
    const thisWeek = myAudits.filter(a => 
      a.scheduledDate && isThisWeek(new Date(a.scheduledDate))
    ).length;
    
    const overdue = myAudits.filter(a => 
      a.scheduledDate && 
      isPast(new Date(a.scheduledDate)) && 
      a.status !== AuditStatus.COMPLETED
    ).length;

    return {
      total,
      planned,
      inProgress,
      completed,
      today,
      tomorrow,
      thisWeek,
      overdue
    };
  }, [myAudits]);

  // Próximas auditorias (próximos 7 dias)
  const upcomingAudits = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return myAudits
      .filter(audit => {
        if (!audit.scheduledDate) return false;
        const auditDate = new Date(audit.scheduledDate);
        return auditDate >= now && auditDate <= nextWeek && 
               (audit.status === AuditStatus.PLANNED || audit.status === AuditStatus.IN_PROGRESS);
      })
      .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
      .slice(0, 5);
  }, [myAudits]);

  return (
    <div className="space-y-6">
      {/* Header do Dashboard do Auditor */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Dashboard do Auditor</h2>
            <p className="text-blue-100">Bem-vindo, {currentAuditor}</p>
          </div>
        </div>
        
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold">{auditorStats.total}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Planejadas</span>
            </div>
            <div className="text-2xl font-bold">{auditorStats.planned}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Em Andamento</span>
            </div>
            <div className="text-2xl font-bold">{auditorStats.inProgress}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Atrasadas</span>
            </div>
            <div className="text-2xl font-bold text-yellow-200">{auditorStats.overdue}</div>
          </div>
        </div>
      </div>

      {/* Alertas e Notificações */}
      {(auditorStats.today > 0 || auditorStats.overdue > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Atenção Necessária</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                {auditorStats.today > 0 && (
                  <p>• {auditorStats.today} auditoria(s) agendada(s) para hoje</p>
                )}
                {auditorStats.overdue > 0 && (
                  <p>• {auditorStats.overdue} auditoria(s) em atraso</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximas Auditorias */}
      {upcomingAudits.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Próximas Auditorias
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Suas auditorias dos próximos 7 dias
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {upcomingAudits.map((audit) => (
                <div 
                  key={audit.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{audit.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{audit.sector}</span>
                      <span>•</span>
                      <span>
                        {audit.scheduledDate && format(new Date(audit.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      audit.scheduledDate && isToday(new Date(audit.scheduledDate))
                        ? 'bg-red-100 text-red-700'
                        : audit.scheduledDate && isTomorrow(new Date(audit.scheduledDate))
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {audit.scheduledDate && isToday(new Date(audit.scheduledDate)) ? 'Hoje' :
                       audit.scheduledDate && isTomorrow(new Date(audit.scheduledDate)) ? 'Amanhã' :
                       audit.scheduledDate && format(new Date(audit.scheduledDate), 'dd/MM', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seção Minhas Auditorias */}
      <MyAuditsSection
        audits={myAudits}
        onExecuteAudit={onExecuteAudit}
        onAuditClick={onAuditClick}
        auditorName={currentAuditor}
      />
    </div>
  );
}