const initialState = {
  columns: [],
};

export default function columnsReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    default:
      return state;
  }
}
