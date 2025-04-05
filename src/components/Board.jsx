import { Link } from 'react-router-dom';

function Board({ board, onDelete }) {
  return (
    <li>
      <Link to={`/boards/${board.id}`}>{board.title}</Link>
      <button onClick={() => onDelete(board.id)}>Удалить</button>
    </li>
  );
}

export default Board;
