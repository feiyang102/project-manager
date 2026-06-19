import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-card-bg">
      <Icon className="h-10 w-10 text-muted" />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
