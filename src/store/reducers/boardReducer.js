const initialState = {
  boards: [],
  columns: [],
  cards: [],
};

export default function boardReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    default:
      return state;
  }
} 