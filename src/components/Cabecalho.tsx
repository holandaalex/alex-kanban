import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useKanban } from '../contexts/KanbanContext';
import AdicionarColunaModal from './modais/AdicionarColunaModal';

/**
 * Componente de cabeçalho da aplicação
 * Contém o título do quadro e botões de ação principal
 */
const Cabecalho: React.FC = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const { adicionarColuna } = useKanban();

  /**
   * Abre o modal para adicionar nova coluna
   */
  const abrirModal = () => setModalAberto(true);
  
  /**
   * Fecha o modal de adicionar coluna
   */
  const fecharModal = () => setModalAberto(false);
  
  /**
   * Adiciona nova coluna e fecha o modal
   */
  const confirmarAdicao = (titulo: string) => {
    adicionarColuna(titulo);
    fecharModal();
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alex Kanban</h1>
        
        <button
          onClick={abrirModal}
          className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md 
                     flex items-center gap-2 transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Nova Coluna</span>
        </button>
        
        {modalAberto && (
          <AdicionarColunaModal
            onConfirmar={confirmarAdicao}
            onCancelar={fecharModal}
          />
        )}
      </div>
    </header>
  );
};

export default Cabecalho;