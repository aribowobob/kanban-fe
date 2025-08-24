"use client";

import { useMemo } from "react";
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

  const greetingText = useMemo<string>(() => {
    if (!isClient || !user) return "";
    if ((tasksData?.data ?? []).length === 0) {
      return `Hello ${user.name}`;
    }

    return `Hello ${user.name}, Here's your tasks`;
  }, [isClient, user, tasksData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 container mx-auto">
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between gap-4 items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greetingText}</h1>
          </div>
          <AddTaskDialog />
        </div>
      </div>

      <KanbanBoard tasks={tasksData?.data || []} />
    </div>
  );
}
