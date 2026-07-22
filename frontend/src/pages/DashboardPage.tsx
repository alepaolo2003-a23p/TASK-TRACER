import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import type { Task, TaskStatus, Priority, Category } from '../types';
import TaskForm from '../components/TaskForm';

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

  const statusColors: Record<string, string> = {
    TODO: '#6b7280',
    IN_PROGRESS: '#f59e0b',
    DONE: '#10b981',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          + New Task
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm flex-1 min-w-[200px]"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
          <option value="">All status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
          <option value="">All priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 dark:text-white">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <TaskForm task={editingTask} categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingTask(null); }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.entries(groupedTasks) as [TaskStatus, Task[]][]).map(([status, taskList]) => (
          <div key={status} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status] }} />
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                {status === 'TODO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
              </h3>
              <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{taskList.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {taskList.map((task) => (
                <div key={task.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border dark:border-gray-600">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm dark:text-white">{task.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{task.priority}</span>
                  </div>
                  {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {task.categoryName && (
                      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: task.categoryColor || '#6b7280' }}>
                        {task.categoryName}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={`text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                      className="text-xs border rounded px-1 py-0.5 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                    <button onClick={() => { setEditingTask(task); setShowForm(true); }}
                      className="text-xs text-indigo-600 hover:text-indigo-800">Edit</button>
                    <button onClick={() => handleDelete(task.id)}
                      className="text-xs text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              ))}
              {taskList.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
