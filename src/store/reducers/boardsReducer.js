const initialState = {
  boards: [],
};

export default function boardsReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    default:
      return state;
  }
}
