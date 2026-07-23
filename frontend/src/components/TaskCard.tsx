import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityClasses: Record<string, string> = {
  HIGH: 'badge-high',
  MEDIUM: 'badge-medium',
  LOW: 'badge-low',
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

  const priorityColor =
    task.priority === 'HIGH' ? '#EF4444' :
    task.priority === 'MEDIUM' ? '#F59E0B' :
    '#A3A3A3';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card p-3 cursor-grab active:cursor-grabbing touch-manipulation hover:shadow-md dark:hover:border-[#333] transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <div
          className="priority-dot mt-[6px]"
          style={{ backgroundColor: priorityColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-foreground truncate">{task.title}</h4>
            <span className={`${priorityClasses[task.priority]} text-micro flex-shrink-0`}>
              {priorityLabels[task.priority] || task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-foreground-muted mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.categoryName && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-micro text-white font-medium"
                style={{ backgroundColor: task.categoryColor || '#A3A3A3' }}
              >
                #{task.categoryName}
              </span>
            )}
            {dueDate && (
              <span className={`text-micro ${isOverdue ? 'text-[#EF4444] font-medium' : isDueSoon ? 'text-[#F59E0B] font-medium' : 'text-subtle'}`}>
                {isOverdue ? 'Vencida' : isDueSoon ? 'Por vencer' : dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-2 pt-2 border-t">
        <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="text-micro text-foreground-muted hover:text-foreground font-medium transition-colors">
          Editar
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-micro text-[#EF4444] hover:text-[#B91C1C] font-medium transition-colors">
          Eliminar
        </button>
      </div>
    </div>
  );
}
