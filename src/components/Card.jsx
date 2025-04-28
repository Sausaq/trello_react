import { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import EditableModal from './EditableModal';
import './Card.css'; // Import the CSS file for card styles
import { Draggable } from '@hello-pangea/dnd';

function Card({ card, index, onUpdateCard, onDeleteCard }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme(); // Get the current theme

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (editedTitle, editedDescription) => {
    onUpdateCard(card.id, editedTitle, editedDescription);
  };

  return (
    <Draggable draggableId={`card-${card.id}`} index={index}>
      {(provided) => (
        <>
          <div
            className={`card-container ${theme}`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handleCardClick}
          >
            <h3 className={`card-title ${theme}`}>{card.title}</h3>
          </div>
          {isModalOpen && (
            <EditableModal
              title={card.title}
              description={card.description}
              onSave={handleSave}
              onClose={handleModalClose}
              onDelete={() => {
                fetch(`http://localhost:8080/api/cards/${card.id}`, { method: 'DELETE' })
                  .then((res) => {
                    if (res.ok) {
                      onDeleteCard(card.id); // Notify parent to remove the card
                    } else {
                      console.error(`Failed to delete card with ID: ${card.id}`);
                    }
                  })
                  .catch((error) => console.error(`Error deleting card with ID: ${card.id}`, error));
              }}
            />
          )}
        </>
      )}
    </Draggable>
  );
}

export default Card;
