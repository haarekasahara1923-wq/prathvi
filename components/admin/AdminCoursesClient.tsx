"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { createCourse, updateCourse, deleteCourse } from "@/actions/courses";

interface College {
  id: string;
  name: string;
}

interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  description: string | null;
  eligibility: string | null;
  order: number;
  college: { id: string; name: string };
}

interface AdminCoursesClientProps {
  courses: Course[];
  colleges: College[];
}

interface CourseFormData {
  collegeId: string;
  name: string;
  duration: string;
  description: string;
  eligibility: string;
  order: string;
}

const defaultForm: CourseFormData = {
  collegeId: "",
  name: "",
  duration: "",
  description: "",
  eligibility: "",
  order: "0",
};

export default function AdminCoursesClient({ courses, colleges }: AdminCoursesClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const openAdd = () => {
    setForm({ ...defaultForm, collegeId: colleges.length > 0 ? colleges[0].id : "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (course: Course) => {
    setForm({
      collegeId: course.collegeId,
      name: course.name,
      duration: course.duration,
      description: course.description || "",
      eligibility: course.eligibility || "",
      order: String(course.order),
    });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("collegeId", form.collegeId);
      fd.append("name", form.name);
      fd.append("duration", form.duration);
      fd.append("description", form.description);
      fd.append("eligibility", form.eligibility);
      fd.append("order", form.order);

      if (editingId) {
        await updateCourse(editingId, fd);
        toast.success("Course updated successfully");
      } else {
        await createCourse(fd);
        toast.success("Course created successfully");
      }

      setShowForm(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteCourse(id);
      toast.success("Course deleted");
      setDeleteConfirm(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={openAdd} className="btn-primary" disabled={colleges.length === 0}>
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {colleges.length === 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
          Please add a college first before adding courses.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select College *
                </label>
                <select
                  value={form.collegeId}
                  onChange={(e) => setForm((p) => ({ ...p, collegeId: e.target.value }))}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="" disabled>Select a college</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="e.g. MBA (Finance)"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    required
                    placeholder="e.g. 2 Years"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Course overview and scope..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Eligibility Criteria (Optional)
                </label>
                <input
                  type="text"
                  value={form.eligibility}
                  onChange={(e) => setForm((p) => ({ ...p, eligibility: e.target.value }))}
                  placeholder="e.g. Graduation with 50% marks"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                  min="0"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Course?</h3>
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
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-slate-600 font-medium mb-2">No courses yet</h3>
          <p className="text-slate-400 text-sm mb-4">
            Click "Add Course" to create your first course.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  College
                </th>
                <th className="hidden lg:table-cell text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">
                          {course.name}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          Order: {course.order}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-5 py-4 text-sm text-slate-600">
                    {course.college.name}
                  </td>
                  <td className="hidden lg:table-cell px-5 py-4 text-sm text-slate-600">
                    {course.duration}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(course)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(course.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
