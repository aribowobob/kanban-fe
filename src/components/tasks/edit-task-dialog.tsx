"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm, { TaskFormData } from "./task-form";
import { taskApi } from "@/lib/api/tasks";
import { Task, UpdateTaskRequest } from "@/lib/types/task";
import { handleApiError } from "@/lib/api/api-client";

interface EditTaskDialogProps {
  task: Task;
  children: React.ReactNode;
}

export default function EditTaskDialog({
  task,
  children,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: (data: { id: number; payload: UpdateTaskRequest }) =>
      taskApi.updateTask(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", task.id] });
      toast.success("Task updated successfully!");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    const payload: UpdateTaskRequest = {
      name: data.name,
      description: data.description || "",
      status: data.status,
      teams: data.teams,
      external_link: data.external_link || undefined,
    };

    updateTaskMutation.mutate({ id: task.id, payload });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>
              Edit the task details. Modify the information below.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <TaskForm
          key={`edit-task-${task.id}-${open}`}
          initialData={task}
          onSubmit={handleSubmit}
          isSubmitting={updateTaskMutation.isPending}
          submitButtonText="Update Task"
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
