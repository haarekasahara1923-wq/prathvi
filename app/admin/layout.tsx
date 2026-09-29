import { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e3a5f",
            color: "#fff",
            borderRadius: "0.75rem",
          },
          success: {
            iconTheme: { primary: "#f59e0b", secondary: "#fff" },
          },
        }}
      />
    </div>
  );
}
