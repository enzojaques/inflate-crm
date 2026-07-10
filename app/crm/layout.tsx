"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Kanban,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { CRMProvider } from "@/lib/crm-store";

const NAV = [
  { href: "/crm", label: "Leads", icon: Users, exact: true },
  { href: "/crm/follow-ups", label: "Follow-Ups", icon: Bell, exact: false },
  { href: "/crm/pipeline", label: "Pipeline", icon: Kanban, exact: false },
  { href: "/crm/companies", label: "Companies", icon: Building2, exact: false },
  { href: "/crm/analytics", label: "Analytics", icon: BarChart3, exact: false },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0d0d0d] min-h-screen">
      {/* Logo */}
      <div className="px-5 pt-7 pb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold tracking-tight leading-none">Inflate AI</p>
            <p className="text-white/40 text-[10px] mt-0.5 leading-none">CRM System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? "text-violet-400" : ""}`}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 text-white/20" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-white/[0.06]">
        <p className="text-white/20 text-[10px] leading-relaxed">
          © 2025 Inflate AI
          <br />
          All rights reserved
        </p>
      </div>
    </aside>
  );
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <div className="flex min-h-screen bg-[#f5f5f4]">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </CRMProvider>
  );
}
