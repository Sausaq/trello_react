export const setColumns = (columns) => ({
  type: 'SET_COLUMNS',
  payload: columns,
});

export const fetchColumns = (boardId) => async (dispatch) => {
  const response = await fetch(`http://localhost:8080/api/boards/${boardId}/columns`);
  const columns = await response.json();

  // Ensure each column has a `cards` property
  const columnsWithCards = await Promise.all(
    columns.map(async (column) => {
      const cardsResponse = await fetch(`http://localhost:8080/api/columns/${column.id}/cards`);
      const cards = await cardsResponse.json();
      return { ...column, cards: cards || [] }; // Default to an empty array if `cards` is missing
    })
  );

  dispatch(setColumns(columnsWithCards));
};

export const createColumn = (boardId, title, description) => async (dispatch) => {
  const response = await fetch(`http://localhost:8080/api/boards/${boardId}/columns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, boardId }),
  });

  if (!response.ok) throw new Error('Failed to create column');

  const newColumn = await response.json();
  dispatch(fetchColumns(boardId)); // Refresh columns after creation
};
