import React, { useState } from 'react';
import Modal from './Modal';

interface AdicionarColunaModalProps {
  onConfirmar: (titulo: string) => void;
  onCancelar: () => void;
}

/**
 * Modal para adicionar uma nova coluna
 */
const AdicionarColunaModal: React.FC<AdicionarColunaModalProps> = ({
  onConfirmar,
  onCancelar,
}) => {
  const [titulo, setTitulo] = useState('');
  const [erro, setErro] = useState('');

  /**
   * Atualiza o título da coluna
   */
  const handleChangeTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(e.target.value);
    if (erro) setErro('');
  };

  /**
   * Valida e submete o formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!titulo.trim()) {
      setErro('O título da coluna é obrigatório');
      return;
    }
    
    onConfirmar(titulo.trim());
  };

  return (
    <Modal titulo="Adicionar Nova Coluna" onFechar={onCancelar}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título da Coluna
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={handleChangeTitulo}
            className={`w-full px-3 py-2 border rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${erro ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ex: Em Análise"
            autoFocus
          />
          {erro && <p className="mt-1 text-sm text-red-500">{erro}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdicionarColunaModal;