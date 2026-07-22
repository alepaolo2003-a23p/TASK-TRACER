import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import { TaskStatus } from '../types';
import type { Task, Category } from '../types';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: TaskStatus.TODO, title: 'To Do', color: '#6b7280' },
  { status: TaskStatus.IN_PROGRESS, title: 'In Progress', color: '#f59e0b' },
  { status: TaskStatus.DONE, title: 'Done', color: '#10b981' },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    const [taskData, catData] = await Promise.all([
      taskService.getAll(),
      categoryService.getAll(),
    ]);
    setTasks(taskData);
    setCategories(catData);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const overId = over.id as string;

    const isOverColumn = columns.some((c) => c.status === overId);
    const targetStatus = isOverColumn ? (overId as TaskStatus) : task.status;

    if (targetStatus !== task.status) {
      await taskService.updateStatus(taskId, targetStatus);
      await loadData();
      return;
    }

    const columnTasks = getTasksByStatus(task.status);
    const oldIndex = columnTasks.findIndex((t) => t.id === taskId);
    const newIndex = columnTasks.findIndex((t) => t.id === overId);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks(tasks.map((t) => (t.status === task.status ? reordered.find((r) => r.id === t.id) || t : t)));
    }
  };

  const handleSave = async () => {
    setShowForm(false);
    setEditingTask(null);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await taskService.delete(id);
    await loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 dark:text-white">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <TaskForm task={editingTask} categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingTask(null); }} />
          </div>
        </div>
      )}

      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              color={col.color}
              tasks={getTasksByStatus(col.status)}
              onEdit={(task) => { setEditingTask(task); setShowForm(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
