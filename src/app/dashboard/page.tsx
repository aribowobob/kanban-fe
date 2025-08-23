"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import KanbanBoard from "@/components/kanban/kanban-board";
import AddTaskDialog from "@/components/tasks/add-task-dialog";
import { useUserStore } from "@/lib/store/user-store";
import { authApi } from "@/lib/api/auth";
import { taskApi } from "@/lib/api/tasks";
import { handleApiError } from "@/lib/api/api-client";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, resetUser } = useUserStore();

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      deleteCookie("token");
      resetUser();
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Welcome back, {user.name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <AddTaskDialog />
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KanbanBoard tasks={tasksData?.data || []} />
      </main>
    </div>
  );
}
