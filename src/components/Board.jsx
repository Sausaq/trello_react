import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

function Board({ board, onDelete }) {
  const { theme } = useTheme(); // Get the current theme

  return (
    <li className={`board-container ${theme}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link
        to={`/boards/${board.id}`}
        style={{
          textDecoration: 'none',
          color: '#007bff',
          fontWeight: 'bold',
          flex: 1,
        }}
      >
        {board.title}
      </Link>
      <button
        onClick={() => onDelete(board.id)}
        style={{
          padding: '0.3rem 0.6rem',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Удалить
      </button>
    </li>
  );
}

export default Board;
