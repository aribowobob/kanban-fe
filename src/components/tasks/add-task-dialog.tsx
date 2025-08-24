"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
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
import { CreateTaskRequest } from "@/lib/types/task";
import { handleApiError } from "@/lib/api/api-client";

export default function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    const payload: CreateTaskRequest = {
      name: data.name,
      description: data.description || "",
      status: data.status,
      teams: data.teams,
      external_link: data.external_link || undefined,
    };

    createTaskMutation.mutate(payload);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Add a task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Task</DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>
              Create a new task for your team. Fill in the details below.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <TaskForm
          key={`add-task-${open}`}
          initialData={null}
          onSubmit={handleSubmit}
          isSubmitting={createTaskMutation.isPending}
          submitButtonText="Create Task"
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
