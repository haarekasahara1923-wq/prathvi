"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  BookOpen,
  Info,
  Phone,
  Images,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/colleges", label: "Colleges", icon: Building2 },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/contact", label: "Contact Details", icon: Phone },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">
              Admin Panel
            </div>
            <div className="text-blue-300 text-xs">Prathvi Group</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : "text-blue-300 group-hover:text-white"
                }
              />
              {item.label}
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-all mb-1"
        >
          <Building2 size={18} className="text-blue-300" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all w-full disabled:opacity-50"
          id="admin-logout-btn"
        >
          <LogOut size={18} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, #1e3a5f 0%, #0f2240 100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile: Hamburger + Overlay */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-lg"
          aria-label="Open admin menu"
        >
          <Menu size={20} />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="flex-shrink-0 w-64 flex flex-col shadow-2xl"
              style={{
                background: "linear-gradient(180deg, #1e3a5f 0%, #0f2240 100%)",
              }}
            >
              <div className="flex items-center justify-end px-3 pt-3">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>
              <SidebarContent />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
