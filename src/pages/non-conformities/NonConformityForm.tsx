import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function NonConformityForm() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/non-conformities')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Nova Não Conformidade
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          Formulário de não conformidade em desenvolvimento...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          As não conformidades são criadas automaticamente durante a execução das auditorias.
        </p>
      </div>
    </div>
  )
}