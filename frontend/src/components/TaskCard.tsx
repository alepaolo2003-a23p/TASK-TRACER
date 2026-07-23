import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityStyles: Record<string, string> = {
  HIGH: 'bg-[#FF6B6B]/10 text-[#FF6B6B] dark:bg-[#FF6B6B]/20',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const priorityLabels: Record<string, string> = {
  HIGH: 'ALTA',
  MEDIUM: 'MEDIA',
  LOW: 'BAJA',
};

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card-hover p-3 cursor-grab active:cursor-grabbing touch-manipulation"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-gray-900 dark:text-[#F2F2F5] text-sm">{task.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority] || task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-[#9494A0] mt-1.5 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {task.categoryName && (
          <span
            className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: task.categoryColor || '#6b7280' }}
          >
            {task.categoryName}
          </span>
        )}
        {dueDate && (
          <span className={`text-xs ${isOverdue ? 'text-[#FF6B6B] font-bold' : isDueSoon ? 'text-yellow-500 font-medium' : 'text-gray-400 dark:text-[#9494A0]'}`}>
            {isOverdue ? 'Vencida' : isDueSoon ? 'Por vencer' : dueDate.toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="flex gap-3 mt-3 pt-2 border-t dark:border-gray-700">
        <button onClick={() => onEdit(task)} className="text-xs font-medium text-[#7C5CFC] hover:text-[#6a4de6]">
          Editar
        </button>
        <button onClick={() => onDelete(task.id)} className="text-xs font-medium text-[#FF6B6B] hover:text-[#e05555]">
          Eliminar
        </button>
      </div>
    </div>
  );
}
