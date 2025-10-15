import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export function NonConformityDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

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
          Detalhes da Não Conformidade
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          Detalhes da não conformidade ID: {id}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Página de detalhes em desenvolvimento...
        </p>
      </div>
    </div>
  )
}