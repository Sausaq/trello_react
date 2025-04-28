import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Column from '../components/Column';
import './BoardDetailsPage.css';
import EditableModal from '../components/EditableModal';
import CreateModal from '../components/CreateModal';
import { useTheme } from '../context/ThemeContext';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

function BoardDetailsPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState(null);
  const [parentId, setParentId] = useState(null);
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8080/api/boards/userId?userId=${user.id}`)
        .then((res) => res.json())
        .then(setBoards);
    }
  }, [user]);

  useEffect(() => {
    if (boardId && user) {
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
  }, [boardId, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === 'column') {
      const columnId = parseInt(draggableId);
      const newOrder = destination.index;

      const previousColumns = [...columns];
      const newColumns = Array.from(columns);
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);
      setColumns(newColumns);

      fetch(`http://localhost:8080/api/columns/${columnId}/move/${newOrder}`, {
        method: 'PATCH',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to move column');
        })
        .catch((error) => {
          console.error('Error moving column:', error);
          setColumns(previousColumns);
        });
    } else if (type === 'card') {
      const fromColId = parseInt(source.droppableId);
      const toColId = parseInt(destination.droppableId);
      const cardId = parseInt(draggableId.replace('card-', '')); // Extract numeric cardId

      const sourceColumn = columns.find((col) => col.id === fromColId);
      const destinationColumn = columns.find((col) => col.id === toColId);

      const sourceCards = Array.from(sourceColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);

      if (fromColId === toColId) {
        sourceCards.splice(destination.index, 0, movedCard);
        setColumns((prev) =>
          prev.map((col) =>
            col.id === fromColId ? { ...col, cards: sourceCards } : col
          )
        );
      } else {
        const destinationCards = Array.from(destinationColumn.cards);
        destinationCards.splice(destination.index, 0, movedCard);

        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === fromColId) {
              return { ...col, cards: sourceCards };
            }
            if (col.id === toColId) {
              return { ...col, cards: destinationCards };
            }
            return col;
          })
        );

        fetch(`http://localhost:8080/api/cards/${cardId}/move/${toColId}`, {
          method: 'PATCH',
        }).catch((err) => {
          console.error('Error moving card:', err);
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-details-page">
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
          <button className="back-to-menu-button" onClick={() => navigate('/boards')}>
            Выйти в главное меню
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </aside>
        <main className="main-content">
          {board && (
            <>
              <header className="board-header">
                <h1>{board.title}</h1>
              </header>
              <div className="scroll-wrapper">
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                  {(provided) => (
                    <div
                      className="columns-container"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {columns.map((column, index) => (
                        <Column
                          key={column.id}
                          column={column}
                          index={index}
                          onCreateCard={() => openCreateModal('card', column.id)}
                          onDeleteColumn={deleteColumn}
                          onUpdateColumn={updateColumn}
                          onUpdateCard={updateCard}
                          onDeleteCard={deleteCard}
                        />
                      ))}
                      {provided.placeholder}
                      <button
                        className="create-column-button"
                        onClick={() => openCreateModal('column', boardId)}
                      >
                        + Создать колонку
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            </>
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
    </DragDropContext>
  );
}

export default BoardDetailsPage;
