import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TaskDetailSkeleton() {
  return (
    <div className="py-6 px-4 container mx-auto">
      {/* Page Title */}
      <Skeleton className="h-8 w-32 mb-6" />

      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="h-4 w-20" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Card */}
      <Card className="gap-4 shadow-none">
        <CardHeader>
          {/* Task Title */}
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="md:flex md:gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="grow flex flex-col gap-4">
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Team Badges */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Status */}
            <Skeleton className="h-4 w-32" />

            {/* External Link */}
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="shrink-0 mt-6 md:mt-0 space-y-3">
            <Skeleton className="h-5 w-8" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 justify-end items-center">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
}
