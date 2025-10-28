import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import { tasksApi, categoriesApi } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState('pending');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    Promise.all([tasksApi.list(), categoriesApi.list()])
      .then(([t, c]) => { setTasks(t || []); setCategories(c || []); })
      .catch((e) => console.error(e));
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'completed') return tasks.filter(t => t.completed);
    if (tab.startsWith('cat:')) {
      const catId = tab.split(':')[1];
      return tasks.filter(t => (t.category && (t.category._id === catId || t.category === catId)));
    }
    return tasks.filter(t => !t.completed);
  }, [tasks, tab]);

  async function handleCreate(payload) {
    try {
      const created = await tasksApi.create(payload);
      setTasks(prev => [created, ...prev]);
      setOpenModal(false);
    } catch (e) { console.error(e); }
  }

  async function handleComplete(task) {
    try {
      const updated = await tasksApi.update(task._id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
    } catch (e) { console.error(e); }
  }

  async function handleDelete(task) {
    try {
      await tasksApi.remove(task._id);
      setTasks(prev => prev.filter(t => t._id !== task._id));
    } catch (e) { console.error(e); }
  }

  return (
    <div className="app">
      <Header />
      <main className="container-page">
        <Tabs active={tab} onChange={setTab} categories={categories} />
        <div className="grid">
          {filtered.map(task => (
            <TaskCard key={task._id} task={task} onComplete={handleComplete} onDelete={handleDelete} />
          ))}
        </div>
      </main>
      <button className="fab" onClick={() => setOpenModal(true)} aria-label="add">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <AddTaskModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleCreate} categories={categories} />
    </div>
  );
}

export default App;
