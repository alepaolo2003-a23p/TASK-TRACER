import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#7C5CFC');
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
    setColor('#7C5CFC');
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F2F2F5] mb-6">Categories</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input flex-1"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10 rounded-lg cursor-pointer border dark:border-gray-700"
        />
        <button type="submit" className="btn-primary min-h-[44px]">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setName(''); setColor('#7C5CFC'); setEditingId(null); }}
            className="btn-ghost min-h-[44px]">
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="card-hover flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-gray-900 dark:text-[#F2F2F5] font-medium text-sm">{cat.name}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(cat)}
                className="text-xs font-medium text-[#7C5CFC] hover:text-[#6a4de6]">Edit</button>
              <button onClick={() => handleDelete(cat.id)}
                className="text-xs font-medium text-[#FF6B6B] hover:text-[#e05555]">Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-[#9494A0] text-center py-8">No categories yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
