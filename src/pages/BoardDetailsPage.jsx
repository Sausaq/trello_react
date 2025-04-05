import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Column from '../components/Column';

function BoardDetailsPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null); // Состояние для данных о доске
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/boards/${boardId}`)
      .then((res) => res.json())
      .then(setBoard);

    fetch(`http://localhost:8080/api/boards/${boardId}/columns`)
      .then((res) => res.json())
      .then((columns) => {
        const fetchCardsPromises = columns.map((column) =>
          fetch(`http://localhost:8080/api/columns/${column.id}/cards`)
            .then((res) => res.json())
            .then((cards) => ({ ...column, cards }))
        );
        Promise.all(fetchCardsPromises).then(setColumns);
      });
  }, [boardId]);

  const createColumn = () => {
    const title = prompt('Введите название колонки:');
    const description = prompt('Введите описание колонки:');
    if (title && description) {
      fetch(`http://localhost:8080/api/boards/${boardId}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newColumn) => setColumns((prev) => [...prev, { ...newColumn, cards: [] }]));
    }
  };

  const createCard = (columnId) => {
    const title = prompt('Введите название карточки:');
    const description = prompt('Введите описание карточки:');
    if (title && description) {
      fetch(`http://localhost:8080/api/columns/${columnId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((newCard) =>
          setColumns((prev) =>
            prev.map((column) =>
              column.id === columnId
                ? { ...column, cards: [...column.cards, newCard] }
                : column
            )
          )
        );
    }
  };

  return (
    <div>
      <h1>{board ? board.title : 'Загрузка...'}</h1> {/* Отображение названия доски */}
      <button onClick={createColumn}>Создать колонку</button>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {columns.map((column) => (
          <Column key={column.id} column={column} onCreateCard={createCard} />
        ))}
      </div>
    </div>
  );
}

export default BoardDetailsPage;
