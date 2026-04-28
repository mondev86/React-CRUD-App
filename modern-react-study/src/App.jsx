import { useMemo, useState } from 'react';

const INITIAL_ITEMS = [
  { id: 1, title: 'Aprender React', description: 'Repasar componentes y estado.' },
  { id: 2, title: 'Practicar CRUD', description: 'Crear, editar y eliminar registros.' },
];

function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

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

  const handleEdit = (itemId) => {
    const selected = items.find((item) => item.id === itemId);
    if (!selected) return;
    setTitle(selected.title);
    setDescription(selected.description);
    setEditingId(itemId);
  };

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
        {items.length === 0 ? (
          <p className="empty">No hay registros. Crea el primero.</p>
        ) : (
          <ul className="item-list">
            {items.map((item) => (
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
