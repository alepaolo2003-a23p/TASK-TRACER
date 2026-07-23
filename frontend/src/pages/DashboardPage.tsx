import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import type { Task, TaskStatus, Priority, Category } from '../types';
import TaskForm from '../components/TaskForm';

const statusColors: Record<string, string> = {
  TODO: '#6b7280',
  IN_PROGRESS: '#7C5CFC',
  DONE: '#3DD9C4',
};

const statusLabels: Record<string, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completado',
};

const priorityLabels: Record<string, string> = {
  HIGH: 'ALTA',
  MEDIUM: 'MEDIA',
  LOW: 'BAJA',
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterCategory, setFilterCategory] = useState('');

  const loadTasks = useCallback(async () => {
    const params: any = {};
    if (search) params.search = search;
    if (filterStatus) params.status = filterStatus;
    if (filterPriority) params.priority = filterPriority;
    if (filterCategory) params.categoryId = filterCategory;
    const data = await taskService.getAll(params);
    setTasks(data);
  }, [search, filterStatus, filterPriority, filterCategory]);

  const loadCategories = useCallback(async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleSave = async () => {
    setShowForm(false);
    setEditingTask(null);
    await loadTasks();
    await loadCategories();
  };

  const handleDelete = async (id: string) => {
    await taskService.delete(id);
    await loadTasks();
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    await taskService.updateStatus(task.id, newStatus);
    await loadTasks();
  };

  const groupedTasks = {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F2F2F5]">Tablero</h1>
        <button onClick={() => { setEditingTask(null); setShowForm(true); }} className="btn-primary">
          + Nueva tarea
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar tareas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 min-w-[200px]"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')} className="input w-auto">
          <option value="">Todos los estados</option>
          <option value="TODO">Por hacer</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="DONE">Completado</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | '')} className="input w-auto">
          <option value="">Todas las prioridades</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input w-auto">
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 dark:text-[#F2F2F5]">{editingTask ? 'Editar tarea' : 'Nueva tarea'}</h2>
            <TaskForm task={editingTask} categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingTask(null); }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.entries(groupedTasks) as [TaskStatus, Task[]][]).map(([status, taskList]) => (
          <div key={status} className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status] }} />
              <h3 className="font-semibold text-gray-700 dark:text-[#F2F2F5] text-sm">
                {statusLabels[status]}
              </h3>
              <span className="ml-auto text-xs bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-gray-600 dark:text-[#9494A0] font-medium">
                {taskList.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {taskList.map((task) => (
                <div key={task.id} className="card-hover p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-[#F2F2F5]">{task.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'HIGH' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>{priorityLabels[task.priority]}</span>
                  </div>
                  {task.description && <p className="text-xs text-gray-500 dark:text-[#9494A0] mt-1.5">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {task.categoryName && (
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: task.categoryColor || '#6b7280' }}>
                        {task.categoryName}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={`text-xs ${new Date(task.dueDate) < new Date() ? 'text-[#FF6B6B] font-bold' : 'text-gray-400 dark:text-[#9494A0]'}`}>
                        {new Date(task.dueDate) < new Date() ? 'Vencida' : new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t dark:border-gray-700">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                      className="text-xs border rounded-lg px-2 py-1.5 bg-white dark:bg-[#1A1A22] dark:text-[#F2F2F5] dark:border-gray-600 min-h-[36px]"
                    >
                      <option value="TODO">Por hacer</option>
                      <option value="IN_PROGRESS">En progreso</option>
                      <option value="DONE">Completado</option>
                    </select>
                    <button onClick={() => { setEditingTask(task); setShowForm(true); }}
                      className="text-xs font-medium text-[#7C5CFC] hover:text-[#6a4de6]">Editar</button>
                    <button onClick={() => handleDelete(task.id)}
                      className="text-xs font-medium text-[#FF6B6B] hover:text-[#e05555]">Eliminar</button>
                  </div>
                </div>
              ))}
              {taskList.length === 0 && (
                <p className="text-xs text-[#9494A0] text-center py-4">Sin tareas</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
