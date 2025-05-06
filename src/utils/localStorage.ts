import { EstadoKanban } from '../types';

/**
 * Chave usada para armazenar o estado do quadro no localStorage
 */
const CHAVE_STORAGE = 'kanban-quadro-estado';

/**
 * Salva o estado do quadro no localStorage
 * @param estado Estado atual do quadro Kanban
 */
export const salvarEstado = (estado: EstadoKanban): void => {
  try {
    const estadoJSON = JSON.stringify(estado);
    localStorage.setItem(CHAVE_STORAGE, estadoJSON);
    console.log('Estado salvo com sucesso no localStorage');
  } catch (erro) {
    console.error('Erro ao salvar estado no localStorage:', erro);
  }
};

/**
 * Carrega o estado do quadro do localStorage
 * @returns Estado salvo ou null se não existir
 */
export const carregarEstado = (): EstadoKanban | null => {
  try {
    const estadoJSON = localStorage.getItem(CHAVE_STORAGE);
    if (!estadoJSON) return null;
    
    const estado = JSON.parse(estadoJSON) as EstadoKanban;
    console.log('Estado carregado com sucesso do localStorage');
    return estado;
  } catch (erro) {
    console.error('Erro ao carregar estado do localStorage:', erro);
    return null;
  }
};