import React from 'react';
import Modal from './Modal';

interface ConfirmacaoModalProps {
  titulo: string;
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Modal de confirmação para ações destrutivas
 */
const ConfirmacaoModal: React.FC<ConfirmacaoModalProps> = ({
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
}) => {
  return (
    <Modal titulo={titulo} onFechar={onCancelar}>
      <div className="mb-6">
        <p className="text-gray-700">{mensagem}</p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmacaoModal;