"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/icon";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuGroups = [
  {
    title: "Geral",
    items: [{ icon: "home", label: "Início", href: "/" }],
  },
  {
    title: "Operacional",
    items: [
      { icon: "trending-up", label: "Recebíveis", href: "/operacoes" },
      { icon: "layers", label: "Lotes", href: "/lotes" },
      { icon: "user", label: "Empresas", href: "/cedentes" },
      { icon: "file-text", label: "Relatórios", href: "/relatorios" },
    ],
  },
  {
    title: "Configurações",
    items: [
      { icon: "dollar-sign", label: "Câmbio", href: "/cambio" },
      { icon: "coins", label: "Moedas", href: "/moedas" },
      { icon: "package", label: "Produtos", href: "/produtos" },
      { icon: "settings", label: "Parâmetros", href: "/parametros" },
    ],
  },
];

import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";
import { getCookie } from "@/lib/cookies";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName] = useState(() => {
    try {
      const raw = getCookie("srm_user");
      if (raw) {
        const parsed = JSON.parse(raw) as { name: string };
        if (parsed.name) return parsed.name;
      }
    } catch {
      // keep fallback "SRM"
    }
    return "SRM";
  });
  const pathname = usePathname();
  const router = useRouter();

  const displayName = userName;
  const displayShort =
    userName === "SRM"
      ? "SRM"
      : userName
          .split(" ")
          .map((w, i, a) => (i === 0 || i === a.length - 1 ? w : null))
          .filter(Boolean)
          .join(" ");

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="bg-surface-alt flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-brand-blue-900 flex flex-col border-r border-white/5 text-white transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        {/* Logo Area - Icon only */}
        <div className="mb-4 flex h-24 items-center justify-center">
          <Link href="/">
            <Image src="/assets/logo-icon.png" alt="SRM" width={42} height={42} priority style={{ height: "auto" }} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && <h4 className="mb-3 px-3 text-[11px] font-bold tracking-[0.2em] text-white/70 uppercase">{group.title}</h4>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex h-10 items-center rounded-xl transition-all duration-200",
                        isCollapsed ? "justify-center px-0" : "px-3",
                        isActive
                          ? "bg-brand-blue-500 shadow-brand-blue-500/20 text-white shadow-lg"
                          : "text-brand-blue-100/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <div className="shrink-0">
                        <Icon
                          name={item.icon}
                          size={18}
                          stroke={isActive ? 2 : 1.5}
                          className={cn(isActive ? "text-white" : "group-hover:text-white")}
                        />
                      </div>
                      {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Bottom Actions */}
        <div className="border-t border-white/5 p-4">
          <div
            className={cn(
              "flex items-center rounded-2xl border border-white/10 bg-white/5 p-2",
              isCollapsed ? "justify-center" : "justify-start",
            )}
          >
            <Avatar name={displayName} size="sm" />
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="truncate text-xs font-bold">{displayName}</p>
                <p className="truncate text-[10px] text-white/40">Administrador</p>
              </div>
            )}
            {!isCollapsed && (
              <button className="ml-auto text-white/40 transition-colors hover:text-white">
                <Icon name="slash" size={14} className="rotate-90" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-4 flex h-8 w-full items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/5 hover:text-white"
          >
            <Icon name={isCollapsed ? "arrow-right" : "arrow-left"} size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header - Compact */}
        <header className="border-border-subtle flex h-16 shrink-0 items-center justify-between border-b bg-white px-8">
          <div className="bg-surface-alt border-border-subtle group focus-within:border-brand-blue-400 flex h-9 w-80 items-center rounded-xl border px-4 transition-all focus-within:bg-white">
            <Icon name="search" size={16} className="text-fg-disabled group-focus-within:text-brand-blue-500" />
            <input
              type="text"
              placeholder="Buscar..."
              className="text-fg-1 placeholder:text-fg-disabled ml-3 w-full border-none bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-fg-1 text-sm leading-none font-bold">{displayShort}</p>
                <p className="text-fg-3 mt-1 text-[10px] font-bold tracking-widest uppercase opacity-60">Administrador</p>
              </div>
              <Avatar name={displayName} size="sm" />
              <button
                onClick={handleLogout}
                className="bg-srm-danger-50 text-srm-danger-600 hover:bg-srm-danger-100 border-srm-danger-100 ml-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-all"
                title="Sair do sistema"
              >
                <Icon name="log-out" size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden p-8">{children}</main>
      </div>
    </div>
  );
}
