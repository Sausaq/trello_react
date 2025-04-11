import { useState, useEffect } from 'react';
import Board from '../components/Board';
import './BoardsPage.css'; // Import the CSS file for BoardsPage styles

function BoardsPage() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/boards')
      .then((res) => res.json())
      .then(setBoards);
  }, []);

  const createBoard = () => {
    const title = prompt('Введите название доски:');
    if (title) {
      fetch('http://localhost:8080/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
        .then((res) => res.json())
        .then((newBoard) => setBoards((prev) => [...prev, newBoard]));
    }
  };

  const deleteBoard = (id) => {
    fetch(`http://localhost:8080/api/boards/${id}`, { method: 'DELETE' }).then(() =>
      setBoards((prev) => prev.filter((board) => board.id !== id))
    );
  };

  return (
    <div className="boards-page">
      <h1 className="boards-title">Доски</h1>
      <button className="create-board-button" onClick={createBoard}>
        Создать доску
      </button>
      <ul className="boards-list">
        {boards.map((board) => (
          <Board key={board.id} board={board} onDelete={deleteBoard} />
        ))}
      </ul>
    </div>
  );
}

export default BoardsPage;
