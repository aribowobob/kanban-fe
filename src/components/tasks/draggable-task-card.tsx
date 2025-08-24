"use client";

import Link from "next/link";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task, TeamType } from "@/lib/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon } from "lucide-react";

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
    opacity: isDragging ? 0 : 1, // Completely hide when dragging since we use DragOverlay
  };

  // Create event handlers that prevent dragging when clicking on links
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group shadow-none hover:shadow-md transition-all duration-200 rounded-lg gap-0 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-10 bg-blue-100 border-blue-300"
          : "hover:shadow-sm hover:bg-gray-50"
      }`}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="gap-0">
        <CardTitle className="text-lg font-bold line-clamp-2">
          <Link
            href={`/dashboard/${task.id}`}
            className="block hover:underline"
            onClick={handleLinkClick}
          >
            {task.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 gap-4 flex flex-col">
        {task.description && (
          <Link
            href={`/dashboard/${task.id}`}
            className="block"
            onClick={handleLinkClick}
          >
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
                  className="text-sm text-blue-500 hover:underline break-all"
                  onClick={handleLinkClick}
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
