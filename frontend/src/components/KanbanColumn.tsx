import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

const VISIBLE_COUNT = 8;

interface Props {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  collapsed: boolean;
  showAll: boolean;
  onToggleCollapsed: () => void;
  onToggleShowAll: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: () => void;
}

export default function KanbanColumn({
  status,
  title,
  color,
  tasks,
  collapsed,
  showAll,
  onToggleCollapsed,
  onToggleShowAll,
  onEdit,
  onDelete,
  onAddTask,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [menuOpen, setMenuOpen] = useState(false);

  const hasMany = tasks.length > VISIBLE_COUNT;
  const visibleTasks = hasMany && !showAll ? tasks.slice(0, VISIBLE_COUNT) : tasks;

  return (
    <div
      ref={setNodeRef}
      className={`bg-surface-muted border rounded-[8px] transition-colors ${
        isOver ? 'ring-1 ring-ring' : ''
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-3 border-b">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-micro w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-foreground-muted font-medium">{tasks.length}</span>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            onClick={onAddTask}
            className="p-1 rounded-md hover:bg-foreground/5 transition-colors"
            aria-label="Añadir tarea"
          >
            <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md hover:bg-foreground/5 transition-colors"
              aria-label="Menú de columna"
            >
              <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-surface border rounded-[8px] shadow-lg z-20 py-1">
                  <button
                    onClick={() => { onToggleCollapsed(); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    {collapsed ? 'Expandir' : 'Colapsar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? 'max-h-0 opacity-0' : 'max-h-[9999px] opacity-100'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 p-3 min-h-[60px]">
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {tasks.length === 0 && (
              <p className="text-xs text-subtle text-center py-6">Suelta tareas aquí</p>
            )}
            {hasMany && !showAll && (
              <button
                onClick={onToggleShowAll}
                className="text-micro text-foreground-muted hover:text-foreground font-medium py-2 transition-colors"
              >
                Ver más ({tasks.length - VISIBLE_COUNT} restantes)
              </button>
            )}
            {hasMany && showAll && (
              <button
                onClick={onToggleShowAll}
                className="text-micro text-foreground-muted hover:text-foreground font-medium py-2 transition-colors"
              >
                Mostrar menos
              </button>
            )}
          </div>
        </SortableContext>
        <button
          onClick={onAddTask}
          className="w-full text-sm text-foreground-muted hover:text-foreground py-2.5 px-3 border-t border-dashed transition-colors"
        >
          + Añadir tarjeta
        </button>
      </div>
    </div>
  );
}
