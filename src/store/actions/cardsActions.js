export const setCards = (cards) => ({
  type: 'SET_CARDS',
  payload: cards,
});

export const fetchCards = (columnId) => async (dispatch) => {
  const response = await fetch(`http://localhost:8080/api/columns/${columnId}/cards`);
  const cards = await response.json();
  dispatch(setCards(cards));
};
