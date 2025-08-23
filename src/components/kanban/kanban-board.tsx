"use client";

import { Task, TaskStatus } from "@/lib/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);

        return (
          <Card key={column.status} className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{column.title}</span>
                <span className="text-sm font-normal text-gray-500">
                  {columnTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tasks in this column
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
