import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskApi } from "@/lib/api/tasks";
import {
  Task,
  TaskStatus,
  UpdateTaskRequest,
  GetTasksResponse,
} from "@/lib/types/task";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
      task,
    }: {
      taskId: number;
      newStatus: TaskStatus;
      task: Task;
    }) => {
      const updateData: UpdateTaskRequest = {
        name: task.name,
        description: task.description,
        status: newStatus,
        teams: task.teams,
        external_link: task.external_link,
      };

      return taskApi.updateTask(taskId, updateData);
    },
    onMutate: async ({ taskId, newStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<GetTasksResponse>([
        "tasks",
      ]);

      // Optimistically update the cache
      if (previousTasks) {
        const updatedTasks = {
          ...previousTasks,
          data: previousTasks.data.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          ),
        };
        queryClient.setQueryData<GetTasksResponse>(["tasks"], updatedTasks);
      }

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onSuccess: (data, variables) => {
      // Show success notification with improved styling
      toast.success("Task moved successfully!", {
        description: `"${variables.task.name}" is now in ${getStatusDisplayName(
          variables.newStatus
        )}`,
        duration: 3000,
      });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      // Show error notification
      toast.error("Failed to move task", {
        description: `Could not move "${variables.task.name}". Please try again.`,
        duration: 4000,
      });
      console.error("Error updating task:", error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

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
