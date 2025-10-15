import React, { useState } from 'react'
import { X, ZoomIn, Download, Calendar, MapPin, User, FileText, Camera, Video, Mic, File } from 'lucide-react'
import { Evidence, EvidenceType } from '../../types'

interface EvidenceGalleryProps {
  evidences: Evidence[]
  onClose: () => void
  title?: string
}

export function EvidenceGallery({ evidences, onClose, title = 'Evidências' }: EvidenceGalleryProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const getEvidenceIcon = (type: EvidenceType) => {
    switch (type) {
      case 'photo':
        return <Camera className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'audio':
        return <Mic className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      case 'note':
        return <File className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const getEvidenceTypeLabel = (type: EvidenceType) => {
    switch (type) {
      case 'photo':
        return 'Foto'
      case 'video':
        return 'Vídeo'
      case 'audio':
        return 'Áudio'
      case 'document':
        return 'Documento'
      case 'note':
        return 'Anotação'
      default:
        return 'Arquivo'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleEvidenceClick = (evidence: Evidence, index: number) => {
    setSelectedEvidence(evidence)
    setCurrentIndex(index)
  }

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : evidences.length - 1
    setCurrentIndex(newIndex)
    setSelectedEvidence(evidences[newIndex])
  }

  const handleNext = () => {
    const newIndex = currentIndex < evidences.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setSelectedEvidence(evidences[newIndex])
  }

  const handleDownload = (evidence: Evidence) => {
    if (evidence.filePath) {
      // Simular download - em produção, implementar download real
      console.log('Downloading evidence:', evidence.fileName || evidence.title)
      // window.open(evidence.filePath, '_blank')
    }
  }

  const renderEvidencePreview = (evidence: Evidence) => {
    if (evidence.type === 'photo' && evidence.filePath) {
      return (
        <img
          src={evidence.thumbnailPath || evidence.filePath}
          alt={evidence.title}
          className="w-full h-32 object-cover rounded-lg"
        />
      )
    }

    return (
      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            {getEvidenceIcon(evidence.type)}
          </div>
          <span className="text-sm text-gray-600">
            {getEvidenceTypeLabel(evidence.type)}
          </span>
        </div>
      </div>
    )
  }

  const renderFullEvidence = (evidence: Evidence) => {
    if (evidence.type === 'photo' && evidence.filePath) {
      return (
        <img
          src={evidence.filePath}
          alt={evidence.title}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      )
    }

    if (evidence.type === 'video' && evidence.filePath) {
      return (
        <video
          src={evidence.filePath}
          controls
          className="max-w-full max-h-96 rounded-lg"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      )
    }

    if (evidence.type === 'audio' && evidence.filePath) {
      return (
        <audio
          src={evidence.filePath}
          controls
          className="w-full"
        >
          Seu navegador não suporta o elemento de áudio.
        </audio>
      )
    }

    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <div className="text-gray-400 mb-4">
          {getEvidenceIcon(evidence.type)}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {evidence.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {getEvidenceTypeLabel(evidence.type)}
        </p>
        {evidence.fileName && (
          <p className="text-sm text-gray-500 mb-2">
            {evidence.fileName}
          </p>
        )}
        {evidence.fileSize && (
          <p className="text-sm text-gray-500">
            {formatFileSize(evidence.fileSize)}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Gallery Grid */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-4">
              {evidences.map((evidence, index) => (
                <div
                  key={evidence.id}
                  onClick={() => handleEvidenceClick(evidence, index)}
                  className={`cursor-pointer border-2 rounded-lg p-3 transition-all hover:shadow-md ${
                    selectedEvidence?.id === evidence.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {renderEvidencePreview(evidence)}
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {evidence.title}
                    </h4>
                    
                    {evidence.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {evidence.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {getEvidenceIcon(evidence.type)}
                        {getEvidenceTypeLabel(evidence.type)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(evidence.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Viewer */}
          <div className="flex-1 flex flex-col">
            {selectedEvidence ? (
              <>
                {/* Evidence Display */}
                <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
                  {renderFullEvidence(selectedEvidence)}
                </div>

                {/* Evidence Details */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedEvidence.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevious}
                        disabled={evidences.length <= 1}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} de {evidences.length}
                      </span>
                      <button
                        onClick={handleNext}
                        disabled={evidences.length <= 1}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                      
                      {selectedEvidence.filePath && (
                        <button
                          onClick={() => handleDownload(selectedEvidence)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedEvidence.description && (
                    <p className="text-gray-700 mb-4">
                      {selectedEvidence.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{selectedEvidence.capturedBy}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedEvidence.createdAt)}</span>
                    </div>
                    
                    {selectedEvidence.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvidence.location}</span>
                      </div>
                    )}
                    
                    {selectedEvidence.fileSize && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <File className="w-4 h-4" />
                        <span>{formatFileSize(selectedEvidence.fileSize)}</span>
                      </div>
                    )}
                  </div>

                  {selectedEvidence.tags && selectedEvidence.tags.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvidence.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ZoomIn className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Selecione uma evidência para visualizar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}