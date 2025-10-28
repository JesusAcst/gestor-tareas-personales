export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#3B82F6">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM5 8v11h14V8H5zm2 3h10v1H7v-1zm0 2h10v1H7v-1zm0 2h7v1H7v-1z" />
        </svg>
        <h1 className="brand-title">My Tasks</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="icon-btn" aria-label="notifications">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <div className="avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZyW5PS7olvinH4YRTnDoxOv3vfSMlghfC__Y33UqaBD3ZNO5D4ker1HYFjDr05EB4TcP7meADmW1LLnQRxTpihXPhfSSqvuN7tASMjtM5nKlzHzhsqYdyOAv6BHVEBDkZkxfKcSUTQdCGToLFkVlMEGc_5qfEkkuvxzD-43Alj9N9tQMJXqqzgN058Ajk6nbBzAiZtyG4OdQVL6WxoCxcx_4OAoFvzRxVICJmk7WKSlDlZsAyUgfIin0jH598Wx2573nMpYxb_ZA')" }} />
      </div>
    </header>
  );
}


