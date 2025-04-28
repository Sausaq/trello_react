import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

function Board({ board, onDelete }) {
  const { theme } = useTheme(); // Get the current theme

  return (
    <li className={`board-container ${theme}`}>
      <Link
        to={`/boards/${board.id}`}
        className="board-link"
      >
        {board.title}
      </Link>
      <button
        onClick={() => onDelete(board.id)}
        className="delete-board-button"
      >
        Удалить
      </button>
    </li>
  );
}

export default Board;
