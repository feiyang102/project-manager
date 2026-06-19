"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Tags,
  Clock,
  Archive,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "仪表盘", icon: LayoutDashboard },
  { href: "/projects", label: "项目", icon: FolderKanban },
  { href: "/files", label: "文件收藏", icon: Star },
  { href: "/tags", label: "标签", icon: Tags },
  { href: "/recent", label: "最近访问", icon: Clock },
  { href: "/archive", label: "归档", icon: Archive },
  { href: "/settings", label: "设置", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar-bg text-sidebar-fg">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-5">
        <FolderKanban className="h-5 w-5 text-sidebar-active" />
        <span className="text-sm font-semibold text-white">项目与文件管理</span>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sm font-normal",
                  isActive
                    ? "bg-sidebar-active/15 text-white hover:bg-sidebar-active/20 hover:text-white"
                    : "text-sidebar-fg hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-white/10" />

      {/* Footer */}
      <div className="px-5 py-3">
        <p className="text-xs text-sidebar-fg/60">V1.0 · 本地管理后台</p>
      </div>
    </aside>
  );
}
