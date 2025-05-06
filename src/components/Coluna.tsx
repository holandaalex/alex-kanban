import React, { useState } from 'react';
import { MoreVertical, Plus, Trash2, Edit } from 'lucide-react';
import { Coluna as ColunaType, Cartao as CartaoType } from '../types';
import { useKanban } from '../contexts/KanbanContext';
import Cartao from './Cartao';
import AdicionarCartaoModal from './modais/AdicionarCartaoModal';
import EditarColunaModal from './modais/EditarColunaModal';
import ConfirmacaoModal from './modais/ConfirmacaoModal';

interface ColunaProps {
  coluna: ColunaType;
  onIniciarArrasto: (colunaId: string, cartaoId: string, indice: number) => void;
  onFinalizarArrasto: (colunaId: string, indice: number) => void;
  onPermitirArrasto: (e: React.DragOverEvent) => void;
  cartaoArrastadoId: string;
}

/**
 * Componente de coluna do quadro Kanban
 */
const Coluna: React.FC<ColunaProps> = ({
  coluna,
  onIniciarArrasto,
  onFinalizarArrasto,
  onPermitirArrasto,
  cartaoArrastadoId,
}) => {
  const { adicionarCartao, removerColuna, editarColuna } = useKanban();
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAdicionarCartao, setModalAdicionarCartao] = useState(false);
  const [modalEditarColuna, setModalEditarColuna] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);

  /**
   * Alterna a exibição do menu de opções da coluna
   */
  const alternarMenu = () => setMenuAberto(!menuAberto);

  /**
   * Manipula o soltar de um cartão nesta coluna
   */
  const aoSoltarCartao = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Calcula o índice de destino baseado na posição do mouse
    const indiceDestino = calcularIndiceDestino(e.clientY);
    onFinalizarArrasto(coluna.id, indiceDestino);
  };

  /**
   * Calcula o índice de destino com base na posição Y do mouse
   */
  const calcularIndiceDestino = (clientY: number): number => {
    // Obtém todos os cartões desta coluna
    const cartoesElementos = document.querySelectorAll(`[data-coluna-id="${coluna.id}"] .cartao`);
    
    // Se não tem cartões, o índice é 0
    if (cartoesElementos.length === 0) return 0;
    
    for (let i = 0; i < cartoesElementos.length; i++) {
      const cartao = cartoesElementos[i];
      const rect = cartao.getBoundingClientRect();
      const meioDoCartao = rect.top + rect.height / 2;
      
      // Se o cursor está acima do meio do cartão, coloca antes dele
      if (clientY < meioDoCartao) {
        return i;
      }
    }
    
    // Se chegou aqui, coloca no final da lista
    return cartoesElementos.length;
  };

  /**
   * Adiciona um novo cartão à coluna
   */
  const handleAdicionarCartao = (novoCartao: Omit<CartaoType, 'id' | 'dataCriacao'>) => {
    adicionarCartao(coluna.id, novoCartao);
    setModalAdicionarCartao(false);
  };

  /**
   * Confirma remoção da coluna
   */
  const confirmarRemocaoColuna = () => {
    removerColuna(coluna.id);
    setModalConfirmacao(false);
  };

  /**
   * Salva alterações na coluna
   */
  const salvarEdicaoColuna = (titulo: string, cor: string) => {
    editarColuna(coluna.id, titulo, cor);
    setModalEditarColuna(false);
  };

  return (
    <div 
      className="bg-gray-100 rounded-lg shadow-sm flex-shrink-0 w-full md:w-80 max-h-full flex flex-col"
      style={{ borderTop: `3px solid ${coluna.cor}` }}
      onDragOver={onPermitirArrasto}
      onDrop={aoSoltarCartao}
      data-coluna-id={coluna.id}
    >
      {/* Cabeçalho da coluna */}
      <div className="p-3 bg-white rounded-t-lg border-b flex items-center justify-between">
        <h2 className="font-medium text-gray-700 truncate" style={{ color: coluna.cor }}>
          {coluna.titulo}
        </h2>
        <div className="relative">
          <button
            onClick={alternarMenu}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>
          
          {/* Menu de opções da coluna */}
          {menuAberto && (
            <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md z-10 w-48 py-1 border">
              <button
                onClick={() => {
                  setMenuAberto(false);
                  setModalAdicionarCartao(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Adicionar Cartão</span>
              </button>
              <button
                onClick={() => {
                  setMenuAberto(false);
                  setModalEditarColuna(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit size={16} />
                <span>Editar Coluna</span>
              </button>
              <button
                onClick={() => {
                  setMenuAberto(false);
                  setModalConfirmacao(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>Remover Coluna</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de cartões */}
      <div className="flex-grow p-2 overflow-y-auto flex flex-col gap-2">
        {coluna.cartoes.map((cartao, indice) => (
          <Cartao
            key={cartao.id}
            cartao={cartao}
            colunaId={coluna.id}
            indice={indice}
            onIniciarArrasto={onIniciarArrasto}
            estaArrastando={cartao.id === cartaoArrastadoId}
          />
        ))}
        
        {coluna.cartoes.length === 0 && (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-400 my-2"
            style={{ minHeight: '80px' }}
          >
            Arraste um cartão para aqui ou adicione um novo
          </div>
        )}
      </div>

      {/* Botão para adicionar cartão */}
      <div className="p-2 border-t bg-gray-50">
        <button
          onClick={() => setModalAdicionarCartao(true)}
          className="w-full py-2 flex items-center justify-center gap-2 text-gray-600 
                    hover:bg-gray-200 rounded-md transition-colors"
        >
          <Plus size={18} />
          <span>Adicionar Cartão</span>
        </button>
      </div>

      {/* Modais */}
      {modalAdicionarCartao && (
        <AdicionarCartaoModal
          onConfirmar={handleAdicionarCartao}
          onCancelar={() => setModalAdicionarCartao(false)}
        />
      )}
      
      {modalEditarColuna && (
        <EditarColunaModal
          coluna={coluna}
          onConfirmar={salvarEdicaoColuna}
          onCancelar={() => setModalEditarColuna(false)}
        />
      )}
      
      {modalConfirmacao && (
        <ConfirmacaoModal
          titulo="Remover Coluna"
          mensagem={`Tem certeza que deseja remover a coluna "${coluna.titulo}" e todos os seus cartões?`}
          onConfirmar={confirmarRemocaoColuna}
          onCancelar={() => setModalConfirmacao(false)}
        />
      )}
    </div>
  );
};

export default Coluna;