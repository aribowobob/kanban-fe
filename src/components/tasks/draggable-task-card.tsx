"use client";

import Link from "next/link";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task, TeamType } from "@/lib/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, GripVertical } from "lucide-react";

interface DraggableTaskCardProps {
  task: Task;
}

const teamColors: Record<TeamType, string> = {
  FRONTEND: "bg-purple-100 text-purple-800",
  DESIGN: "bg-gray-100 text-gray-800",
  BACKEND: "bg-green-100 text-green-800",
};

export default function DraggableTaskCard({ task }: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group shadow-none hover:shadow-sm transition-all duration-200 rounded-lg gap-0 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "shadow-lg ring-2 ring-blue-500 rotate-3 scale-105"
          : "hover:shadow-md"
      }`}
      {...attributes}
    >
      <CardHeader className="gap-0 relative">
        <div
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          {...listeners}
          title="Drag to move task"
        >
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2 pr-8">
          <Link
            href={`/dashboard/${task.id}`}
            className="block hover:underline"
          >
            {task.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 gap-4 flex flex-col">
        {task.description && (
          <Link href={`/dashboard/${task.id}`} className="block">
            <p className="text-sm text-gray-500 line-clamp-2">
              {task.description}
            </p>
          </Link>
        )}

        {(task.external_link || task.attachments.length > 0) && (
          <div className="flex items-center gap-2">
            {task.external_link && (
              <div className="flex items-center gap-2 flex-1">
                <LinkIcon className="w-4 h-4 text-gray-500" />
                <Link
                  href={task.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline truncate"
                >
                  {task.external_link}
                </Link>
              </div>
            )}
          </div>
        )}

        {task.teams.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.teams.map((team) => (
              <Badge
                key={team}
                variant="secondary"
                className={`text-xs ${teamColors[team]}`}
              >
                {team}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
