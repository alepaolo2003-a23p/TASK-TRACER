import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
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
    setColor('#6366f1');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Categories</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer"
        />
        <button type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setName(''); setColor('#6366f1'); setEditingId(null); }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm">
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-gray-900 dark:text-white font-medium">{cat.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Edit</button>
              <button onClick={() => handleDelete(cat.id)}
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No categories yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
