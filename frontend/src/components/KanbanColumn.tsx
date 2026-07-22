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
      className={`flex-1 min-w-[280px] bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-colors ${
        isOver ? 'ring-2 ring-indigo-400' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[200px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
