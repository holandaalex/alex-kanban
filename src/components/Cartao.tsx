import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Cartao as CartaoType } from '../types';
import { useKanban } from '../contexts/KanbanContext';
import { formatarData, truncarTexto } from '../utils/helpers';
import EditarCartaoModal from './modais/EditarCartaoModal';
import ConfirmacaoModal from './modais/ConfirmacaoModal';

interface CartaoProps {
  cartao: CartaoType;
  colunaId: string;
  indice: number;
  onIniciarArrasto: (colunaId: string, cartaoId: string, indice: number) => void;
  estaArrastando: boolean;
}

/**
 * Componente que renderiza um cartão no quadro Kanban
 */
const Cartao: React.FC<CartaoProps> = ({
  cartao,
  colunaId,
  indice,
  onIniciarArrasto,
  estaArrastando,
}) => {
  const { editarCartao, removerCartao } = useKanban();
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);

  /**
   * Alterna a exibição do menu de opções do cartão
   * @param e Evento do clique
   */
  const alternarMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAberto(!menuAberto);
  };

  /**
   * Inicia o arrasto do cartão
   * @param e Evento de arrasto
   */
  const iniciarArrasto = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', cartao.id);
    e.dataTransfer.effectAllowed = 'move';
    onIniciarArrasto(colunaId, cartao.id, indice);
  };

  /**
   * Abre o modal de edição do cartão
   */
  const abrirModalEditar = () => {
    setMenuAberto(false);
    setModalEditarAberto(true);
  };

  /**
   * Abre o modal de confirmação para remover o cartão
   */
  const abrirModalRemover = () => {
    setMenuAberto(false);
    setModalConfirmacaoAberto(true);
  };

  /**
   * Salva as alterações feitas no cartão
   */
  const salvarEdicaoCartao = (cartaoAtualizado: CartaoType) => {
    editarCartao(colunaId, cartaoAtualizado);
    setModalEditarAberto(false);
  };

  /**
   * Confirma a remoção do cartão
   */
  const confirmarRemocaoCartao = () => {
    removerCartao(colunaId, cartao.id);
    setModalConfirmacaoAberto(false);
  };

  return (
    <>
      <div
        className={`cartao bg-white p-3 rounded-md shadow-sm border border-gray-200 
                   cursor-grab relative ${estaArrastando ? 'opacity-50' : ''}`}
        draggable="true"
        onDragStart={iniciarArrasto}
        style={{ borderLeft: `3px solid ${cartao.cor}` }}
      >
        {/* Cabeçalho do cartão */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800">{truncarTexto(cartao.titulo, 50)}</h3>
          <button
            onClick={alternarMenu}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors -mt-1 -mr-1"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Descrição do cartão */}
        {cartao.descricao && (
          <p className="text-gray-600 text-sm mb-2">
            {truncarTexto(cartao.descricao, 100)}
          </p>
        )}

        {/* Rodapé do cartão */}
        <div className="text-xs text-gray-500 mt-2">
          Criado em: {formatarData(cartao.dataCriacao)}
        </div>

        {/* Menu de opções do cartão */}
        {menuAberto && (
          <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md z-10 w-40 py-1 border">
            <button
              onClick={abrirModalEditar}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              <Edit size={14} />
              <span>Editar</span>
            </button>
            <button
              onClick={abrirModalRemover}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
            >
              <Trash2 size={14} />
              <span>Remover</span>
            </button>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalEditarAberto && (
        <EditarCartaoModal
          cartao={cartao}
          onConfirmar={salvarEdicaoCartao}
          onCancelar={() => setModalEditarAberto(false)}
        />
      )}

      {modalConfirmacaoAberto && (
        <ConfirmacaoModal
          titulo="Remover Cartão"
          mensagem={`Tem certeza que deseja remover o cartão "${cartao.titulo}"?`}
          onConfirmar={confirmarRemocaoCartao}
          onCancelar={() => setModalConfirmacaoAberto(false)}
        />
      )}
    </>
  );
};

export default Cartao;