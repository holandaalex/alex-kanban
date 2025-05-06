import React, { useState } from 'react';
import { useKanban } from '../contexts/KanbanContext';
import Coluna from './Coluna';
import { Cartao as CartaoType } from '../types';

/**
 * Componente do quadro Kanban
 * Renderiza todas as colunas e gerencia o arrastar e soltar
 */
const Quadro: React.FC = () => {
  const { estado, moverCartao } = useKanban();
  const [cartaoArrastado, setCartaoArrastado] = useState<{
    id: string;
    colunaId: string;
    indice: number;
  } | null>(null);

  /**
   * Manipula o início do arrasto de um cartão
   */
  const iniciarArrasto = (colunaId: string, cartaoId: string, indice: number) => {
    setCartaoArrastado({ id: cartaoId, colunaId, indice });
  };

  /**
   * Manipula quando um cartão é solto em uma coluna
   */
  const finalizarArrasto = (colunaDestinoId: string, indiceDestino: number) => {
    if (!cartaoArrastado) return;

    // Se o cartão não mudou de posição, não faz nada
    if (
      cartaoArrastado.colunaId === colunaDestinoId &&
      cartaoArrastado.indice === indiceDestino
    ) {
      setCartaoArrastado(null);
      return;
    }

    // Ajusta o índice de destino se estiver movendo para uma posição posterior na mesma coluna
    const indiceAjustado =
      cartaoArrastado.colunaId === colunaDestinoId && cartaoArrastado.indice < indiceDestino
        ? indiceDestino - 1
        : indiceDestino;

    // Move o cartão para a nova posição
    moverCartao(
      { colunaId: cartaoArrastado.colunaId, indice: cartaoArrastado.indice },
      { colunaId: colunaDestinoId, indice: indiceAjustado }
    );

    setCartaoArrastado(null);
  };

  /**
   * Permite que uma coluna aceite o arrasto
   */
  const permitirArrasto = (e: React.DragOverEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-160px)]">
      {estado.colunas.map((coluna) => (
        <Coluna
          key={coluna.id}
          coluna={coluna}
          onIniciarArrasto={iniciarArrasto}
          onFinalizarArrasto={finalizarArrasto}
          onPermitirArrasto={permitirArrasto}
          cartaoArrastadoId={cartaoArrastado?.id || ''}
        />
      ))}
    </div>
  );
};

export default Quadro;