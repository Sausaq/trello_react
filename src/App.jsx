import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardsPage from './pages/BoardsPage';
import BoardDetailsPage from './pages/BoardDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <button onClick={toggleTheme} className="theme-toggle-button">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/boards" element={<PrivateRoute><BoardsPage /></PrivateRoute>} />
        <Route path="/boards/:boardId" element={<PrivateRoute><BoardDetailsPage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
