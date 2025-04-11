import { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import Card from './Card';
import EditableModal from './EditableModal';
import './Column.css'; // Import the CSS file for column styles

function Column({ column, onCreateCard, onDeleteColumn, onUpdateColumn, onUpdateCard, onDeleteCard }) {
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
    <div className={`column-container ${theme}`}>
      <div className="column-header">
        <h2 className="column-title" onClick={handleColumnClick}>
          {column.title}
        </h2>
      </div>
      <div className="column-cards">
        {/* Ensure column.cards is always an array */}
        {(column.cards || []).map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdateCard={(cardId, title, description) =>
              onUpdateCard(cardId, title, description)
            }
            onDeleteCard={onDeleteCard} // Call the parent-provided function directly
          />
        ))}
      </div>
      <button
        className="column-create-card-button"
        onClick={() => onCreateCard(column.id)} // Trigger modal for card creation
      >
        Создать карточку
      </button>

      {isModalOpen && (
        <EditableModal
          title={column.title}
          description={column.description}
          onSave={handleSave}
          onClose={handleModalClose}
          onDelete={() => onDeleteColumn(column.id)} // Pass delete handler
        />
      )}
    </div>
  );
}

export default Column;
