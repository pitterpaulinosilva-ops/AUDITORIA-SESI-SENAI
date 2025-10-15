import React, { useState, useEffect } from 'react';
import { useReportsStore } from '../../stores/reportsStore';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { TrendChart } from '../../components/reports/TrendChart';
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  Copy, 
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Filter,
  Download,
  Layers,
  Grid3X3,
  MousePointer
} from 'lucide-react';

interface CustomReportTemplate {
  id: string;
  name: string;
  description: string;
  components: ReportComponent[];
  filters: any;
  createdAt: string;
  updatedAt: string;
}

interface ReportComponent {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'text';
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

export const CustomReports: React.FC = () => {
  const { exportReport, isLoading } = useReportsStore();
  
  const [templates, setTemplates] = useState<CustomReportTemplate[]>([
    {
      id: '1',
      name: 'Relatório Executivo',
      description: 'Visão geral das métricas principais para executivos',
      components: [
        {
          id: 'c1',
          type: 'metric',
          title: 'Total de Auditorias',
          config: { metric: 'total_audits', color: 'blue' },
          position: { x: 0, y: 0, w: 3, h: 2 }
        },
        {
          id: 'c2',
          type: 'chart',
          title: 'Tendência Mensal',
          config: { type: 'line', dataSource: 'audits_by_month' },
          position: { x: 3, y: 0, w: 6, h: 4 }
        }
      ],
      filters: {},
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Análise de Qualidade',
      description: 'Foco em métricas de qualidade e não conformidades',
      components: [
        {
          id: 'c3',
          type: 'chart',
          title: 'NCs por Severidade',
          config: { type: 'pie', dataSource: 'ncs_by_severity' },
          position: { x: 0, y: 0, w: 4, h: 4 }
        },
        {
          id: 'c4',
          type: 'table',
          title: 'Top 10 Não Conformidades',
          config: { dataSource: 'top_ncs', limit: 10 },
          position: { x: 4, y: 0, w: 5, h: 4 }
        }
      ],
      filters: {},
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<CustomReportTemplate | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

  // Componentes disponíveis para arrastar
  const availableComponents = [
    { type: 'metric', icon: BarChart3, label: 'Métrica', color: 'blue' },
    { type: 'chart', icon: LineChart, label: 'Gráfico', color: 'green' },
    { type: 'table', icon: Grid3X3, label: 'Tabela', color: 'purple' },
    { type: 'text', icon: Layers, label: 'Texto', color: 'gray' }
  ];

  // Dados simulados para preview
  const mockData = {
    total_audits: { value: 156, trend: 'up', change: '12%' },
    audits_by_month: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Auditorias',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    },
    ncs_by_severity: {
      labels: ['Crítica', 'Alta', 'Média', 'Baixa'],
      datasets: [{
        data: [8, 15, 25, 12],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e']
      }]
    },
    top_ncs: [
      { id: 1, description: 'Falha no processo de validação', severity: 'Alta', count: 5 },
      { id: 2, description: 'Documentação incompleta', severity: 'Média', count: 4 },
      { id: 3, description: 'Equipamento não calibrado', severity: 'Crítica', count: 3 }
    ]
  };

  const handleCreateTemplate = () => {
    const newTemplate: CustomReportTemplate = {
      id: Date.now().toString(),
      name: 'Novo Relatório',
      description: 'Descrição do relatório personalizado',
      components: [],
      filters: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsBuilderOpen(true);
  };

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      const updatedTemplates = templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...selectedTemplate, updatedAt: new Date().toISOString() }
          : t
      );
      setTemplates(updatedTemplates);
      setIsBuilderOpen(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      setIsBuilderOpen(false);
    }
  };

  const handleDuplicateTemplate = (template: CustomReportTemplate) => {
    const duplicated: CustomReportTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTemplates([...templates, duplicated]);
  };

  const handlePreview = (template: CustomReportTemplate) => {
    setSelectedTemplate(template);
    setPreviewData(mockData);
  };

  const handleExport = (template: CustomReportTemplate, format: 'pdf' | 'excel', options: any) => {
    exportReport({
      format,
      includeCharts: options.includeCharts,
      includeDetails: options.includeRawData,
      fileName: options.fileName || `custom-report-${new Date().toISOString().split('T')[0]}`
    }, {
      periodStart: new Date(),
      periodEnd: new Date(),
      auditType: 'all',
      auditorName: '',
      auditedSector: '',
      auditedProcess: '',
      auditedSubprocess: ''
    });
  };

  const renderComponent = (component: ReportComponent) => {
    const data = mockData[component.config.dataSource as keyof typeof mockData];
    
    switch (component.type) {
      case 'metric':
        const metricData = data as any;
        return (
          <div className="bg-white p-4 rounded-lg border h-full flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{component.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{metricData?.value || '0'}</span>
              {metricData?.trend && (
                <span className={`text-sm ${metricData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metricData.change}
                </span>
              )}
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="bg-white p-4 rounded-lg border h-full">
            <h3 className="text-sm font-medium text-gray-900 mb-4">{component.title}</h3>
            <div className="h-48">
              <TrendChart
                title={component.title}
                data={data as any}
                type={component.config.type}
                height={180}
              />
            </div>
          </div>
        );
      
      case 'table':
        const tableData = data as any[];
        return (
          <div className="bg-white p-4 rounded-lg border h-full">
            <h3 className="text-sm font-medium text-gray-900 mb-4">{component.title}</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-left py-2">Severidade</th>
                    <th className="text-left py-2">Ocorrências</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.slice(0, component.config.limit || 5).map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{row.description}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.severity === 'Crítica' ? 'bg-red-100 text-red-800' :
                          row.severity === 'Alta' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="py-2">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="bg-white p-4 rounded-lg border h-full">
            <h3 className="text-sm font-medium text-gray-900 mb-2">{component.title}</h3>
            <p className="text-sm text-gray-600">
              Componente de texto personalizado. Adicione seu conteúdo aqui.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Customizados</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie relatórios personalizados com construtor drag-and-drop
          </p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Relatório</span>
        </button>
      </div>

      {!isBuilderOpen ? (
        /* Lista de Templates */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePreview(template)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Componentes:</span>
                  <span className="font-medium">{template.components.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Atualizado:</span>
                  <span className="font-medium">
                    {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsBuilderOpen(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Editar
                </button>
                <ReportFilters
                  onExport={(format, options) => handleExport(template, format, options)}
                  showExport={true}
                  isLoading={isLoading}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Construtor de Relatórios */
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedTemplate?.name || 'Novo Relatório'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Arraste componentes da barra lateral para construir seu relatório
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-96">
            {/* Barra lateral de componentes */}
            <div className="w-64 border-r border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Componentes</h3>
              <div className="space-y-2">
                {availableComponents.map((comp) => (
                  <div
                    key={comp.type}
                    draggable
                    onDragStart={() => setDraggedComponent(comp.type)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed border-${comp.color}-200 hover:border-${comp.color}-400 cursor-move transition-colors`}
                  >
                    <comp.icon className={`w-5 h-5 text-${comp.color}-600`} />
                    <span className="text-sm font-medium text-gray-700">{comp.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Área de construção */}
            <div className="flex-1 p-4">
              <div 
                className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedComponent && selectedTemplate) {
                    const newComponent: ReportComponent = {
                      id: Date.now().toString(),
                      type: draggedComponent as any,
                      title: `Novo ${draggedComponent}`,
                      config: {},
                      position: { x: 0, y: 0, w: 4, h: 3 }
                    };
                    
                    setSelectedTemplate({
                      ...selectedTemplate,
                      components: [...selectedTemplate.components, newComponent]
                    });
                    setDraggedComponent(null);
                  }
                }}
              >
                {selectedTemplate?.components.length === 0 ? (
                  <div className="text-center">
                    <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Arraste componentes da barra lateral para começar
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full grid grid-cols-12 gap-4">
                    {selectedTemplate?.components.map((component) => (
                      <div
                        key={component.id}
                        className={`col-span-${component.position.w} row-span-${component.position.h}`}
                      >
                        {renderComponent(component)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Preview */}
      {previewData && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Preview: {selectedTemplate.name}
                </h3>
                <button
                  onClick={() => {
                    setPreviewData(null);
                    setSelectedTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-12 gap-4">
                {selectedTemplate.components.map((component) => (
                  <div
                    key={component.id}
                    className={`col-span-${component.position.w}`}
                    style={{ minHeight: `${component.position.h * 100}px` }}
                  >
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};