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
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

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
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">{title}</h3>
        <span className="text-micro text-subtle ml-auto">{tasks.length}</span>
        <button
          onClick={onToggleCollapsed}
          className="p-0.5 rounded hover:bg-foreground/5 transition-colors"
          aria-label={collapsed ? 'Expandir' : 'Colapsar'}
        >
          <svg
            className={`w-3.5 h-3.5 text-subtle transition-transform duration-200 ${
              collapsed ? '-rotate-90' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
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
      </div>
    </div>
  );
}
