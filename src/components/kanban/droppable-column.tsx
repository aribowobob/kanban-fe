"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/lib/types/task";
import DraggableTaskCard from "@/components/tasks/draggable-task-card";

interface DroppableColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

export default function DroppableColumn({
  status,
  title,
  tasks,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <div>
      <h2 className="text-foreground/80 font-semibold text-sm">{title}</h2>
      <div
        ref={setNodeRef}
        className={`mt-4 min-h-[400px] rounded-lg p-2 transition-all duration-200 ${
          isOver
            ? "bg-blue-50 border-2 border-blue-300 border-dashed shadow-inner"
            : "border-2 border-transparent"
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isOver ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Drop task here
                  </div>
                ) : (
                  "No tasks in this column"
                )}
              </div>
            ) : (
              tasks.map((task) => (
                <DraggableTaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
