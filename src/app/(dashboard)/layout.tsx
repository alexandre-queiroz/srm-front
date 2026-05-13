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
    items: [
      { icon: "home", label: "Início", href: "/" },
    ]
  },
  {
    title: "Operacional",
    items: [
      { icon: "trending-up", label: "Recebíveis", href: "/operacoes" },
      { icon: "layers", label: "Lotes", href: "/lotes" },
      { icon: "user", label: "Empresas", href: "/cedentes" },
      { icon: "file-text", label: "Relatórios", href: "/relatorios" },
    ]
  },
  {
    title: "Configurações",
    items: [
      { icon: "dollar-sign", label: "Câmbio", href: "/cambio" },
      { icon: "package", label: "Produtos", href: "/produtos" },
      { icon: "settings", label: "Parâmetros", href: "/parametros" },
    ]
  }
];

import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-surface-alt overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-brand-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out border-r border-white/5",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Area - Icon only */}
        <div className="h-24 flex items-center justify-center mb-4">
          <Link href="/">
            <Image 
              src="/assets/logo-icon.png" 
              alt="SRM" 
              width={42} 
              height={42} 
              priority
              style={{ height: 'auto' }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto scrollbar-hide py-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center h-10 px-3 rounded-xl transition-all duration-200 group",
                        isActive 
                          ? "bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/20" 
                          : "text-brand-blue-100/60 hover:bg-white/5 hover:text-white"
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
                      {!isCollapsed && (
                        <span className="ml-3 font-medium text-sm">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Bottom Actions */}
        <div className="p-4 border-t border-white/5">
          <div className={cn(
            "flex items-center p-2 rounded-2xl bg-white/5 border border-white/10",
            isCollapsed ? "justify-center" : "justify-start"
          )}>
            <Avatar name="Alexandre Queiroz" size="sm" />
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-xs font-bold truncate">Alexandre Queiroz</p>
                <p className="text-[10px] text-white/40 truncate">Administrador</p>
              </div>
            )}
            {!isCollapsed && (
              <button className="ml-auto text-white/40 hover:text-white transition-colors">
                <Icon name="slash" size={14} className="rotate-90" />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-4 w-full flex items-center justify-center h-8 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"
          >
            <Icon name={isCollapsed ? "arrow-right" : "arrow-left"} size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Compact */}
        <header className="h-16 bg-white border-b border-border-subtle flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center bg-surface-alt rounded-xl px-4 h-9 w-80 border border-border-subtle group focus-within:border-brand-blue-400 focus-within:bg-white transition-all">
            <Icon name="search" size={16} className="text-fg-disabled group-focus-within:text-brand-blue-500" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none ml-3 text-sm w-full text-fg-1 placeholder:text-fg-disabled"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-border-subtle">
              <button className="w-9 h-9 rounded-lg hover:bg-surface-alt flex items-center justify-center text-fg-2 transition-colors relative">
                <Icon name="alert-circle" size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-srm-danger-500 rounded-full border-2 border-white" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-fg-1 leading-none">Alexandre Q.</p>
                <p className="text-[10px] text-fg-3 mt-1 uppercase font-bold tracking-widest opacity-60">ID: 48129</p>
              </div>
              <Avatar name="Alexandre Queiroz" size="sm" />
              <button 
                onClick={handleLogout}
                className="ml-2 w-9 h-9 rounded-lg bg-srm-danger-50 text-srm-danger-600 hover:bg-srm-danger-100 transition-all flex items-center justify-center border border-srm-danger-100 cursor-pointer"
                title="Sair do sistema"
              >
                <Icon name="log-out" size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
