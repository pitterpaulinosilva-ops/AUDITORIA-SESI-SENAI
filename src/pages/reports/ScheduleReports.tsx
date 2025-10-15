import React, { useState, useEffect } from 'react';
import { useReportsStore } from '../../stores/reportsStore';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Mail, 
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  Send,
  History,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  templateId: string;
  templateName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  recipients: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportExecution {
  id: string;
  scheduleId: string;
  scheduleName: string;
  executedAt: string;
  status: 'success' | 'failed' | 'running';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  error?: string;
}

export const ScheduleReports: React.FC = () => {
  const { reportSchedules, isLoading } = useReportsStore();
  
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Relatório Semanal de Auditorias',
      description: 'Resumo semanal das auditorias realizadas',
      templateId: 'audit-summary',
      templateName: 'Resumo de Auditorias',
      frequency: 'weekly',
      dayOfWeek: 1, // Monday
      time: '09:00',
      recipients: ['gerente@empresa.com', 'diretor@empresa.com'],
      isActive: true,
      lastRun: '2024-01-15T09:00:00Z',
      nextRun: '2024-01-22T09:00:00Z',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      name: 'Dashboard Executivo Mensal',
      description: 'Métricas executivas consolidadas mensalmente',
      templateId: 'executive-dashboard',
      templateName: 'Dashboard Executivo',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '08:00',
      recipients: ['ceo@empresa.com', 'cfo@empresa.com'],
      isActive: true,
      nextRun: '2024-02-01T08:00:00Z',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      name: 'Relatório Diário de NCs',
      description: 'Acompanhamento diário de não conformidades',
      templateId: 'nc-daily',
      templateName: 'NCs Diárias',
      frequency: 'daily',
      time: '18:00',
      recipients: ['qualidade@empresa.com'],
      isActive: false,
      lastRun: '2024-01-14T18:00:00Z',
      nextRun: '2024-01-16T18:00:00Z',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-14T18:00:00Z'
    }
  ]);

  const [executions, setExecutions] = useState<ReportExecution[]>([
    {
      id: '1',
      scheduleId: '1',
      scheduleName: 'Relatório Semanal de Auditorias',
      executedAt: '2024-01-15T09:00:00Z',
      status: 'success',
      recipients: ['gerente@empresa.com', 'diretor@empresa.com'],
      format: 'pdf'
    },
    {
      id: '2',
      scheduleId: '2',
      scheduleName: 'Dashboard Executivo Mensal',
      executedAt: '2024-01-01T08:00:00Z',
      status: 'success',
      recipients: ['ceo@empresa.com', 'cfo@empresa.com'],
      format: 'excel'
    },
    {
      id: '3',
      scheduleId: '3',
      scheduleName: 'Relatório Diário de NCs',
      executedAt: '2024-01-14T18:00:00Z',
      status: 'failed',
      recipients: ['qualidade@empresa.com'],
      format: 'pdf',
      error: 'Falha na conexão com o servidor de email'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'schedules' | 'history'>('schedules');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    templateId: '',
    frequency: 'weekly' as const,
    dayOfWeek: 1,
    dayOfMonth: 1,
    time: '09:00',
    recipients: [''],
    isActive: true
  });

  const frequencyLabels = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral'
  };

  const dayOfWeekLabels = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ];

  const availableTemplates = [
    { id: 'audit-summary', name: 'Resumo de Auditorias' },
    { id: 'executive-dashboard', name: 'Dashboard Executivo' },
    { id: 'nc-daily', name: 'NCs Diárias' },
    { id: 'performance-report', name: 'Relatório de Performance' }
  ];

  const handleCreateSchedule = () => {
    const schedule: ScheduledReport = {
      id: Date.now().toString(),
      ...newSchedule,
      templateName: availableTemplates.find(t => t.id === newSchedule.templateId)?.name || '',
      recipients: newSchedule.recipients.filter(r => r.trim() !== ''),
      nextRun: calculateNextRun(newSchedule.frequency, newSchedule.dayOfWeek, newSchedule.dayOfMonth, newSchedule.time),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSchedules([...schedules, schedule]);
    setShowCreateModal(false);
    resetNewSchedule();
  };

  const handleUpdateSchedule = () => {
    if (editingSchedule) {
      const updatedSchedules = schedules.map(s => 
        s.id === editingSchedule.id 
          ? { ...editingSchedule, updatedAt: new Date().toISOString() }
          : s
      );
      setSchedules(updatedSchedules);
      setEditingSchedule(null);
    }
  };

  const handleToggleSchedule = (scheduleId: string) => {
    const updatedSchedules = schedules.map(s => 
      s.id === scheduleId 
        ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() }
        : s
    );
    setSchedules(updatedSchedules);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId));
  };

  const handleRunNow = (schedule: ScheduledReport) => {
    const execution: ReportExecution = {
      id: Date.now().toString(),
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      executedAt: new Date().toISOString(),
      status: 'running',
      recipients: schedule.recipients,
      format: 'pdf'
    };

    setExecutions([execution, ...executions]);

    // Simular execução
    setTimeout(() => {
      setExecutions(prev => prev.map(e => 
        e.id === execution.id 
          ? { ...e, status: 'success' as const }
          : e
      ));
    }, 3000);
  };

  const calculateNextRun = (frequency: string, dayOfWeek?: number, dayOfMonth?: number, time?: string): string => {
    const now = new Date();
    const [hours, minutes] = (time || '09:00').split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    switch (frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'weekly':
        const targetDay = dayOfWeek || 1;
        const currentDay = nextRun.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;
        if (daysUntilTarget === 0 && nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7);
        } else {
          nextRun.setDate(nextRun.getDate() + daysUntilTarget);
        }
        break;
      case 'monthly':
        nextRun.setDate(dayOfMonth || 1);
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
        break;
      case 'quarterly':
        const currentMonth = nextRun.getMonth();
        const nextQuarterMonth = Math.ceil((currentMonth + 1) / 3) * 3;
        nextRun.setMonth(nextQuarterMonth, dayOfMonth || 1);
        if (nextRun <= now) {
          nextRun.setMonth(nextQuarterMonth + 3);
        }
        break;
    }

    return nextRun.toISOString();
  };

  const resetNewSchedule = () => {
    setNewSchedule({
      name: '',
      description: '',
      templateId: '',
      frequency: 'weekly',
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: '09:00',
      recipients: [''],
      isActive: true
    });
  };

  const addRecipient = () => {
    setNewSchedule({
      ...newSchedule,
      recipients: [...newSchedule.recipients, '']
    });
  };

  const updateRecipient = (index: number, value: string) => {
    const updatedRecipients = [...newSchedule.recipients];
    updatedRecipients[index] = value;
    setNewSchedule({
      ...newSchedule,
      recipients: updatedRecipients
    });
  };

  const removeRecipient = (index: number) => {
    setNewSchedule({
      ...newSchedule,
      recipients: newSchedule.recipients.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamento de Relatórios</h1>
          <p className="text-gray-600 mt-1">
            Configure e gerencie o envio automático de relatórios
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Agendamentos
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Histórico de Execuções
          </button>
        </nav>
      </div>

      {activeTab === 'schedules' ? (
        /* Lista de Agendamentos */
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{schedule.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      schedule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{schedule.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Template:</span>
                      <p className="font-medium">{schedule.templateName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Frequência:</span>
                      <p className="font-medium">
                        {frequencyLabels[schedule.frequency]}
                        {schedule.frequency === 'weekly' && schedule.dayOfWeek !== undefined && 
                          ` (${dayOfWeekLabels[schedule.dayOfWeek]})`
                        }
                        {schedule.frequency === 'monthly' && schedule.dayOfMonth && 
                          ` (dia ${schedule.dayOfMonth})`
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Horário:</span>
                      <p className="font-medium">{schedule.time}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Próxima execução:</span>
                      <p className="font-medium">
                        {format(new Date(schedule.nextRun), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">Destinatários:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {schedule.recipients.map((recipient, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Mail className="w-3 h-3 mr-1" />
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleRunNow(schedule)}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                    title="Executar agora"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleSchedule(schedule.id)}
                    className={`p-2 rounded transition-colors ${
                      schedule.isActive 
                        ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                    }`}
                    title={schedule.isActive ? 'Pausar' : 'Ativar'}
                  >
                    {schedule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Histórico de Execuções */
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Execuções</h3>
            <p className="text-sm text-gray-600 mt-1">
              Acompanhe o status das execuções automáticas dos relatórios
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relatório
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Executado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinatários
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formato
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {executions.map((execution) => (
                  <tr key={execution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {execution.scheduleName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(execution.executedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {execution.status === 'success' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-green-800">Sucesso</span>
                          </>
                        )}
                        {execution.status === 'failed' && (
                          <>
                            <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm text-red-800">Falhou</span>
                          </>
                        )}
                        {execution.status === 'running' && (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                            <span className="text-sm text-blue-800">Executando</span>
                          </>
                        )}
                      </div>
                      {execution.error && (
                        <p className="text-xs text-red-600 mt-1">{execution.error}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{execution.recipients.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {execution.format.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {(showCreateModal || editingSchedule) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Relatório
                  </label>
                  <input
                    type="text"
                    value={editingSchedule?.name || newSchedule.name}
                    onChange={(e) => editingSchedule 
                      ? setEditingSchedule({...editingSchedule, name: e.target.value})
                      : setNewSchedule({...newSchedule, name: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Relatório Semanal de Auditorias"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={editingSchedule?.templateId || newSchedule.templateId}
                    onChange={(e) => editingSchedule 
                      ? setEditingSchedule({...editingSchedule, templateId: e.target.value})
                      : setNewSchedule({...newSchedule, templateId: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um template</option>
                    {availableTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editingSchedule?.description || newSchedule.description}
                  onChange={(e) => editingSchedule 
                    ? setEditingSchedule({...editingSchedule, description: e.target.value})
                    : setNewSchedule({...newSchedule, description: e.target.value})
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva o propósito deste relatório..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência
                  </label>
                  <select
                    value={editingSchedule?.frequency || newSchedule.frequency}
                    onChange={(e) => {
                      const frequency = e.target.value as any;
                      editingSchedule 
                        ? setEditingSchedule({...editingSchedule, frequency})
                        : setNewSchedule({...newSchedule, frequency});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="quarterly">Trimestral</option>
                  </select>
                </div>

                {((editingSchedule?.frequency || newSchedule.frequency) === 'weekly') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dia da Semana
                    </label>
                    <select
                      value={editingSchedule?.dayOfWeek || newSchedule.dayOfWeek}
                      onChange={(e) => {
                        const dayOfWeek = parseInt(e.target.value);
                        editingSchedule 
                          ? setEditingSchedule({...editingSchedule, dayOfWeek})
                          : setNewSchedule({...newSchedule, dayOfWeek});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {dayOfWeekLabels.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}

                {((editingSchedule?.frequency || newSchedule.frequency) === 'monthly') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dia do Mês
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={editingSchedule?.dayOfMonth || newSchedule.dayOfMonth}
                      onChange={(e) => {
                        const dayOfMonth = parseInt(e.target.value);
                        editingSchedule 
                          ? setEditingSchedule({...editingSchedule, dayOfMonth})
                          : setNewSchedule({...newSchedule, dayOfMonth});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={editingSchedule?.time || newSchedule.time}
                    onChange={(e) => editingSchedule 
                      ? setEditingSchedule({...editingSchedule, time: e.target.value})
                      : setNewSchedule({...newSchedule, time: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinatários
                </label>
                <div className="space-y-2">
                  {(editingSchedule?.recipients || newSchedule.recipients).map((recipient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) => editingSchedule 
                          ? setEditingSchedule({
                              ...editingSchedule, 
                              recipients: editingSchedule.recipients.map((r, i) => i === index ? e.target.value : r)
                            })
                          : updateRecipient(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email@empresa.com"
                      />
                      {(editingSchedule?.recipients || newSchedule.recipients).length > 1 && (
                        <button
                          onClick={() => editingSchedule 
                            ? setEditingSchedule({
                                ...editingSchedule, 
                                recipients: editingSchedule.recipients.filter((_, i) => i !== index)
                              })
                            : removeRecipient(index)
                          }
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => editingSchedule 
                      ? setEditingSchedule({
                          ...editingSchedule, 
                          recipients: [...editingSchedule.recipients, '']
                        })
                      : addRecipient()
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Adicionar destinatário
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSchedule(null);
                  resetNewSchedule();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingSchedule ? 'Atualizar' : 'Criar'} Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};