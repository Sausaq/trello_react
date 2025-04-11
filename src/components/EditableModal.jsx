import { useState } from 'react';
import Modal from './Modal';

function EditableModal({ title, description, onSave, onClose, onDelete }) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    onSave(editedTitle, editedDescription);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal>
      <h3>Редактировать</h3>
      <label>
        Название:
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="modal-input"
        />
      </label>
      <label>
        Описание:
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="modal-input"
        />
      </label>
      <button
        onClick={handleSave}
        className="modal-button save-button"
      >
        Сохранить
      </button>
      <button
        onClick={handleDelete}
        className="modal-button delete-button"
      >
        Удалить
      </button>
      <button
        onClick={onClose}
        className="modal-button close-button"
      >
        Закрыть
      </button>
    </Modal>
  );
}

export default EditableModal;
