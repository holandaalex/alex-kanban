/// <reference types="react-scripts" />

/**
 * Tipos para eventos HTML/React 
 */
declare namespace React {
  interface DragEvent<T> extends React.SyntheticEvent<T> {
    dataTransfer: DataTransfer;
  }
  
  interface DragOverEvent extends React.SyntheticEvent<HTMLElement> {
    preventDefault: () => void;
  }
}