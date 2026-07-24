import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: Props) {
  const { user } = useAuth();
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
  const todayStr = today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();
  const dueDateStr = dueDate ? dueDate.toDateString() : null;
  const isOverdue = dueDate && dueDate < today;
  const isDueSoon = dueDate && !isOverdue && dueDate.getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000;

  let dateLabel: string | null = null;
  let dateColor = '';
  if (dueDate && dueDateStr === todayStr) { dateLabel = 'Hoy'; dateColor = '#F59E0B'; }
  else if (dueDate && dueDateStr === tomorrowStr) { dateLabel = 'Mañana'; dateColor = '#F59E0B'; }
  else if (isOverdue) { dateLabel = dueDate!.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); dateColor = '#EF4444'; }
  else if (isDueSoon) { dateLabel = dueDate!.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); dateColor = '#F59E0B'; }
  else if (dueDate) { dateLabel = dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); }

  const priorityColor =
    task.priority === 'HIGH' ? '#EF4444' :
    task.priority === 'MEDIUM' ? '#F59E0B' :
    '#A3A3A3';

  const categoryPastel = task.categoryColor
    ? task.categoryColor + '1A'
    : '#A3A3A31A';

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: priorityColor }}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(task)}
      className="card p-3 cursor-grab active:cursor-grabbing touch-manipulation hover:shadow-md dark:hover:border-[#333] transition-all duration-150 border-l-[3px]"
    >
      {task.categoryName && (
        <div className="flex gap-1.5 mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: categoryPastel, color: task.categoryColor || '#A3A3A3' }}
          >
            {task.categoryName}
          </span>
        </div>
      )}

      <h4 className="text-sm font-semibold text-foreground leading-snug">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-foreground-muted mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t">
        <div className="flex items-center gap-1">
          {user?.username && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold"
              style={{ backgroundColor: priorityColor + '20', color: priorityColor }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {dateLabel && (
            <div className="flex items-center gap-1" style={{ color: dateColor || '#A3A3A3' }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-medium">{dateLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
