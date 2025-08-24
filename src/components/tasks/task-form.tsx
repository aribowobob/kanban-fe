"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { TaskStatus, TeamType, Task } from "@/lib/types/task";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  status: z.enum(["TO_DO", "DOING", "DONE"] as const),
  teams: z.array(z.enum(["DESIGN", "BACKEND", "FRONTEND"] as const)),
  external_link: z.string().url().optional().or(z.literal("")),
});

export type TaskFormData = z.infer<typeof taskSchema>;

const teams: TeamType[] = ["DESIGN", "BACKEND", "FRONTEND"];
const statuses: { value: TaskStatus; label: string }[] = [
  { value: "TO_DO", label: "TO DO" },
  { value: "DOING", label: "DOING" },
  { value: "DONE", label: "DONE" },
];

interface TaskFormProps {
  initialData?: Task | null;
  onSubmit: (data: TaskFormData) => void;
  isSubmitting: boolean;
  submitButtonText: string;
  onCancel: () => void;
}

export default function TaskForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
  onCancel,
}: TaskFormProps) {
  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "TO_DO",
      teams: [],
      name: "",
      description: "",
      external_link: "",
    },
  });

  // Set initial values when initialData changes
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description || "");
      setValue("status", initialData.status);
      setValue("teams", initialData.teams);
      setValue("external_link", initialData.external_link || "");
      setSelectedTeams(initialData.teams);
    } else {
      reset({
        status: "TO_DO",
        teams: [],
        name: "",
        description: "",
        external_link: "",
      });
      setSelectedTeams([]);
    }
  }, [initialData, setValue, reset]);

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

  return (
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
          <p className="text-sm text-red-500">{errors.external_link.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium leading-none select-none">
          Team Assignment
        </p>
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
          <SelectTrigger className="w-full">
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
