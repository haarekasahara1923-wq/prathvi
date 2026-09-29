"use client";

import { useState } from "react";
import { Search, Filter, MessageSquare, Trash2, Edit, Save, X, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { updateEnquiryStatus, deleteEnquiry } from "@/actions/enquiries";
import { useRouter } from "next/navigation";

type EnquiryStatus = "NEW" | "CONTACTED" | "CLOSED";
type EnquirySource = "FORM" | "WHATSAPP";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: string;
  status: string;
  adminNote: string | null;
  createdAt: Date;
  collegeName: string | null;
  courseName: string | null;
}

interface AdminEnquiriesClientProps {
  initialEnquiries: Enquiry[];
}

export default function AdminEnquiriesClient({ initialEnquiries }: AdminEnquiriesClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      (e.email && e.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesSource = sourceFilter === "ALL" || e.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      toast.success("Status updated");
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNote = async (id: string) => {
    try {
      const enquiry = enquiries.find((e) => e.id === id);
      await updateEnquiryStatus(id, enquiry!.status as EnquiryStatus, noteText);
      toast.success("Note saved");
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, adminNote: noteText } : e)));
      setEditingNoteId(null);
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEnquiry(id);
      toast.success("Enquiry deleted");
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-3 pr-8 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="py-2 pl-3 pr-8 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="ALL">All Sources</option>
              <option value="FORM">Website Form</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
            <p>No enquiries found matching your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((enquiry) => (
              <div key={enquiry.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
                
                {/* Info Col */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{enquiry.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      enquiry.status === "NEW" ? "bg-green-100 text-green-700" :
                      enquiry.status === "CONTACTED" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {enquiry.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      enquiry.source === "WHATSAPP" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {enquiry.source}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-400" />
                      <a href={`tel:+91${enquiry.phone}`} className="hover:text-blue-600 font-medium">
                        {enquiry.phone}
                      </a>
                    </div>
                    {enquiry.email && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">@</span>
                        <a href={`mailto:${enquiry.email}`} className="hover:text-blue-600">
                          {enquiry.email}
                        </a>
                      </div>
                    )}
                    <div className="text-slate-400 text-xs">
                      {new Date(enquiry.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {(enquiry.collegeName || enquiry.courseName) && (
                    <div className="mb-3 px-3 py-2 bg-blue-50/50 rounded-lg text-sm text-blue-900 font-medium inline-block border border-blue-100">
                      Intended for: {enquiry.collegeName} {enquiry.courseName ? `→ ${enquiry.courseName}` : ""}
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700">
                    <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider block mb-1">Message</span>
                    {enquiry.message}
                  </div>
                </div>

                {/* Actions Col */}
                <div className="md:w-64 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Update Status</label>
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Admin Note</label>
                      {editingNoteId !== enquiry.id && (
                        <button
                          onClick={() => {
                            setEditingNoteId(enquiry.id);
                            setNoteText(enquiry.adminNote || "");
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={12} />
                        </button>
                      )}
                    </div>
                    
                    {editingNoteId === enquiry.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Add internal notes..."
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveNote(enquiry.id)} className="flex-1 bg-blue-600 text-white rounded py-1 text-xs font-medium hover:bg-blue-700">Save</button>
                          <button onClick={() => setEditingNoteId(null)} className="flex-1 bg-slate-200 text-slate-700 rounded py-1 text-xs font-medium hover:bg-slate-300">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100 min-h-[40px] italic">
                        {enquiry.adminNote || "No notes yet."}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <a
                      href={`https://wa.me/91${enquiry.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 rounded text-white text-xs font-bold text-center flex items-center justify-center gap-1 hover:opacity-90"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageSquare size={12} /> Reply
                    </a>
                    <button
                      onClick={() => setDeleteConfirm(enquiry.id)}
                      className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Enquiry?</h3>
            <p className="text-slate-500 text-sm mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
