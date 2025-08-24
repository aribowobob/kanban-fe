"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/lib/types/task";
import DraggableTaskCard from "@/components/tasks/draggable-task-card";

interface DroppableColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  activeTask: Task | null;
}

export default function DroppableColumn({
  status,
  title,
  tasks,
  activeTask,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  // Check if the active task is from the same column
  const isFromSameColumn = activeTask && activeTask.status === status;
  // Only show drop feedback if it's a different column
  const showDropFeedback = isOver && !isFromSameColumn;

  return (
    <div>
      <h2 className="text-foreground/80 font-semibold text-sm px-2">{title}</h2>
      <div
        ref={setNodeRef}
        className={`mt-4 min-h-[400px] rounded-lg p-2 transition-all duration-200 ${
          showDropFeedback
            ? "bg-blue-50 border-2 border-blue-300 border-dashed shadow-inner"
            : "border-2 border-transparent"
        }`}
      >
        <SortableContext items={tasks.map((task) => task.id)}>
          <div className="space-y-4">
            {tasks.map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}

            {/* Empty state */}
            {tasks.length === 0 && (
              <div className="text-muted-foreground">
                {showDropFeedback ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Drop task here
                  </div>
                ) : isFromSameColumn && isOver ? (
                  <div className="text-gray-400">
                    Task is already in this column
                  </div>
                ) : (
                  <p className="text-sm">No tasks in this column</p>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
