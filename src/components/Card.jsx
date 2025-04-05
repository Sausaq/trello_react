function Card({ card }) {
  return (
    <div
      id={String(card.id)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0.5rem',
        marginBottom: '0.5rem',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ margin: 0, color: '#555' }}>{card.title}</h3>
    </div>
  );
}

export default Card;
