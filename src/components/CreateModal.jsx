import { useState } from 'react';
import Modal from './Modal';

function CreateModal({ type, parentId, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave(parentId, title.trim(), description.trim()); // Ensure trimmed values are passed
      onClose(); // Close the modal after saving
    } else {
      alert('Название и описание обязательны!');
    }
  };

  return (
    <Modal>
      <h3>{type === 'column' ? 'Создать колонку' : 'Создать карточку'}</h3>
      <label>
        Название:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modal-input"
        />
      </label>
      <label>
        Описание:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="modal-input"
        />
      </label>
      <button
        onClick={handleSave}
        className="modal-button save-button"
      >
        Создать
      </button>
      <button
        onClick={onClose}
        className="modal-button close-button"
      >
        Отмена
      </button>
    </Modal>
  );
}

export default CreateModal;
