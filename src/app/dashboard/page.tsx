"use client";

import { useQuery } from "@tanstack/react-query";

import KanbanBoard from "@/components/kanban/kanban-board";
import AddTaskDialog from "@/components/tasks/add-task-dialog";
import { useUserStore } from "@/lib/store/user-store";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { taskApi } from "@/lib/api/tasks";

export default function DashboardPage() {
  const { user } = useUserStore();
  const isClient = useIsClient();

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            {isClient && user && (
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            )}
          </div>
          <AddTaskDialog />
        </div>
      </div>

      <KanbanBoard tasks={tasksData?.data || []} />
    </div>
  );
}
