export default function Tabs({ active, onChange, categories }) {
  return (
    <div className="tabs">
      <button className={`tab ${active === 'pending' ? 'active' : ''}`} onClick={() => onChange('pending')}>Pendientes</button>
      <button className={`tab ${active === 'completed' ? 'active' : ''}`} onClick={() => onChange('completed')}>Completadas</button>
      <div>
        <select className="tab" style={{ appearance: 'none' }} value={active.startsWith('cat:') ? active : ''} onChange={(e) => onChange(e.target.value || 'pending')}>
          <option value="">Categoría</option>
          {categories.map(c => (
            <option key={c._id} value={`cat:${c._id}`}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}


