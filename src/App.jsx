import { Routes, Route } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import BoardDetailsPage from './pages/BoardDetailsPage';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <button onClick={toggleTheme} className="theme-toggle-button">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
      <Routes>
        <Route path="/" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<BoardDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
