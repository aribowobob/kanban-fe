"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { taskApi } from "@/lib/api/tasks";
import { UpdateTaskRequest, TaskStatus, TeamType } from "@/lib/types/task";
import { handleApiError } from "@/lib/api/api-client";

interface TaskEditPageProps {
  params: {
    taskId: string;
  };
}

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

export default function TaskEditPage({ params }: TaskEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const taskId = parseInt(params.taskId);
  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([]);

  const { data: taskData, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskApi.getTask(taskId),
    enabled: !!taskId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
  });

  // Set initial values when task data is loaded
  useEffect(() => {
    if (taskData?.data) {
      const task = taskData.data;
      reset({
        name: task.name,
        description: task.description || "",
        status: task.status,
        teams: task.teams,
        external_link: task.external_link || "",
      });
      setSelectedTeams(task.teams);
    }
  }, [taskData, reset]);

  const updateTaskMutation = useMutation({
    mutationFn: (data: UpdateTaskRequest) => taskApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success("Task updated successfully!");
      router.push(`/dashboard/${taskId}`);
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
    const payload: UpdateTaskRequest = {
      name: data.name,
      description: data.description || "",
      status: data.status,
      teams: data.teams,
      external_link: data.external_link || undefined,
    };

    updateTaskMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading task...</div>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Task not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/${taskId}`}>
                  {taskData.data.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Update the task details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                />
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
                  onValueChange={(value: TaskStatus) =>
                    setValue("status", value)
                  }
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

              <div className="flex justify-end space-x-2 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/${taskId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTaskMutation.isPending}>
                  {updateTaskMutation.isPending ? "Updating..." : "Update Task"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
