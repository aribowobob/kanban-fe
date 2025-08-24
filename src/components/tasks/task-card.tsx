"use client";

import Link from "next/link";
import { Task, TeamType } from "@/lib/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
}

const teamColors: Record<TeamType, string> = {
  FRONTEND: "bg-purple-100 text-purple-800",
  DESIGN: "bg-gray-100 text-gray-800",
  BACKEND: "bg-green-100 text-green-800",
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="cursor-pointer shadow-none hover:shadow-sm transition-shadow rounded-lg">
      <Link href={`/dashboard/${task.id}`} className="block">
        <CardHeader className="gap-0">
          <CardTitle className="text-lg font-bold line-clamp-2">
            {task.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 gap-3 flex flex-col">
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.teams.length > 0 && (
            <div className="flex flex-wrap gap-1">
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
      </Link>
    </Card>
  );
}
