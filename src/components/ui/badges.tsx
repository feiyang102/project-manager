import type { ProjectStatus, ProjectType, Priority } from "@/lib/types";
import { STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  idea: "bg-gray-100 text-gray-600",
  active: "bg-blue-100 text-blue-700",
  paused: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-400",
};

const TYPE_COLORS: Record<ProjectType, string> = {
  code: "bg-indigo-100 text-indigo-700",
  design: "bg-pink-100 text-pink-700",
  writing: "bg-purple-100 text-purple-700",
  learning: "bg-cyan-100 text-cyan-700",
  resource: "bg-amber-100 text-amber-700",
  life: "bg-emerald-100 text-emerald-700",
  other: "bg-gray-100 text-gray-600",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-gray-100 text-gray-500",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: ProjectType }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return null;
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function TagBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: color + "22", color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}
