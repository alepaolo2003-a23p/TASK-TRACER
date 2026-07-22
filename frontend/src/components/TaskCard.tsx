import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const today = new Date();
  const isOverdue = dueDate && dueDate < today;
  const isDueSoon = dueDate && !isOverdue && dueDate.getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000;

  const priorityColors: Record<string, string> = {
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    LOW: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing transition-colors ${
        isOverdue
          ? 'border-red-300 dark:border-red-700'
          : isDueSoon
          ? 'border-yellow-300 dark:border-yellow-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {task.categoryName && (
          <span
            className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: task.categoryColor || '#6b7280' }}
          >
            {task.categoryName}
          </span>
        )}
        {dueDate && (
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : isDueSoon ? 'text-yellow-600 font-medium' : 'text-gray-400'}`}>
            {dueDate.toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => onEdit(task)} className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="text-xs text-red-600 hover:text-red-800 dark:text-red-400">
          Delete
        </button>
      </div>
    </div>
  );
}
