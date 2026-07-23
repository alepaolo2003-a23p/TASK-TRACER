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
        <label className="label">Title *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="input">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="input">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)}
            className="rounded accent-[#7C5CFC]" />
          <span className="text-sm text-gray-700 dark:text-[#9494A0]">Recurring</span>
        </label>
        {recurring && (
          <select value={recurrenceRule} onChange={(e) => setRecurrenceRule(e.target.value)}
            className="input flex-1">
            <option value="">Select rule</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        )}
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
