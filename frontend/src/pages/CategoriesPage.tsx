import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#171717');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await categoryService.update(editingId, { name, color });
    } else {
      await categoryService.create({ name, color });
    }
    setName('');
    setColor('#171717');
    setEditingId(null);
    await loadCategories();
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setColor(cat.color);
    setEditingId(cat.id);
  };

  const handleDelete = async (id: string) => {
    await categoryService.delete(id);
    await loadCategories();
  };

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Etiquetas</h1>
        <p className="text-sm text-foreground-muted mt-0.5">Administra las etiquetas para categorizar tus tareas</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Nombre de la etiqueta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input flex-1 text-sm"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-9 rounded-[6px] cursor-pointer border bg-surface"
        />
        <button type="submit" className="btn-primary">
          {editingId ? 'Actualizar' : 'Añadir'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setName(''); setColor('#171717'); setEditingId(null); }} className="btn-ghost">
            Cancelar
          </button>
        )}
      </form>

      <div className="space-y-1">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-3 py-2.5 rounded-[6px] hover:bg-foreground/[0.02] transition-colors border-b last:border-none">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm text-foreground font-medium">{cat.name}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(cat)} className="text-micro text-foreground-muted hover:text-foreground font-medium transition-colors">
                Editar
              </button>
              <button onClick={() => handleDelete(cat.id)} className="text-micro text-[#EF4444] hover:text-[#B91C1C] font-medium transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-subtle text-center py-8">Aún no hay etiquetas. Crea una arriba.</p>
        )}
      </div>
    </div>
  );
}
