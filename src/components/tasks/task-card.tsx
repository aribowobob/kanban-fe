"use client";

import Link from "next/link";
import { Task, TeamType } from "@/lib/types/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
}

const teamColors: Record<TeamType, string> = {
  DESIGN: "bg-purple-100 text-purple-800",
  BACKEND: "bg-blue-100 text-blue-800",
  FRONTEND: "bg-green-100 text-green-800",
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <Link href={`/dashboard/${task.id}`} className="block">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {task.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {task.description && (
            <CardDescription className="text-xs mb-3 line-clamp-2">
              {task.description}
            </CardDescription>
          )}

          {task.teams.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
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

          <div className="text-xs text-gray-500">
            Updated{" "}
            {formatDistanceToNow(new Date(task.updated_at), {
              addSuffix: true,
            })}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
