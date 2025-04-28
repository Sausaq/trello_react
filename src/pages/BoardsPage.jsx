import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Board from '../components/Board';
import './BoardsPage.css'; // Import the CSS file for BoardsPage styles

function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchBoards = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:8080/api/boards/userId?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setBoards(Array.isArray(data) ? data : []);
          } else {
            setBoards([]);
          }
        } catch (error) {
          console.error('Error fetching boards:', error);
          setBoards([]);
        }
      }
    };

    fetchBoards();
  }, [user]);

  const createBoard = () => {
    const title = prompt('Введите название доски:');
    if (title) {
      fetch('http://localhost:8080/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title , userId: user.id}),
      })
        .then((res) => res.json())
        .then((newBoard) => setBoards((prev) => [...prev, newBoard]))
        .catch((error) => {
          console.error('Error creating board:', error);
        });
    }
  };

  const deleteBoard = (id) => {
    fetch(`http://localhost:8080/api/boards/${id}`, { method: 'DELETE' })
      .then(() => setBoards((prev) => prev.filter((board) => board.id !== id)))
      .catch((error) => {
        console.error('Error deleting board:', error);
      });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="boards-page">
      <div className="boards-header">
        <h1 className="boards-title">Доски</h1>
        <div className="header-buttons">
          <button className="theme-toggle-button" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
      <button className="create-board-button" onClick={createBoard}>
        Создать доску
      </button>
      <ul className="boards-list">
        {boards && boards.map((board) => (
          <Board key={board.id} board={board} onDelete={deleteBoard} />
        ))}
      </ul>
    </div>
  );
}

export default BoardsPage;
