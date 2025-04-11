export const setBoards = (boards) => ({
  type: 'SET_BOARDS',
  payload: boards,
});

export const fetchBoards = () => async (dispatch) => {
  const response = await fetch('http://localhost:8080/api/boards');
  const boards = await response.json();
  dispatch(setBoards(boards));
};
