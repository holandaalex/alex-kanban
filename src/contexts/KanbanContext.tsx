import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ContextoKanban, EstadoKanban, AcaoKanban, Cartao } from '../types';
import { salvarEstado, carregarEstado } from '../utils/localStorage';
import { gerarCorAleatoria } from '../utils/helpers';

/**
 * Estado inicial do quadro Kanban com três colunas padrão
 */
const estadoInicial: EstadoKanban = {
  colunas: [
    {
      id: uuidv4(),
      titulo: 'A Fazer',
      cartoes: [],
      cor: '#e2e8f0', // Cinza claro
    },
    {
      id: uuidv4(),
      titulo: 'Em Progresso',
      cartoes: [],
      cor: '#e2e8f0',
    },
    {
      id: uuidv4(),
      titulo: 'Concluído',
      cartoes: [],
      cor: '#e2e8f0',
    },
  ],
};

/**
 * Reducer para gerenciar as operações do quadro Kanban
 */
const kanbanReducer = (estado: EstadoKanban, acao: AcaoKanban): EstadoKanban => {
  switch (acao.tipo) {
    case 'ADICIONAR_COLUNA':
      return {
        ...estado,
        colunas: [
          ...estado.colunas,
          {
            id: uuidv4(),
            titulo: acao.payload.titulo,
            cartoes: [],
            cor: gerarCorAleatoria(),
          },
        ],
      };

    case 'EDITAR_COLUNA':
      return {
        ...estado,
        colunas: estado.colunas.map((coluna) =>
          coluna.id === acao.payload.id
            ? { ...coluna, titulo: acao.payload.titulo, cor: acao.payload.cor }
            : coluna
        ),
      };

    case 'REMOVER_COLUNA':
      return {
        ...estado,
        colunas: estado.colunas.filter((coluna) => coluna.id !== acao.payload.id),
      };

    case 'ADICIONAR_CARTAO':
      return {
        ...estado,
        colunas: estado.colunas.map((coluna) =>
          coluna.id === acao.payload.colunaId
            ? { ...coluna, cartoes: [...coluna.cartoes, acao.payload.cartao] }
            : coluna
        ),
      };

    case 'EDITAR_CARTAO':
      return {
        ...estado,
        colunas: estado.colunas.map((coluna) =>
          coluna.id === acao.payload.colunaId
            ? {
                ...coluna,
                cartoes: coluna.cartoes.map((cartao) =>
                  cartao.id === acao.payload.cartao.id ? acao.payload.cartao : cartao
                ),
              }
            : coluna
        ),
      };

    case 'REMOVER_CARTAO':
      return {
        ...estado,
        colunas: estado.colunas.map((coluna) =>
          coluna.id === acao.payload.colunaId
            ? {
                ...coluna,
                cartoes: coluna.cartoes.filter((cartao) => cartao.id !== acao.payload.cartaoId),
              }
            : coluna
        ),
      };

    case 'MOVER_CARTAO': {
      const { origem, destino } = acao.payload;
      const novasColunas = [...estado.colunas];
      
      // Encontra as colunas de origem e destino
      const colunaOrigem = novasColunas.find((coluna) => coluna.id === origem.colunaId);
      const colunaDestino = novasColunas.find((coluna) => coluna.id === destino.colunaId);
      
      if (!colunaOrigem || !colunaDestino) return estado;
      
      // Remove o cartão da coluna de origem
      const [cartaoMovido] = colunaOrigem.cartoes.splice(origem.indice, 1);
      
      // Adiciona o cartão na coluna de destino
      colunaDestino.cartoes.splice(destino.indice, 0, cartaoMovido);
      
      return {
        ...estado,
        colunas: novasColunas,
      };
    }

    case 'DEFINIR_ESTADO':
      return acao.payload.estado;

    default:
      return estado;
  }
};

/**
 * Contexto para compartilhar o estado e operações do Kanban entre componentes
 */
const KanbanContext = createContext<ContextoKanban | undefined>(undefined);

/**
 * Provider que fornece estado e operações do Kanban para a aplicação
 */
export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estado, dispatch] = useReducer(kanbanReducer, estadoInicial);

  // Carrega o estado do localStorage na inicialização
  useEffect(() => {
    const estadoSalvo = carregarEstado();
    if (estadoSalvo) {
      dispatch({ tipo: 'DEFINIR_ESTADO', payload: { estado: estadoSalvo } });
    }
  }, []);

  // Salva o estado no localStorage quando ele muda
  useEffect(() => {
    salvarEstado(estado);
  }, [estado]);

  // Funções para manipular o estado do Kanban
  const adicionarColuna = (titulo: string) => {
    dispatch({ tipo: 'ADICIONAR_COLUNA', payload: { titulo } });
  };

  const editarColuna = (id: string, titulo: string, cor: string) => {
    dispatch({ tipo: 'EDITAR_COLUNA', payload: { id, titulo, cor } });
  };

  const removerColuna = (id: string) => {
    dispatch({ tipo: 'REMOVER_COLUNA', payload: { id } });
  };

  const adicionarCartao = (colunaId: string, cartao: Omit<Cartao, 'id' | 'dataCriacao'>) => {
    const novoCartao: Cartao = {
      ...cartao,
      id: uuidv4(),
      dataCriacao: new Date().toISOString(),
    };

    dispatch({
      tipo: 'ADICIONAR_CARTAO',
      payload: { colunaId, cartao: novoCartao },
    });
  };

  const editarCartao = (colunaId: string, cartaoAtualizado: Cartao) => {
    dispatch({
      tipo: 'EDITAR_CARTAO',
      payload: { colunaId, cartao: cartaoAtualizado },
    });
  };

  const removerCartao = (colunaId: string, cartaoId: string) => {
    dispatch({
      tipo: 'REMOVER_CARTAO',
      payload: { colunaId, cartaoId },
    });
  };

  const moverCartao = (
    origem: { colunaId: string; indice: number },
    destino: { colunaId: string; indice: number }
  ) => {
    dispatch({
      tipo: 'MOVER_CARTAO',
      payload: { origem, destino },
    });
  };

  const valor = {
    estado,
    adicionarColuna,
    editarColuna,
    removerColuna,
    adicionarCartao,
    editarCartao,
    removerCartao,
    moverCartao,
  };

  return <KanbanContext.Provider value={valor}>{children}</KanbanContext.Provider>;
};

/**
 * Hook para acessar o contexto Kanban
 * @throws Error se usado fora de um KanbanProvider
 */
export const useKanban = (): ContextoKanban => {
  const contexto = useContext(KanbanContext);
  if (contexto === undefined) {
    throw new Error('useKanban deve ser usado dentro de um KanbanProvider');
  }
  return contexto;
};