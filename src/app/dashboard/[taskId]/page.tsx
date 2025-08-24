"use client";

import { use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { taskApi } from "@/lib/api/tasks";
import { TeamType } from "@/lib/types/task";
import { handleApiError } from "@/lib/api/api-client";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import EditTaskDialog from "@/components/tasks/edit-task-dialog";
import TaskDetailSkeleton from "@/components/tasks/task-detail-skeleton";

interface TaskDetailPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

const teamColors: Record<TeamType, string> = {
  DESIGN: "bg-purple-100 text-purple-800",
  BACKEND: "bg-blue-100 text-blue-800",
  FRONTEND: "bg-green-100 text-green-800",
};

const statusLabels = {
  TO_DO: "TO DO",
  DOING: "DOING",
  DONE: "DONE",
};

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { taskId: taskIdParam } = use(params);
  const taskId = parseInt(taskIdParam);

  const {
    data: taskData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskApi.getTask(taskId),
    enabled: !!taskId,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
      router.back();
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleDelete = () => {
    deleteTaskMutation.mutate(taskId);
  };

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (error || !taskData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Task not found</div>
      </div>
    );
  }

  const task = taskData.data;

  return (
    <div className="py-6 px-4 container mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 block mb-6 leading-12">
        Task Detail
      </h1>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{task.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="gap-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">{task.name}</CardTitle>
        </CardHeader>
        <CardContent className="md:flex md:gap-4 lg:gap-8">
          <div className="grow flex flex-col gap-4">
            {task.description && (
              <div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {task.teams.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.teams.map((team) => (
                  <Badge key={team} className={teamColors[team]}>
                    {team}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {`Status: ${statusLabels[task.status]}`}
            </p>

            {task.external_link && (
              <div className="flex gap-2 items-center">
                <LinkIcon className="size-4 text-muted-foreground" />
                <Link
                  href={task.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {task.external_link}
                </Link>
              </div>
            )}
          </div>

          <div className="shrink-0 text-muted-foreground text-sm mt-6 md:mt-0">
            <p className="font-semibold">Info</p>
            <div>
              <span className="font-medium">Created at:</span>{" "}
              {format(new Date(task.created_at), "d MMMM yyyy hh:mm a")}
            </div>
            <div>
              <span className="font-medium">Updated at:</span>{" "}
              {format(new Date(task.updated_at), "d MMMM yyyy hh:mm a")}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4 justify-end items-center">
        <EditTaskDialog task={task}>
          <Button>Edit Task</Button>
        </EditTaskDialog>
        <span>or</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-destructive px-0">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure want to delete this task?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteTaskMutation.isPending}
              >
                {deleteTaskMutation.isPending ? "Deleting..." : "Yes, delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
