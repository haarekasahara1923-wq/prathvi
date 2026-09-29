import Link from "next/link";
import { getDashboardStats } from "@/actions/enquiries";
import {
  Building2,
  BookOpen,
  Images,
  MessageSquare,
  ExternalLink,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Colleges",
      value: stats.colleges,
      icon: <Building2 size={22} />,
      href: "/admin/colleges",
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Total Courses",
      value: stats.courses,
      icon: <BookOpen size={22} />,
      href: "/admin/courses",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Gallery Items",
      value: stats.galleryItems,
      icon: <Images size={22} />,
      href: "/admin/gallery",
      color: "from-purple-500 to-purple-700",
    },
    {
      label: "New Enquiries",
      value: stats.newEnquiries,
      icon: <MessageSquare size={22} />,
      href: "/admin/enquiries",
      color: "from-amber-500 to-amber-700",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, Admin. Here's what's happening.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} text-white`}
              >
                {card.icon}
              </div>
              <ExternalLink
                size={14}
                className="text-slate-300 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <div className="text-3xl font-extrabold text-slate-800 mb-1">
              {card.value}
            </div>
            <div className="text-sm text-slate-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Latest Enquiries */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Latest Enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all →
          </Link>
        </div>

        {stats.latestEnquiries.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.latestEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">
                    {enquiry.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800 text-sm">
                      {enquiry.name}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 text-sm">{enquiry.phone}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        enquiry.status === "NEW"
                          ? "bg-green-100 text-green-700"
                          : enquiry.status === "CONTACTED"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {enquiry.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        enquiry.source === "WHATSAPP"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {enquiry.source === "WHATSAPP" ? "WhatsApp" : "Form"}
                    </span>
                  </div>
                  {(enquiry.collegeName || enquiry.courseName) && (
                    <p className="text-slate-500 text-xs mt-0.5">
                      {enquiry.collegeName}
                      {enquiry.courseName && ` — ${enquiry.courseName}`}
                    </p>
                  )}
                  <p className="text-slate-600 text-xs mt-1 line-clamp-1">
                    {enquiry.message}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs flex-shrink-0">
                  <Clock size={11} />
                  {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
