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

const statusLabels: Record<string, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completado',
};

const priorityLabels: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

export default function TaskForm({ task, categories, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setCategoryId(task.categoryId || '');
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
        recurring: false,
        recurrenceRule: null,
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

  const handleDelete = async () => {
    if (!task) return;
    setLoading(true);
    try {
      await taskService.delete(task.id);
      onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full text-lg font-medium text-foreground bg-transparent border-none outline-none placeholder-subtle p-0"
          placeholder="Título de la tarea"
          autoFocus
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full text-sm text-foreground bg-surface-muted border rounded-[6px] px-3 py-2 outline-none focus:ring-1 focus:ring-ring placeholder-subtle resize-none"
          placeholder="Añade una descripción..."
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Estado</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="input text-sm">
            <option value="TODO">{statusLabels.TODO}</option>
            <option value="IN_PROGRESS">{statusLabels.IN_PROGRESS}</option>
            <option value="DONE">{statusLabels.DONE}</option>
          </select>
        </div>
        <div>
          <label className="label">Prioridad</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="input text-sm">
            <option value="LOW">{priorityLabels.LOW}</option>
            <option value="MEDIUM">{priorityLabels.MEDIUM}</option>
            <option value="HIGH">{priorityLabels.HIGH}</option>
          </select>
        </div>
        <div>
          <label className="label">Fecha límite</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input text-sm" />
        </div>
      </div>
      <div>
        <label className="label">Etiqueta</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input text-sm">
          <option value="">Sin etiqueta</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div>
          {task && (
            <button type="button" onClick={handleDelete} disabled={loading} className="btn-destructive">
              Eliminar tarea
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Guardando...' : task ? 'Guardar' : 'Crear tarea'}
          </button>
        </div>
      </div>
    </form>
  );
}
