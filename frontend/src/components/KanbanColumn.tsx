import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface Props {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumn({ status, title, color, tasks, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] md:min-w-0 bg-gray-100/50 dark:bg-[#1A1A22]/50 rounded-xl p-4 transition-colors ${
        isOver ? 'ring-2 ring-[#7C5CFC]' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="font-semibold text-gray-700 dark:text-[#F2F2F5] text-sm">{title}</h3>
        <span className="ml-auto text-xs bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-gray-600 dark:text-[#9494A0] font-medium">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[120px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <p className="text-xs text-[#9494A0] text-center py-6">Suelta tareas aquí</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
