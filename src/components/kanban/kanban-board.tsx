"use client";

import { Task, TaskStatus } from "@/lib/types/task";
import TaskCard from "@/components/tasks/task-card";

interface KanbanBoardProps {
  tasks: Task[];
}

const columns: { status: TaskStatus; title: string }[] = [
  { status: "TO_DO", title: "TO DO" },
  { status: "DOING", title: "DOING" },
  { status: "DONE", title: "DONE" },
];

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);

        return (
          <div key={column.status}>
            <h2 className="text-foreground/80 font-semibold text-sm">
              {column.title}
            </h2>
            <div className="space-y-4 mt-4">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks in this column
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
