import Card from './Card';

function Column({ column, onCreateCard }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h2>{column.title}</h2>
      </div>
      <div style={{ flex: 1, marginTop: '1rem', minHeight: '50px' }}>
        {column.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <button style={{ marginTop: '1rem' }} onClick={() => onCreateCard(column.id)}>
        Создать карточку
      </button>
    </div>
  );
}

export default Column;
