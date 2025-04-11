import { configureStore } from '@reduxjs/toolkit'; // Ensure this path is correct
import boardsReducer from './reducers/boardsReducer';
import columnsReducer from './reducers/columnsReducer';
import cardsReducer from './reducers/cardsReducer';

const store = configureStore({
  reducer: {
    boards: boardsReducer,
    columns: columnsReducer,
    cards: cardsReducer,
  },
});

export default store;
