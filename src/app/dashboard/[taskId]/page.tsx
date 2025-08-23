"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface TaskDetailPageProps {
  params: {
    taskId: string;
  };
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
  const taskId = parseInt(params.taskId);

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
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleDelete = () => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleEdit = () => {
    router.push(`/dashboard/${taskId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading task...</div>
      </div>
    );
  }

  if (error || !taskData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Task not found</div>
      </div>
    );
  }

  const task = taskData.data;

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
                <BreadcrumbPage>{task.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{task.name}</CardTitle>
                <CardDescription>Task details and information</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleEdit}>Edit Task</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the task.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteTaskMutation.isPending}
                      >
                        {deleteTaskMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {task.teams.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Assigned Teams</h3>
                <div className="flex flex-wrap gap-2">
                  {task.teams.map((team) => (
                    <Badge key={team} className={teamColors[team]}>
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <Badge variant="outline" className="text-sm">
                {statusLabels[task.status]}
              </Badge>
            </div>

            {task.external_link && (
              <div>
                <h3 className="text-lg font-semibold mb-2">External Link</h3>
                <a
                  href={task.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {task.external_link}
                </a>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created at:</span>{" "}
                  {format(new Date(task.created_at), "d MMMM yyyy hh:mm a")}
                </div>
                <div>
                  <span className="font-medium">Updated at:</span>{" "}
                  {format(new Date(task.updated_at), "d MMMM yyyy hh:mm a")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
