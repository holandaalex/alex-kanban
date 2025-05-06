/**
 * Arquivo com funções auxiliares utilizadas no projeto
 */

/**
 * Gera uma cor aleatória em formato hexadecimal
 * @returns String com código de cor hexadecimal (ex: #FF5733)
 */
export const gerarCorAleatoria = (): string => {
  // Lista de cores pastel agradáveis visualmente
  const coresPredefinidas = [
    '#FFD6A5', // Pêssego claro
    '#CAFFBF', // Verde claro
    '#9BF6FF', // Azul claro
    '#BDB2FF', // Lavanda
    '#FFC6FF', // Rosa claro
    '#FDFFB6', // Amarelo claro
    '#A0C4FF', // Azul céu
    '#FFB3B3', // Vermelho claro
  ];
  
  // Seleciona uma cor aleatória da lista
  const indiceAleatorio = Math.floor(Math.random() * coresPredefinidas.length);
  return coresPredefinidas[indiceAleatorio];
};

/**
 * Formata uma data para exibição no formato brasileiro
 * @param data String de data ISO ou objeto Date
 * @returns Data formatada no padrão brasileiro (dd/mm/aaaa)
 */
export const formatarData = (data: string | Date): string => {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  return dataObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Trunca um texto para um determinado tamanho máximo
 * @param texto Texto original
 * @param tamanhoMaximo Tamanho máximo do texto resultante
 * @returns Texto truncado com "..." no final se necessário
 */
export const truncarTexto = (texto: string, tamanhoMaximo: number): string => {
  if (texto.length <= tamanhoMaximo) return texto;
  return texto.substring(0, tamanhoMaximo).trim() + '...';
};