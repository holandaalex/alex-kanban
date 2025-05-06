import React, { useState } from 'react';
import Modal from './Modal';
import { Cartao } from '../../types';

interface EditarCartaoModalProps {
  cartao: Cartao;
  onConfirmar: (cartao: Cartao) => void;
  onCancelar: () => void;
}

/**
 * Modal para editar um cartão existente
 */
const EditarCartaoModal: React.FC<EditarCartaoModalProps> = ({
  cartao,
  onConfirmar,
  onCancelar,
}) => {
  const [titulo, setTitulo] = useState(cartao.titulo);
  const [descricao, setDescricao] = useState(cartao.descricao);
  const [cor, setCor] = useState(cartao.cor);
  const [erro, setErro] = useState('');

  /**
   * Atualiza o título do cartão
   */
  const handleChangeTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(e.target.value);
    if (erro) setErro('');
  };

  /**
   * Atualiza a descrição do cartão
   */
  const handleChangeDescricao = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescricao(e.target.value);
  };

  /**
   * Atualiza a cor do cartão
   */
  const handleChangeCor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCor(e.target.value);
  };

  /**
   * Valida e submete o formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!titulo.trim()) {
      setErro('O título do cartão é obrigatório');
      return;
    }
    
    onConfirmar({
      ...cartao,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      cor,
    });
  };

  // Lista de cores predefinidas
  const coresPredefinidas = [
    '#EF4444', // Vermelho
    '#F97316', // Laranja
    '#F59E0B', // Amarelo
    '#10B981', // Verde
    '#3B82F6', // Azul
    '#8B5CF6', // Roxo
    '#EC4899', // Rosa
    '#6B7280', // Cinza
  ];

  return (
    <Modal titulo="Editar Cartão" onFechar={onCancelar}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={handleChangeTitulo}
            className={`w-full px-3 py-2 border rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${erro ? 'border-red-500' : 'border-gray-300'}`}
            autoFocus
          />
          {erro && <p className="mt-1 text-sm text-red-500">{erro}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={handleChangeDescricao}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor do Cartão
          </label>
          <div className="flex items-center mb-2">
            <input
              type="color"
              value={cor}
              onChange={handleChangeCor}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-600">{cor}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {coresPredefinidas.map((corPredefinida) => (
              <button
                key={corPredefinida}
                type="button"
                onClick={() => setCor(corPredefinida)}
                className="w-8 h-8 rounded-full border border-gray-300"
                style={{ backgroundColor: corPredefinida }}
                title={corPredefinida}
              />
            ))}
          </div>
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
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarCartaoModal;