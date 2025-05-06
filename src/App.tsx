import { KanbanProvider } from './contexts/KanbanContext';
import Quadro from './components/Quadro';
import Cabecalho from './components/Cabecalho';

/**
 * Componente principal da aplicação
 * Encapsula toda a aplicação dentro do KanbanProvider para gerenciamento de estado
 */
function App() {
  return (
    <KanbanProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Cabecalho />
        <main className="flex-grow p-4">
          <Quadro />
        </main>
        <footer className="bg-white p-4 text-center text-gray-500 text-sm border-t">
          @holandaalex - Alex Kanban - Projeto para Alunos Iniciantes &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </KanbanProvider>
  );
}

export default App;