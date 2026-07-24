import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import { TaskStatus } from '../types';
import type { Task, TaskStatus as TaskStatusType, Priority, Category } from '../types';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type ViewMode = 'kanban' | 'lista' | 'calendario';

const statusLabels: Record<string, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  IN_REVIEW: 'En revisión',
  DONE: 'Completado',
};

const priorityLabels: Record<string, string> = {
  HIGH: 'ALTA',
  MEDIUM: 'MEDIA',
  LOW: 'BAJA',
};

const statusColors: Record<string, string> = {
  TODO: '#A3A3A3',
  IN_PROGRESS: '#3B82F6',
  IN_REVIEW: '#8B5CF6',
  DONE: '#10B981',
};

const priorityColors: Record<string, string> = {
  HIGH: '#EF4444',
  MEDIUM: '#F59E0B',
  LOW: '#A3A3A3',
};

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: TaskStatus.TODO, title: statusLabels.TODO, color: '#A3A3A3' },
  { status: TaskStatus.IN_PROGRESS, title: statusLabels.IN_PROGRESS, color: '#3B82F6' },
  { status: TaskStatus.IN_REVIEW, title: statusLabels.IN_REVIEW, color: '#8B5CF6' },
  { status: TaskStatus.DONE, title: statusLabels.DONE, color: '#10B981' },
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getPriorityClass(priority: string) {
  if (priority === 'HIGH') return 'badge-high';
  if (priority === 'MEDIUM') return 'badge-medium';
  return 'badge-low';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formDefaultStatus, setFormDefaultStatus] = useState<TaskStatus>('TODO' as TaskStatus);
  const [collapsed, setCollapsed] = useState<Set<TaskStatusType>>(new Set());
  const [showAll, setShowAll] = useState<Set<TaskStatusType>>(new Set());
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatusType | ''>('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'mine' | 'withDate' | 'etiquetas'>('all');
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const loadData = useCallback(async () => {
    const params: any = {};
    if (search) params.search = search;
    if (filterStatus) params.status = filterStatus;
    if (filterPriority) params.priority = filterPriority;
    if (filterCategory) params.categoryId = filterCategory;
    const [taskData, catData] = await Promise.all([
      taskService.getAll(params),
      categoryService.getAll(),
    ]);
    setTasks(taskData);
    setCategories(catData);
  }, [search, filterStatus, filterPriority, filterCategory]);

  useEffect(() => { loadData(); }, [loadData]);

  const getTasksByStatus = (status: TaskStatusType) =>
    tasks.filter((t) => t.status === status);

  const toggleCollapsed = (status: TaskStatusType) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const toggleShowAll = (status: TaskStatusType) => {
    setShowAll((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    const isOverColumn = columns.some((c) => c.status === overId);

    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;

      const targetStatus = isOverColumn ? (overId as TaskStatusType) : task.status;

      if (targetStatus !== task.status) {
        return prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t));
      }

      const sameColumn = prev.filter((t) => t.status === task.status);
      const oldIndex = sameColumn.findIndex((t) => t.id === taskId);
      const newIndex = sameColumn.findIndex((t) => t.id === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(sameColumn, oldIndex, newIndex);
        return prev.map((t) => (t.status === task.status ? reordered.find((r) => r.id === t.id) || t : t));
      }

      return prev;
    });

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const targetStatus = isOverColumn ? (overId as TaskStatusType) : task.status;
    if (targetStatus !== task.status) {
      try {
        await taskService.updateStatus(taskId, targetStatus);
      } catch {
        await loadData();
      }
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

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterCategory && t.categoryId !== filterCategory) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTab === 'withDate' && !t.dueDate) return false;
      if (filterTab === 'etiquetas' && !t.categoryId) return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterCategory, search, filterTab]);

  const calendarGrid = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    const today = new Date();
    const tasksByDate = new Map<string, Task[]>();
    filteredTasks.forEach((t) => {
      if (t.dueDate) {
        const key = t.dueDate.substring(0, 10);
        if (!tasksByDate.has(key)) tasksByDate.set(key, []);
        tasksByDate.get(key)!.push(t);
      }
    });
    return { cells, today, tasksByDate, daysInMonth, startPad };
  }, [calendarDate, filteredTasks]);

  const renderKanban = () => (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 pb-4 md:overflow-x-auto md:snap-x md:snap-mandatory md:[-webkit-overflow-scrolling:touch] lg:overflow-x-visible lg:snap-none">
        {columns.map((col) => (
          <div key={col.status} className="w-full md:min-w-[280px] md:snap-center md:flex-shrink-0 lg:min-w-0 lg:flex-1">
            <KanbanColumn
              status={col.status}
              title={col.title}
              color={col.color}
              tasks={getTasksByStatus(col.status)}
              collapsed={collapsed.has(col.status)}
              showAll={showAll.has(col.status)}
              onToggleCollapsed={() => toggleCollapsed(col.status)}
              onToggleShowAll={() => toggleShowAll(col.status)}
              onEdit={(task) => { setEditingTask(task); setShowForm(true); }}
              onDelete={handleDelete}
              onAddTask={() => { setFormDefaultStatus(col.status); setEditingTask(null); setShowForm(true); }}
            />
          </div>
        ))}
      </div>
      <p className="text-micro text-subtle text-center pb-4 hidden md:block">Mantén pulsada una tarjeta para arrastrarla entre columnas</p>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-3">
            <TaskCard task={activeTask} onEdit={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  const renderListDesktop = () => (
    <div className="card overflow-hidden hidden md:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-surface-muted">
            <th className="text-left px-4 py-2.5 text-micro text-foreground-muted font-medium uppercase tracking-wider">Tarea</th>
            <th className="text-left px-4 py-2.5 text-micro text-foreground-muted font-medium uppercase tracking-wider">Estado</th>
            <th className="text-left px-4 py-2.5 text-micro text-foreground-muted font-medium uppercase tracking-wider">Prioridad</th>
            <th className="text-left px-4 py-2.5 text-micro text-foreground-muted font-medium uppercase tracking-wider">Etiqueta</th>
            <th className="text-left px-4 py-2.5 text-micro text-foreground-muted font-medium uppercase tracking-wider">Fecha</th>
            <th className="w-20 px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className="border-b last:border-none hover:bg-foreground/[0.02] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="priority-dot" style={{ backgroundColor: priorityColors[task.priority] }} />
                  <span className="text-sm text-foreground font-medium">{task.title}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[task.status] }} />
                  <span className="text-xs text-foreground-muted">{statusLabels[task.status]}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`${getPriorityClass(task.priority)} text-micro`}>
                  {priorityLabels[task.priority]}
                </span>
              </td>
              <td className="px-4 py-3">
                {task.categoryName ? (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-micro text-white font-medium"
                    style={{ backgroundColor: task.categoryColor || '#A3A3A3' }}
                  >
                    #{task.categoryName}
                  </span>
                ) : (
                  <span className="text-xs text-subtle">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-foreground-muted">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setEditingTask(task); setShowForm(true); }} className="text-micro text-foreground-muted hover:text-foreground font-medium transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="text-micro text-[#EF4444] hover:text-[#B91C1C] font-medium transition-colors">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredTasks.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-sm text-subtle">No hay tareas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderListMobile = () => (
    <div className="flex flex-col gap-2 md:hidden">
      {filteredTasks.map((task) => (
        <div key={task.id} className="card p-3">
          <div className="flex items-start gap-2">
            <div className="priority-dot mt-[5px]" style={{ backgroundColor: priorityColors[task.priority] }} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[task.status] }} />
                  <span className="text-xs text-foreground-muted">{statusLabels[task.status]}</span>
                </div>
                <span className={`${getPriorityClass(task.priority)} text-micro`}>
                  {priorityLabels[task.priority]}
                </span>
                {task.categoryName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-micro text-white font-medium" style={{ backgroundColor: task.categoryColor || '#A3A3A3' }}>
                    #{task.categoryName}
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-xs text-subtle">{new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-2 pt-2 border-t">
            <button onClick={() => { setEditingTask(task); setShowForm(true); }} className="text-micro text-foreground-muted hover:text-foreground font-medium transition-colors">
              Editar
            </button>
            <button onClick={() => handleDelete(task.id)} className="text-micro text-[#EF4444] hover:text-[#B91C1C] font-medium transition-colors">
              Eliminar
            </button>
          </div>
        </div>
      ))}
      {filteredTasks.length === 0 && (
        <p className="text-sm text-subtle text-center py-8">No hay tareas</p>
      )}
    </div>
  );

  const renderCalendarDesktop = () => (
    <div className="card p-4 hidden md:block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-1.5 rounded-md hover:bg-foreground/5 transition-colors">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-sm font-semibold text-foreground">{MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h3>
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-1.5 rounded-md hover:bg-foreground/5 transition-colors">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button onClick={() => setCalendarDate(new Date())} className="text-micro text-foreground-muted hover:text-foreground font-medium transition-colors">
          Hoy
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {DAY_NAMES.map((d) => (
          <div key={d} className="px-2 py-1.5 text-micro text-foreground-muted font-medium bg-surface text-center">
            {d}
          </div>
        ))}
        {calendarGrid.cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="bg-surface min-h-[90px]" />;
          const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = calendarGrid.tasksByDate.get(dateStr) || [];
          const isToday = calendarGrid.today.getFullYear() === calendarDate.getFullYear() &&
            calendarGrid.today.getMonth() === calendarDate.getMonth() &&
            calendarGrid.today.getDate() === day;
          return (
            <div key={dateStr} className={`bg-surface min-h-[90px] p-1.5 ${isToday ? 'ring-1 ring-inset ring-ring' : ''}`}>
              <span className={`text-micro font-medium ${isToday ? 'text-foreground' : 'text-foreground-muted'}`}>{day}</span>
              <div className="flex flex-col gap-0.5 mt-1">
                {dayTasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-foreground/5 cursor-pointer hover:bg-foreground/10 transition-colors"
                    onClick={() => { setEditingTask(t); setShowForm(true); }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: priorityColors[t.priority] }} />
                    <span className="text-[10px] text-foreground truncate">{t.title}</span>
                  </div>
                ))}
                {dayTasks.length > 4 && <span className="text-[10px] text-subtle pl-1">+{dayTasks.length - 4} más</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCalendarMobile = () => (
    <div className="flex flex-col gap-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-1.5 rounded-md hover:bg-foreground/5 transition-colors">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-sm font-semibold text-foreground">{MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h3>
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-1.5 rounded-md hover:bg-foreground/5 transition-colors">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button onClick={() => setCalendarDate(new Date())} className="text-micro text-foreground-muted hover:text-foreground font-medium transition-colors">
          Hoy
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: calendarGrid.daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = calendarGrid.tasksByDate.get(dateStr) || [];
          const isToday = calendarGrid.today.getFullYear() === calendarDate.getFullYear() &&
            calendarGrid.today.getMonth() === calendarDate.getMonth() &&
            calendarGrid.today.getDate() === day;
          if (dayTasks.length === 0 && !isToday) return null;
          return (
            <div key={dateStr} className={`card p-3 ${isToday ? 'ring-1 ring-ring' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${isToday ? 'text-foreground' : 'text-foreground-muted'}`}>
                  {MONTH_NAMES[calendarDate.getMonth()].substring(0, 3)} {day}
                </span>
                {dayTasks.length > 0 && <span className="text-micro text-subtle">{dayTasks.length} tareas</span>}
              </div>
              <div className="flex flex-col gap-1">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-2 py-1 rounded-[4px] bg-foreground/5 cursor-pointer hover:bg-foreground/10 transition-colors"
                    onClick={() => { setEditingTask(t); setShowForm(true); }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: priorityColors[t.priority] }} />
                    <span className="text-xs text-foreground truncate">{t.title}</span>
                    <span className={`${getPriorityClass(t.priority)} text-micro ml-auto flex-shrink-0`}>
                      {priorityLabels[t.priority]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-micro text-foreground-muted uppercase tracking-wider mb-0.5">TAREAS</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mis tareas</h1>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-md hover:bg-foreground/5 transition-colors" title="Buscar">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button onClick={toggleDarkMode} className="hidden md:flex p-2 rounded-md hover:bg-foreground/5 transition-colors" title="Cambiar tema">
            {darkMode ? (
              <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button className="hidden md:flex p-2 rounded-md hover:bg-foreground/5 transition-colors" title="Notificaciones">
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button onClick={() => { setEditingTask(null); setFormDefaultStatus('TODO' as TaskStatus); setShowForm(true); }} className="btn-primary text-sm whitespace-nowrap">
            + Nueva tarea
          </button>
          <div className="hidden md:flex items-center -space-x-1.5 ml-1">
            <div className="w-7 h-7 rounded-full bg-foreground/10 border-2 border-background flex items-center justify-center text-[10px] font-semibold text-foreground-muted">
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tareas..."
            className="input text-sm"
            autoFocus
          />
        </div>
      )}

      <div className="flex items-center gap-1 mb-4 overflow-x-auto">
        <svg className="w-4 h-4 text-foreground-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {(['all', 'mine', 'withDate', 'etiquetas'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1.5 rounded-[6px] text-sm font-medium whitespace-nowrap transition-colors ${
              filterTab === tab
                ? 'bg-foreground/10 text-foreground'
                : 'text-foreground-muted hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            {tab === 'all' ? 'Todos' : tab === 'mine' ? 'Mis tareas' : tab === 'withDate' ? 'Con fecha' : 'Etiquetas'}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
        <div className="inline-flex items-center gap-0.5 p-0.5 bg-surface-muted border rounded-[8px] self-start">
          {(['kanban', 'lista', 'calendario'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-150 ${
                viewMode === mode
                  ? 'bg-background text-foreground shadow-sm border'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {mode === 'kanban' ? 'Kanban' : mode === 'lista' ? 'Lista' : 'Calendario'}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatusType | '')} className="input w-auto text-sm">
            <option value="">Todos los estados</option>
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="DONE">Completado</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | '')} className="input w-auto text-sm">
            <option value="">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input w-auto text-sm">
            <option value="">Todas las etiquetas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
          {(filterStatus || filterPriority || filterCategory) && (
            <span className="w-2 h-2 rounded-full bg-foreground" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col gap-2 mb-4 md:hidden">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatusType | '')} className="input text-sm">
            <option value="">Todos los estados</option>
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="DONE">Completado</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | '')} className="input text-sm">
            <option value="">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input text-sm">
            <option value="">Todas las etiquetas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-surface w-full md:max-w-lg md:max-h-[90vh] md:rounded-[12px] md:shadow-xl md:p-5 p-5 rounded-t-[12px] md:rounded-b-[12px] max-h-[95vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-foreground mb-5">{editingTask ? 'Editar tarea' : 'Nueva tarea'}</h2>
            <TaskForm task={editingTask} categories={categories} onSave={handleSave} defaultStatus={formDefaultStatus} onCancel={() => { setShowForm(false); setEditingTask(null); setFormDefaultStatus('TODO' as TaskStatus); }} />
          </div>
        </div>
      )}

      {viewMode === 'kanban' && renderKanban()}
      {viewMode === 'lista' && renderListDesktop()}
      {viewMode === 'lista' && renderListMobile()}
      {viewMode === 'calendario' && renderCalendarDesktop()}
      {viewMode === 'calendario' && renderCalendarMobile()}
    </div>
  );
}
