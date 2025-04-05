import { Routes, Route } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import BoardDetailsPage from './pages/BoardDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardsPage />} />
      <Route path="/boards/:boardId" element={<BoardDetailsPage />} />
    </Routes>
  );
}

export default App;
