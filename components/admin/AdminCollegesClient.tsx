"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createCollege, updateCollege, deleteCollege, toggleCollegeActive } from "@/actions/colleges";

interface Course {
  id: string;
  name: string;
  duration: string;
}

interface College {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  address?: string | null;
  order: number;
  isActive: boolean;
  courses: Course[];
  _count: { courses: number; enquiries: number };
}

interface AdminCollegesClientProps {
  colleges: College[];
}

interface CollegeFormData {
  name: string;
  description: string;
  address: string;
  order: string;
  isActive: boolean;
  imageUrl: string;
  imagePublicId: string;
}

const defaultForm: CollegeFormData = {
  name: "",
  description: "",
  address: "",
  order: "0",
  isActive: true,
  imageUrl: "",
  imagePublicId: "",
};

export default function AdminCollegesClient({ colleges }: AdminCollegesClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CollegeFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (college: College) => {
    setForm({
      name: college.name,
      description: college.description,
      address: college.address || "",
      order: String(college.order),
      isActive: college.isActive,
      imageUrl: college.imageUrl || "",
      imagePublicId: college.imagePublicId || "",
    });
    setEditingId(college.id);
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const paramsRes = await fetch("/api/upload?folder=colleges&type=image");
      const params = await paramsRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", params.apiKey);
      formData.append("timestamp", params.timestamp);
      formData.append("signature", params.signature);
      formData.append("folder", params.folder);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`
          );
          xhr.send(formData);
        }
      );

      setForm((prev) => ({
        ...prev,
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      }));
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("address", form.address);
      fd.append("order", form.order);
      fd.append("isActive", String(form.isActive));
      if (form.imageUrl) fd.append("imageUrl", form.imageUrl);
      if (form.imagePublicId) fd.append("imagePublicId", form.imagePublicId);

      if (editingId) {
        await updateCollege(editingId, fd);
        toast.success("College updated successfully");
      } else {
        await createCollege(fd);
        toast.success("College created successfully");
      }

      setShowForm(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save college");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteCollege(id);
      toast.success("College deleted");
      setDeleteConfirm(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete college");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleCollegeActive(id, !isActive);
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-end mb-5">
        <button
          onClick={openAdd}
          className="btn-primary"
          id="add-college-btn"
        >
          <Plus size={16} />
          Add College
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit College" : "Add New College"}
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
                  College Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="e.g. Prathvi Institute of Management"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Brief description of this college..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="College-specific address if different"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  College Image
                </label>
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {form.imageUrl ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                    <Image src={form.imageUrl} alt="College" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, imageUrl: "", imagePublicId: "" }))}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-sm">Uploading {uploadProgress}%...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        <span className="text-sm">Click to upload image</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={String(form.isActive)}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isActive: e.target.value === "true" }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
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
                  disabled={isSubmitting || isUploading}
                  className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update College" : "Create College"}
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete College?</h3>
            <p className="text-slate-500 text-sm mb-5">
              This will permanently delete the college and all its courses. This action cannot
              be undone.
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

      {/* Colleges List */}
      {colleges.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="text-4xl mb-3">🏫</div>
          <h3 className="text-slate-600 font-medium mb-2">No colleges yet</h3>
          <p className="text-slate-400 text-sm mb-4">
            Click "Add College" to create your first college.
          </p>
          <button onClick={openAdd} className="btn-primary mx-auto">
            <Plus size={16} /> Add First College
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  College
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((college) => (
                <tr
                  key={college.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {college.imageUrl ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={college.imageUrl}
                            alt={college.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">
                            {college.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-800 text-sm">
                          {college.name}
                        </div>
                        <div className="text-slate-400 text-xs">
                          Order: {college.order}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-5 py-4 text-sm text-slate-600">
                    {college._count.courses} course{college._count.courses !== 1 ? "s" : ""}
                  </td>
                  <td className="hidden md:table-cell px-5 py-4">
                    <button
                      onClick={() => handleToggle(college.id, college.isActive)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        college.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {college.isActive ? (
                        <ToggleRight size={14} />
                      ) : (
                        <ToggleLeft size={14} />
                      )}
                      {college.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(college)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        aria-label={`Edit ${college.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(college.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        aria-label={`Delete ${college.name}`}
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
