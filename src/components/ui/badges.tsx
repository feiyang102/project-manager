import type { ProjectStatus, ProjectType, Priority } from "@/lib/types";
import { STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  idea: "bg-gray-100 text-gray-600 border-gray-200",
  active: "bg-blue-100 text-blue-700 border-blue-200",
  paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
  done: "bg-green-100 text-green-700 border-green-200",
  archived: "bg-gray-100 text-gray-400 border-gray-200",
};

const TYPE_STYLES: Record<ProjectType, string> = {
  code: "bg-indigo-100 text-indigo-700 border-indigo-200",
  design: "bg-pink-100 text-pink-700 border-pink-200",
  writing: "bg-purple-100 text-purple-700 border-purple-200",
  learning: "bg-cyan-100 text-cyan-700 border-cyan-200",
  resource: "bg-amber-100 text-amber-700 border-amber-200",
  life: "bg-emerald-100 text-emerald-700 border-emerald-200",
  other: "bg-gray-100 text-gray-600 border-gray-200",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-gray-100 text-gray-500 border-gray-200",
  medium: "bg-orange-100 text-orange-700 border-orange-200",
  high: "bg-red-100 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: ProjectType }) {
  return (
    <Badge variant="outline" className={cn("font-medium", TYPE_STYLES[type])}>
      {TYPE_LABELS[type]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return null;
  return (
    <Badge variant="outline" className={cn("font-medium", PRIORITY_STYLES[priority])}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

export function TagBadge({ name, color }: { name: string; color: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-1 font-medium"
      style={{ backgroundColor: color + "22", color, borderColor: color + "44" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </Badge>
  );
}
