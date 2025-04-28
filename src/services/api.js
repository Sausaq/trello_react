const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  boards: {
    getAll: () => fetch(`${API_BASE_URL}/boards`).then(res => res.json()),
    getById: (id) => fetch(`${API_BASE_URL}/boards/${id}`).then(res => res.json()),
    create: (title) => fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/boards/${id}`, { method: 'DELETE' }),
  },
  columns: {
    getByBoardId: (boardId) => fetch(`${API_BASE_URL}/boards/${boardId}/columns`).then(res => res.json()),
    create: (boardId, title, description) => fetch(`${API_BASE_URL}/boards/${boardId}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, boardId }),
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/columns/${id}`, { method: 'DELETE' }),
    update: (id, title, description) => fetch(`${API_BASE_URL}/columns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    }).then(res => res.json()),
    move: (columnId, newOrder) =>
      fetch(`${API_BASE_URL}/columns/${columnId}/move/${newOrder}`, {
        method: 'PATCH',
      }),
  },
  cards: {
    getByColumnId: (columnId) => fetch(`${API_BASE_URL}/columns/${columnId}/cards`).then(res => res.json()),
    create: (columnId, title, description) => fetch(`${API_BASE_URL}/columns/${columnId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, columnId }),
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/cards/${id}`, { method: 'DELETE' }),
    update: (id, title, description) => fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    }).then(res => res.json()),
    move: (cardId, toColumnId) =>
      fetch(`${API_BASE_URL}/cards/${cardId}/move/${toColumnId}`, {
        method: 'PATCH',
      }),
  },
};