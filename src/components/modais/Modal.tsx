import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}

/**
 * Componente base para modais
 * Fornece estrutura comum para todos os modais da aplicação
 */
const Modal: React.FC<ModalProps> = ({ titulo, onFechar, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * Fecha o modal se clicar fora dele
   */
  useEffect(() => {
    const fecharAoClicarFora = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onFechar();
      }
    };

    const fecharAoApertarEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onFechar();
      }
    };

    // Adiciona listeners
    document.addEventListener('mousedown', fecharAoClicarFora);
    document.addEventListener('keydown', fecharAoApertarEsc);

    // Remove listeners ao desmontar
    return () => {
      document.removeEventListener('mousedown', fecharAoClicarFora);
      document.removeEventListener('keydown', fecharAoApertarEsc);
    };
  }, [onFechar]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">{titulo}</h3>
          <button
            onClick={onFechar}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;