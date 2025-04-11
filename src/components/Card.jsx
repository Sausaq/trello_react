import { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import EditableModal from './EditableModal';
import './Card.css'; // Import the CSS file for card styles

function Card({ card, onUpdateCard, onDeleteCard }) {
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
    <>
      <div className={`card-container ${theme}`} onClick={handleCardClick}>
        <h3 className="card-title">{card.title}</h3>
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
  );
}

export default Card;
