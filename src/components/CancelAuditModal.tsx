import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  auditTitle: string;
  isLoading?: boolean;
}

export const CancelAuditModal: React.FC<CancelAuditModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  auditTitle,
  isLoading = false
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de texto mínimo de 20 caracteres
    if (reason.trim().length < 20) {
      setError('O motivo deve ter pelo menos 20 caracteres.');
      return;
    }

    setError('');
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (error && e.target.value.trim().length >= 20) {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Cancelar Auditoria
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Você está prestes a cancelar a auditoria:
            </p>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg mb-4">
              {auditTitle}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Por favor, informe o motivo do cancelamento. Esta ação será registrada com data e hora para fins de rastreabilidade.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do cancelamento *
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={handleReasonChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={4}
                placeholder="Descreva o motivo do cancelamento (mínimo 20 caracteres)..."
                required
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${reason.length < 20 ? 'text-red-500' : 'text-green-600'}`}>
                  {reason.length}/20 caracteres mínimos
                </span>
                {error && (
                  <span className="text-xs text-red-500">{error}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || reason.trim().length < 20}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 border border-transparent rounded-md hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};