import React, { useState } from 'react';
import { Users, Building2, GitBranch, Workflow, FileText, Plus, Edit2, Trash2, FileCheck, Search } from 'lucide-react';
import { useAuditProStore } from '../store';

// Tipos para os dados
interface Auditor {
  id: number;
  name: string;
  email: string;
  leader: boolean;
  role: string;
}

interface Sector {
  id: number;
  name: string;
}

interface Subprocess {
  id: number;
  name: string;
  sector: string;
}

interface Process {
  id: number;
  name: string;
  sector: string;
}

interface AuditType {
  id: number;
  name: string;
  description: string;
}

type TabType = 'auditores' | 'setores' | 'subprocessos' | 'processos' | 'tipos';

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('auditores');
  const [searchTerm, setSearchTerm] = useState('');

  // Usar o store para obter dados e funções
  const {
    auditors,
    sectors,
    subprocesses,
    processes,
    auditTypes,
    addAuditor,
    updateAuditor,
    deleteAuditor,
    addSector,
    updateSector,
    deleteSector,
    addSubprocess,
    updateSubprocess,
    deleteSubprocess,
    addProcess,
    updateProcess,
    deleteProcess,
    addAuditType,
    updateAuditType,
    deleteAuditType,
    getSubprocessesBySector,
    getProcessesBySector
  } = useAuditProStore();

  // Estados para os formulários
  const [auditorForm, setAuditorForm] = useState({ name: '', email: '', leader: false });
  const [sectorForm, setSectorForm] = useState({ name: '' });
  const [subprocessForm, setSubprocessForm] = useState({ name: '', sector: '' });
  const [processForm, setProcessForm] = useState({ name: '', sector: '' });
  const [auditTypeForm, setAuditTypeForm] = useState({ name: '', description: '' });

  // Estados para edição
  const [editingAuditor, setEditingAuditor] = useState<number | null>(null);
  const [editingSector, setEditingSector] = useState<number | null>(null);
  const [editingSubprocess, setEditingSubprocess] = useState<number | null>(null);
  const [editingProcess, setEditingProcess] = useState<number | null>(null);
  const [editingAuditType, setEditingAuditType] = useState<number | null>(null);

  // Funções para Auditores
  const handleAddAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (auditorForm.name && auditorForm.email) {
      addAuditor({
        name: auditorForm.name,
        email: auditorForm.email,
        leader: auditorForm.leader,
        role: auditorForm.leader ? 'Auditor Líder' : 'Auditor'
      });
      setAuditorForm({ name: '', email: '', leader: false });
    }
  };

  const handleEditAuditor = (auditor: Auditor) => {
    setEditingAuditor(auditor.id);
    setAuditorForm({
      name: auditor.name,
      email: auditor.email,
      leader: auditor.leader
    });
  };

  const handleUpdateAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuditor && auditorForm.name && auditorForm.email) {
      updateAuditor(editingAuditor, {
        name: auditorForm.name,
        email: auditorForm.email,
        leader: auditorForm.leader,
        role: auditorForm.leader ? 'Auditor Líder' : 'Auditor'
      });
      setEditingAuditor(null);
      setAuditorForm({ name: '', email: '', leader: false });
    }
  };

  const handleDeleteAuditor = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este auditor?')) {
      deleteAuditor(id);
    }
  };

  // Funções para Setores
  const handleAddSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (sectorForm.name) {
      addSector({ name: sectorForm.name });
      setSectorForm({ name: '' });
    }
  };

  const handleEditSector = (sector: Sector) => {
    setEditingSector(sector.id);
    setSectorForm({ name: sector.name });
  };

  const handleUpdateSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSector && sectorForm.name) {
      updateSector(editingSector, { name: sectorForm.name });
      setEditingSector(null);
      setSectorForm({ name: '' });
    }
  };

  const handleDeleteSector = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este setor? Todos os subprocessos e processos relacionados também serão removidos.')) {
      deleteSector(id);
    }
  };

  // Funções para Subprocessos
  const handleAddSubprocess = (e: React.FormEvent) => {
    e.preventDefault();
    if (subprocessForm.name && subprocessForm.sector) {
      addSubprocess({
        name: subprocessForm.name,
        sector: subprocessForm.sector
      });
      setSubprocessForm({ name: '', sector: '' });
    }
  };

  const handleEditSubprocess = (subprocess: Subprocess) => {
    setEditingSubprocess(subprocess.id);
    setSubprocessForm({
      name: subprocess.name,
      sector: subprocess.sector
    });
  };

  const handleUpdateSubprocess = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubprocess && subprocessForm.name && subprocessForm.sector) {
      updateSubprocess(editingSubprocess, {
        name: subprocessForm.name,
        sector: subprocessForm.sector
      });
      setEditingSubprocess(null);
      setSubprocessForm({ name: '', sector: '' });
    }
  };

  const handleDeleteSubprocess = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este subprocesso?')) {
      deleteSubprocess(id);
    }
  };

  // Funções para Processos
  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (processForm.name && processForm.sector) {
      addProcess({
        name: processForm.name,
        sector: processForm.sector
      });
      setProcessForm({ name: '', sector: '' });
    }
  };

  const handleEditProcess = (process: Process) => {
    setEditingProcess(process.id);
    setProcessForm({
      name: process.name,
      sector: process.sector
    });
  };

  const handleUpdateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProcess && processForm.name && processForm.sector) {
      updateProcess(editingProcess, {
        name: processForm.name,
        sector: processForm.sector
      });
      setEditingProcess(null);
      setProcessForm({ name: '', sector: '' });
    }
  };

  const handleDeleteProcess = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este processo?')) {
      deleteProcess(id);
    }
  };

  // Funções para Tipos de Auditoria
  const handleAddAuditType = (e: React.FormEvent) => {
    e.preventDefault();
    if (auditTypeForm.name && auditTypeForm.description) {
      addAuditType({
        name: auditTypeForm.name,
        description: auditTypeForm.description
      });
      setAuditTypeForm({ name: '', description: '' });
    }
  };

  const handleEditAuditType = (auditType: AuditType) => {
    setEditingAuditType(auditType.id);
    setAuditTypeForm({
      name: auditType.name,
      description: auditType.description
    });
  };

  const handleUpdateAuditType = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuditType && auditTypeForm.name && auditTypeForm.description) {
      updateAuditType(editingAuditType, {
        name: auditTypeForm.name,
        description: auditTypeForm.description
      });
      setEditingAuditType(null);
      setAuditTypeForm({ name: '', description: '' });
    }
  };

  const handleDeleteAuditType = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tipo de auditoria?')) {
      deleteAuditType(id);
    }
  };

  // Função para filtrar dados baseado na busca
  const filterData = (data: any[], searchFields: string[]) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const tabs = [
    { id: 'auditores', label: 'Auditores', icon: Users, count: auditors.length },
    { id: 'setores', label: 'Setores', icon: Building2, count: sectors.length },
    { id: 'subprocessos', label: 'Subprocessos', icon: GitBranch, count: subprocesses.length },
    { id: 'processos', label: 'Processos', icon: Workflow, count: processes.length },
    { id: 'tipos', label: 'Tipos de Auditoria', icon: FileCheck, count: auditTypes.length }
  ];

  const renderAuditorsTab = () => (
    <div className="space-y-6">
      {/* Formulário de Cadastro/Edição */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingAuditor ? 'Editar Auditor' : 'Cadastrar Auditor'}
        </h3>
        <form onSubmit={editingAuditor ? handleUpdateAuditor : handleAddAuditor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={auditorForm.name}
              onChange={(e) => setAuditorForm({ ...auditorForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={auditorForm.email}
              onChange={(e) => setAuditorForm({ ...auditorForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={auditorForm.leader}
                onChange={(e) => setAuditorForm({ ...auditorForm, leader: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Auditor Líder</span>
            </label>
            <button
              type="submit"
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{editingAuditor ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingAuditor && (
              <button
                type="button"
                onClick={() => {
                  setEditingAuditor(null);
                  setAuditorForm({ name: '', email: '', leader: false });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Auditores */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Auditores Cadastrados ({auditors.length})</h3>
        </div>
        {auditors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum auditor cadastrado ainda.</p>
            <p className="text-sm">Adicione o primeiro auditor usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterData(auditors, ['name', 'email', 'role']).map((auditor) => (
                  <tr key={auditor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{auditor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{auditor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        auditor.leader 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {auditor.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditAuditor(auditor)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAuditor(auditor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderSectorsTab = () => (
    <div className="space-y-6">
      {/* Formulário de Cadastro/Edição */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingSector ? 'Editar Setor' : 'Cadastrar Setor'}
        </h3>
        <form onSubmit={editingSector ? handleUpdateSector : handleAddSector} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Setor</label>
            <input
              type="text"
              value={sectorForm.name}
              onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{editingSector ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingSector && (
              <button
                type="button"
                onClick={() => {
                  setEditingSector(null);
                  setSectorForm({ name: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Setores */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Setores Cadastrados ({sectors.length})</h3>
        </div>
        {sectors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum setor cadastrado ainda.</p>
            <p className="text-sm">Adicione o primeiro setor usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subprocessos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processos</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterData(sectors, ['name']).map((sector) => (
                  <tr key={sector.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sector.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getSubprocessesBySector(sector.name).length} subprocessos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getProcessesBySector(sector.name).length} processos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditSector(sector)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSector(sector.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubprocessesTab = () => (
    <div className="space-y-6">
      {/* Formulário de Cadastro/Edição */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingSubprocess ? 'Editar Subprocesso' : 'Cadastrar Subprocesso'}
        </h3>
        <form onSubmit={editingSubprocess ? handleUpdateSubprocess : handleAddSubprocess} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Subprocesso</label>
            <input
              type="text"
              value={subprocessForm.name}
              onChange={(e) => setSubprocessForm({ ...subprocessForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
            <select
              value={subprocessForm.sector}
              onChange={(e) => setSubprocessForm({ ...subprocessForm, sector: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um setor</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.name}>{sector.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{editingSubprocess ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingSubprocess && (
              <button
                type="button"
                onClick={() => {
                  setEditingSubprocess(null);
                  setSubprocessForm({ name: '', sector: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Subprocessos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Subprocessos Cadastrados ({subprocesses.length})</h3>
        </div>
        {subprocesses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum subprocesso cadastrado ainda.</p>
            <p className="text-sm">Adicione o primeiro subprocesso usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterData(subprocesses, ['name', 'sector']).map((subprocess) => (
                  <tr key={subprocess.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{subprocess.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{subprocess.sector}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditSubprocess(subprocess)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubprocess(subprocess.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderProcessesTab = () => (
    <div className="space-y-6">
      {/* Formulário de Cadastro/Edição */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingProcess ? 'Editar Processo' : 'Cadastrar Processo'}
        </h3>
        <form onSubmit={editingProcess ? handleUpdateProcess : handleAddProcess} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Processo</label>
            <input
              type="text"
              value={processForm.name}
              onChange={(e) => setProcessForm({ ...processForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
            <select
              value={processForm.sector}
              onChange={(e) => setProcessForm({ ...processForm, sector: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um setor</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.name}>{sector.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{editingProcess ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingProcess && (
              <button
                type="button"
                onClick={() => {
                  setEditingProcess(null);
                  setProcessForm({ name: '', sector: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Processos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Processos Cadastrados ({processes.length})</h3>
        </div>
        {processes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum processo cadastrado ainda.</p>
            <p className="text-sm">Adicione o primeiro processo usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterData(processes, ['name', 'sector']).map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{process.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{process.sector}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProcess(process)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProcess(process.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderAuditTypesTab = () => (
    <div className="space-y-6">
      {/* Formulário de Cadastro/Edição */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingAuditType ? 'Editar Tipo de Auditoria' : 'Cadastrar Tipo de Auditoria'}
        </h3>
        <form onSubmit={editingAuditType ? handleUpdateAuditType : handleAddAuditType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={auditTypeForm.name}
              onChange={(e) => setAuditTypeForm({ ...auditTypeForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              type="text"
              value={auditTypeForm.description}
              onChange={(e) => setAuditTypeForm({ ...auditTypeForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{editingAuditType ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingAuditType && (
              <button
                type="button"
                onClick={() => {
                  setEditingAuditType(null);
                  setAuditTypeForm({ name: '', description: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Tipos de Auditoria */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Tipos de Auditoria Cadastrados ({auditTypes.length})</h3>
        </div>
        {auditTypes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum tipo de auditoria cadastrado ainda.</p>
            <p className="text-sm">Adicione o primeiro tipo usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterData(auditTypes, ['name', 'description']).map((auditType) => (
                  <tr key={auditType.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{auditType.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={auditType.description}>
                        {auditType.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditAuditType(auditType)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAuditType(auditType.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Função para renderizar o conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'auditores':
        return renderAuditorsTab();
      case 'setores':
        return renderSectorsTab();
      case 'subprocessos':
        return renderSubprocessesTab();
      case 'processos':
        return renderProcessesTab();
      case 'tipos':
        return renderAuditTypesTab();
      default:
        return renderAuditorsTab();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Gerenciar dados mestres do sistema</p>
      </div>

      {/* Sistema de Abas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo da Aba */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}