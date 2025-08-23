"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { taskApi } from "@/lib/api/tasks";
import { CreateTaskRequest, TaskStatus, TeamType } from "@/lib/types/task";
import { handleApiError } from "@/lib/api/api-client";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  status: z.enum(["TO_DO", "DOING", "DONE"] as const),
  teams: z.array(z.enum(["DESIGN", "BACKEND", "FRONTEND"] as const)),
  external_link: z.string().url().optional().or(z.literal("")),
});

type TaskForm = z.infer<typeof taskSchema>;

const teams: TeamType[] = ["DESIGN", "BACKEND", "FRONTEND"];
const statuses: { value: TaskStatus; label: string }[] = [
  { value: "TO_DO", label: "TO DO" },
  { value: "DOING", label: "DOING" },
  { value: "DONE", label: "DONE" },
];

export default function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "TO_DO",
      teams: [],
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
      reset();
      setSelectedTeams([]);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleTeamChange = (team: TeamType, checked: boolean) => {
    let newTeams: TeamType[];
    if (checked) {
      newTeams = [...selectedTeams, team];
    } else {
      newTeams = selectedTeams.filter((t) => t !== team);
    }
    setSelectedTeams(newTeams);
    setValue("teams", newTeams);
  };

  const onSubmit = (data: TaskForm) => {
    const payload: CreateTaskRequest = {
      name: data.name,
      description: data.description || "",
      status: data.status,
      teams: data.teams,
      external_link: data.external_link || undefined,
    };

    createTaskMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add a task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Task</DialogTitle>
          <DialogDescription>
            Create a new task for your team. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name *</Label>
            <Input
              id="name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_link">External Link</Label>
            <Input
              id="external_link"
              type="url"
              placeholder="https://..."
              {...register("external_link")}
              className={errors.external_link ? "border-red-500" : ""}
            />
            {errors.external_link && (
              <p className="text-sm text-red-500">
                {errors.external_link.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Team Assignment</Label>
            <div className="space-y-2">
              {teams.map((team) => (
                <div key={team} className="flex items-center space-x-2">
                  <Checkbox
                    id={team}
                    checked={selectedTeams.includes(team)}
                    onCheckedChange={(checked) =>
                      handleTeamChange(team, checked as boolean)
                    }
                  />
                  <Label htmlFor={team} className="text-sm">
                    {team}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(value: TaskStatus) => setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
