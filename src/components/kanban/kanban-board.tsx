"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DropAnimation,
} from "@dnd-kit/core";
import { Task, TaskStatus } from "@/lib/types/task";
import { useUpdateTaskStatus } from "@/lib/hooks/use-update-task-status";
import DroppableColumn from "@/components/kanban/droppable-column";
import DraggableTaskCard from "@/components/tasks/draggable-task-card";

interface KanbanBoardProps {
  tasks: Task[];
}

const columns: { status: TaskStatus; title: string }[] = [
  { status: "TO_DO", title: "TO DO" },
  { status: "DOING", title: "DOING" },
  { status: "DONE", title: "DONE" },
];

const getStatusDisplayName = (status: TaskStatus): string => {
  switch (status) {
    case "TO_DO":
      return "To Do";
    case "DOING":
      return "Doing";
    case "DONE":
      return "Done";
    default:
      return status;
  }
};

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTaskStatus = useUpdateTaskStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const dropAnimation: DropAnimation = {
    duration: 0, // Disable drop animation completely
    easing: "ease",
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as number;
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      setActiveTask(null);
      return;
    }

    // If dropped over a column
    if (over.data.current?.type === "column") {
      const newStatus = over.id as TaskStatus;

      if (task.status !== newStatus) {
        // Clear active task immediately to prevent double animation
        setActiveTask(null);
        updateTaskStatus.mutate({
          taskId,
          newStatus,
          task,
        });
      } else {
        // Show feedback when trying to drop in the same column
        setActiveTask(null);
        toast.info("Task is already in this column", {
          description: `"${task.name}" is already in ${getStatusDisplayName(
            task.status
          )}`,
          duration: 2000,
        });
      }
    } else {
      setActiveTask(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle dropping over a column
    if (over.data.current?.type === "column") {
      // This is handled in handleDragEnd
      return;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <DroppableColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={columnTasks}
              activeTask={activeTask}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? <DraggableTaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
