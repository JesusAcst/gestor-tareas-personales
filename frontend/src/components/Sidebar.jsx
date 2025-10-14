// Sidebar.jsx
function Sidebar({ categories }) {
  return (
    <aside className="w-64 bg-white shadow-xl p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">Categorías</h2>
      {/* Aquí se listarán las categorías */}
      <p className="text-sm text-gray-500 mt-auto">Total de categorías: {categories.length}</p>
    </aside>
  );
}
export default Sidebar;