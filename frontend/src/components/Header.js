export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="material-symbols-outlined" style={{ color: '#3B82F6', fontSize: 28 }}>task_alt</span>
        <h1 className="brand-title">My Tasks</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="icon-btn" aria-label="notifications">
          <span className="material-symbols-outlined" style={{ color: '#6b7280' }}>notifications</span>
        </button>
        <div className="avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZyW5PS7olvinH4YRTnDoxOv3vfSMlghfC__Y33UqaBD3ZNO5D4ker1HYFjDr05EB4TcP7meADmW1LLnQRxTpihXPhfSSqvuN7tASMjtM5nKlzHzhsqYdyOAv6BHVEBDkZkxfKcSUTQdCGToLFkVlMEGc_5qfEkkuvxzD-43Alj9N9tQMJXqqzgN058Ajk6nbBzAiZtyG4OdQVL6WxoCxcx_4OAoFvzRxVICJmk7WKSlDlZsAyUgfIin0jH598Wx2573nMpYxb_ZA')" }} />
      </div>
    </header>
  );
}


