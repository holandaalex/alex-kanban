/**
 * Arquivo de definições de tipos utilizados no projeto
 */

/**
 * Representa um cartão no quadro Kanban
 */
export interface Cartao {
  id: string;
  titulo: string;
  descricao: string;
  cor: string;
  dataCriacao: string;
}

/**
 * Representa uma coluna do quadro Kanban
 */
export interface Coluna {
  id: string;
  titulo: string;
  cartoes: Cartao[];
  cor: string;
}

/**
 * Representa o estado completo do quadro Kanban
 */
export interface EstadoKanban {
  colunas: Coluna[];
}

/**
 * Tipo para o contexto do Kanban
 */
export interface ContextoKanban {
  estado: EstadoKanban;
  adicionarColuna: (titulo: string) => void;
  editarColuna: (id: string, titulo: string, cor: string) => void;
  removerColuna: (id: string) => void;
  adicionarCartao: (colunaId: string, cartao: Omit<Cartao, 'id' | 'dataCriacao'>) => void;
  editarCartao: (colunaId: string, cartaoAtualizado: Cartao) => void;
  removerCartao: (colunaId: string, cartaoId: string) => void;
  moverCartao: (origem: { colunaId: string; indice: number }, destino: { colunaId: string; indice: number }) => void;
}

/**
 * Tipo de ações para o reducer do Kanban
 */
export type AcaoKanban =
  | { tipo: 'ADICIONAR_COLUNA'; payload: { titulo: string } }
  | { tipo: 'EDITAR_COLUNA'; payload: { id: string; titulo: string; cor: string } }
  | { tipo: 'REMOVER_COLUNA'; payload: { id: string } }
  | { tipo: 'ADICIONAR_CARTAO'; payload: { colunaId: string; cartao: Cartao } }
  | { tipo: 'EDITAR_CARTAO'; payload: { colunaId: string; cartao: Cartao } }
  | { tipo: 'REMOVER_CARTAO'; payload: { colunaId: string; cartaoId: string } }
  | { tipo: 'MOVER_CARTAO'; payload: { origem: { colunaId: string; indice: number }; destino: { colunaId: string; indice: number } } }
  | { tipo: 'DEFINIR_ESTADO'; payload: { estado: EstadoKanban } };