import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Column from '../components/Column';
import './BoardDetailsPage.css'; // Import styles for the page
import EditableModal from '../components/EditableModal'; // Import the modal component
import CreateModal from '../components/CreateModal'; // Updated import
import { useTheme } from '../context/ThemeContext'; // Import useTheme

function BoardDetailsPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState(null); // 'column' or 'card'
  const [parentId, setParentId] = useState(null); // boardId for columns, columnId for cards
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    // Fetch all boards for the sidebar
    fetch('http://localhost:8080/api/boards')
      .then((res) => res.json())
      .then(setBoards);
  }, []);

  useEffect(() => {
    // Fetch the selected board and its columns
    if (boardId) {
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
    }
  }, [boardId]);

  const deleteColumn = (columnId) => {
    fetch(`http://localhost:8080/api/columns/${columnId}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setColumns((prev) => prev.filter((column) => column.id !== columnId));
        } else {
          console.error('Failed to delete column');
        }
      });
  };

  const updateColumn = (columnId, title, description) => {
    fetch(`http://localhost:8080/api/columns/${columnId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update column');
        }
        return res.json();
      })
      .then(() =>
        setColumns((prev) =>
          prev.map((column) =>
            column.id === columnId ? { ...column, title, description } : column
          )
        )
      )
      .catch((error) => console.error('Error updating column:', error));
  };

  // const createCard = (columnId) => {
  //   const title = prompt('Введите название карточки:');
  //   const description = prompt('Введите описание карточки:');
  //   if (title && description) {
  //     fetch(`http://localhost:8080/api/columns/${columnId}/cards`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ title, description, columnId }),
  //     })
  //       .then((res) => res.json())
  //       .then((newCard) =>
  //         setColumns((prev) =>
  //           prev.map((column) =>
  //             column.id === columnId
  //               ? { ...column, cards: [...column.cards, newCard] }
  //               : column
  //           )
  //         )
  //       );
  //   }
  // };

  const updateCard = (cardId, title, description) => {
    fetch(`http://localhost:8080/api/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update card');
        }
        return res.json();
      })
      .then(() =>
        setColumns((prev) =>
          prev.map((column) =>
            column.cards.some((card) => card.id === cardId)
              ? {
                  ...column,
                  cards: column.cards.map((card) =>
                    card.id === cardId ? { ...card, title, description } : card
                  ),
                }
              : column
          )
        )
      )
      .catch((error) => console.error('Error updating card:', error));
  };

  const deleteCard = (cardId) => {
    fetch(`http://localhost:8080/api/cards/${cardId}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setColumns((prev) =>
            prev.map((column) => ({
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            }))
          );
        } else {
          console.error(`Failed to delete card with ID: ${cardId}`);
        }
      })
      .catch((error) => console.error(`Error deleting card with ID: ${cardId}`, error));
  };

  const openCreateModal = (type, id) => {
    setCreateModalType(type);
    setParentId(id);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateModalType(null);
    setParentId(null);
  };

  const handleCreate = (id, title, description) => {
    if (createModalType === 'column') {
      fetch(`http://localhost:8080/api/boards/${id}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, boardId: parseInt(id) }),
      })
        .then((res) => res.json())
        .then((newColumn) => {
          setColumns((prev) => [...prev, { ...newColumn, cards: [] }]);
          closeCreateModal();
        })
        .catch((error) => console.error('Error creating column:', error));
    } else if (createModalType === 'card') {
      fetch(`http://localhost:8080/api/columns/${id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, columnId: parseInt(id) }),
      })
        .then((res) => res.json())
        .then((newCard) => {
          setColumns((prev) =>
            prev.map((column) =>
              column.id === id
                ? { ...column, cards: [...column.cards, newCard] }
                : column
            )
          );
          closeCreateModal();
        })
        .catch((error) => console.error('Error creating card:', error));
    }
  };

  return (
    <div className={`board-details-page ${theme}`}>
      <aside className="sidebar">
        <h2>Доски</h2>
        <ul className="board-list">
          {boards.map((board) => (
            <li
              key={board.id}
              className={`board-item ${board.id === parseInt(boardId) ? 'selected' : ''}`}
              onClick={() => navigate(`/boards/${board.id}`)}
            >
              {board.title}
            </li>
          ))}
        </ul>
        <button className="back-to-menu-button" onClick={() => navigate('/')}>
          Выйти в главное меню
        </button>
      </aside>
      <main className="main-content">
        {board ? (
          <>
            <header className="board-header">
              <h1>{board.title}</h1>
            </header>
              <div className="scroll-wrapper">
                  <div className="columns-container">
                      {columns.map((column) => (
                          <Column
                              key={column.id}
                              column={column}
                              onCreateCard={() => openCreateModal('card', column.id)} // Open modal for card creation
                              onDeleteColumn={deleteColumn}
                              onUpdateColumn={updateColumn}
                              onUpdateCard={updateCard}
                              onDeleteCard={deleteCard} // Pass deleteCard function
                          />
                      ))}
                      <button className="create-column-button" onClick={() => openCreateModal('column', boardId)}>
                          + Создать колонку
                      </button>
                  </div>
              </div>

          </>
        ) : (
          <p>Загрузка...</p>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateModal
          type={createModalType}
          parentId={parentId}
          onSave={handleCreate}
          onClose={closeCreateModal}
        />
      )}
    </div>
  );
}

export default BoardDetailsPage;
