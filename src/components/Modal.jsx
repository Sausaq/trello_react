import ReactDOM from 'react-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import './Modal.css'; // Import the CSS file for modal styles

function Modal({ children }) {
  const { theme } = useTheme(); // Get the current theme
  const modalRoot = document.getElementById('modal-root');

  return ReactDOM.createPortal(
    <div className={`modal-container ${theme}`}>
      {children}
    </div>,
    modalRoot
  );
}

export default Modal;
