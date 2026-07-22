import { useState, type FormEvent, useEffect } from 'react';
import { TaskStatus, Priority } from '../types';
import type { Task, TaskRequest, Category } from '../types';
import { taskService } from '../services/taskService';

interface Props {
  task: Task | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

export default function TaskForm({ task, categories, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setCategoryId(task.categoryId || '');
      setRecurring(task.recurring);
      setRecurrenceRule(task.recurrenceRule || '');
    }
  }, [task]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: TaskRequest = {
        title,
        description: description || undefined,
        status,
        priority,
        dueDate: dueDate || null,
        categoryId: categoryId || null,
        recurring,
        recurrenceRule: recurrenceRule || null,
      };
      if (task) {
        await taskService.update(task.id, data);
      } else {
        await taskService.create(data);
      }
      onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Title *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)}
            className="rounded" />
          <span className="text-sm dark:text-gray-300">Recurring</span>
        </label>
        {recurring && (
          <select value={recurrenceRule} onChange={(e) => setRecurrenceRule(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm flex-1">
            <option value="">Select rule</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        )}
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-sm dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
          {loading ? 'Saving...' : task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
