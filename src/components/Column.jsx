import { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import Card from './Card';
import EditableModal from './EditableModal';
import './Column.css'; // Import the CSS file for column styles
import { Draggable, Droppable } from '@hello-pangea/dnd';

function Column({ column, index, onCreateCard, onDeleteColumn, onUpdateColumn, onUpdateCard, onDeleteCard }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme(); // Get the current theme

  const handleColumnClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (editedTitle, editedDescription) => {
    onUpdateColumn(column.id, editedTitle, editedDescription);
  };

  return (
    <Draggable draggableId={column.id.toString()} index={index}>
      {(provided) => (
        <div
          className="column-container"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="column-header" {...provided.dragHandleProps}>
            <h2 className="column-title" onClick={handleColumnClick}>
              {column.title}
            </h2>
          </div>
          <Droppable droppableId={column.id.toString()} type="card">
            {(provided) => (
              <div
                className="column-cards"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {(column.cards || []).map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    onUpdateCard={(cardId, title, description) =>
                      onUpdateCard(cardId, title, description)
                    }
                    onDeleteCard={onDeleteCard}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            className="column-create-card-button"
            onClick={() => onCreateCard(column.id)}
          >
            Создать карточку
          </button>
          {isModalOpen && (
            <EditableModal
              title={column.title}
              description={column.description}
              onSave={handleSave}
              onClose={handleModalClose}
              onDelete={() => onDeleteColumn(column.id)}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Column;
