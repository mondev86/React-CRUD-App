import { useMemo, useState } from 'react';
import { useEffect, useMemo, useState } from 'react';

const INITIAL_ITEMS = [
  { id: 1, title: 'Aprender React', description: 'Repasar componentes y estado.' },
  { id: 2, title: 'Practicar CRUD', description: 'Crear, editar y eliminar registros.' },
];

function App() {
  // 1) Estado principal de la app (fuente de verdad del CRUD)
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('crud-items');
    return stored ? JSON.parse(stored) : INITIAL_ITEMS;
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');

  // 2) Estado derivado: indica si el formulario esta en modo edicion
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  useEffect(() => {
    localStorage.setItem('crud-items', JSON.stringify(items));
  }, [items]);

  // 3) Estado derivado: aplica filtro de busqueda por titulo
  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.title.toLowerCase().includes(term));
  }, [items, query]);

  // 4) Helper para volver el formulario a estado inicial
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  // 5) Crea un registro nuevo o guarda cambios del registro en edicion
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return;
    }

    if (editingId === null) {
      setItems((current) => [
        ...current,
        { id: Date.now(), title: trimmedTitle, description: trimmedDescription },
      ]);
      resetForm();
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === editingId
          ? { ...item, title: trimmedTitle, description: trimmedDescription }
          : item
      )
    );
    resetForm();
  };

  // 6) Carga un registro al formulario para editarlo
  const handleEdit = (itemId) => {
    const selected = items.find((item) => item.id === itemId);
    if (!selected) return;
    setTitle(selected.title);
    setDescription(selected.description);
    setEditingId(itemId);
  };

  // 7) Elimina un registro y limpia formulario si estabas editando ese item
  const handleDelete = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
    if (editingId === itemId) {
      resetForm();
    }

  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>React CRUD App</h1>
        <p>Aplicacion simple para practicar operaciones CRUD con React 19.</p>
      </header>

      {/* 8) Filtro visual para buscar por titulo */}
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por titulo..."
        aria-label="Buscar por titulo"
        className="search-input"
      />

      <p className="summary">
        Mostrando {filteredItems.length} de {items.length} registros
      </p>
      
      {/* 9) Formulario de alta/edicion */}
      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Titulo"
          aria-label="Titulo"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripcion (opcional)"
          aria-label="Descripcion"
          rows={3}
        />
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear registro'}</button>
          {isEditing ? (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <section className="list-section" aria-label="Lista de registros">
        <p className="summary-title">Total de registros: {items.length}</p>
        {/* 10) Lista resultante (ya filtrada por el buscador) */}
        {filteredItems.length === 0 ? (
          <p className="empty">No hay registros. Crea el primero.</p>
        ) : (
          <ul className="item-list">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <h2>{item.title}</h2>
                <p>{item.description || 'Sin descripcion'}</p>
                <div className="item-actions">
                  <button type="button" onClick={() => handleEdit(item.id)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(item.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
