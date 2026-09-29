"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Upload, Loader2, Image as ImageIcon, Film, PlayCircle, Images } from "lucide-react";
import toast from "react-hot-toast";
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/actions/gallery";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  publicId: string | null;
  youtubeUrl: string | null;
  title: string | null;
  category: string | null;
  order: number;
}

interface AdminGalleryClientProps {
  initialItems: GalleryItem[];
}

export default function AdminGalleryClient({ initialItems }: AdminGalleryClientProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadType, setUploadType] = useState<"IMAGE" | "VIDEO" | "YOUTUBE">("IMAGE");
  const [form, setForm] = useState({ title: "", category: "", order: 0, youtubeUrl: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reset form when changing type
  const handleTypeChange = (type: "IMAGE" | "VIDEO" | "YOUTUBE") => {
    setUploadType(type);
    setForm({ title: "", category: "", order: 0, youtubeUrl: "" });
  };

  const handleFileUpload = async (file: File) => {
    if (uploadType === "YOUTUBE") return;

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const folder = "gallery";
      const resType = uploadType.toLowerCase();
      const paramsRes = await fetch(`/api/upload?folder=${folder}&type=${resType}`);
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
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${params.cloudName}/${resType}/upload`);
          xhr.send(formData);
        }
      );

      const result = await createGalleryItem({
        type: uploadType,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        title: form.title || undefined,
        category: form.category || undefined,
        order: form.order,
      });

      if (result.success) {
        toast.success(`${uploadType} uploaded successfully`);
        setShowAddForm(false);
        router.refresh(); // Or optimistically update `items` state
        // For simplicity, we trigger a refresh and could update local state
        window.location.reload(); 
      }
    } catch (err) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.youtubeUrl) return;

    setIsUploading(true);
    try {
      const result = await createGalleryItem({
        type: "VIDEO",
        url: form.youtubeUrl, // Store url directly if needed, or rely on youtubeUrl
        youtubeUrl: form.youtubeUrl,
        title: form.title || undefined,
        category: form.category || undefined,
        order: form.order,
      });

      if (result.success) {
        toast.success("YouTube video added successfully");
        setShowAddForm(false);
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to add YouTube video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsUploading(true); // Reuse loading state to disable buttons
    try {
      await deleteGalleryItem(id);
      toast.success("Item deleted");
      setDeleteConfirm(null);
      router.refresh();
      window.location.reload();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Add Gallery Item</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Type Selection */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => handleTypeChange("IMAGE")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                    uploadType === "IMAGE" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ImageIcon size={16} /> Image
                </button>
                <button
                  onClick={() => handleTypeChange("VIDEO")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                    uploadType === "VIDEO" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Film size={16} /> Video File
                </button>
                <button
                  onClick={() => handleTypeChange("YOUTUBE")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                    uploadType === "YOUTUBE" ? "bg-white shadow-sm text-red-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <PlayCircle size={16} /> YouTube
                </button>
              </div>

              {/* Common Metadata */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="E.g., Annual Sports Day 2025"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="E.g., Events, Campus, Labs"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Upload / Input Area */}
              <div className="pt-2">
                {uploadType === "YOUTUBE" ? (
                  <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        YouTube URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={form.youtubeUrl}
                        onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isUploading || !form.youtubeUrl}
                      className="w-full btn-primary justify-center py-2.5"
                    >
                      {isUploading ? "Saving..." : "Add YouTube Video"}
                    </button>
                  </form>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileRef}
                      accept={uploadType === "IMAGE" ? "image/*" : "video/*"}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={isUploading}
                      className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all bg-slate-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span className="text-sm font-medium">Uploading {uploadProgress}%...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} />
                          <span className="text-sm font-medium">
                            Click to select {uploadType === "IMAGE" ? "Image" : "Video"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Item?</h3>
            <p className="text-slate-500 text-sm mb-5">
              This will permanently remove the item from the gallery and Cloudinary.
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
                disabled={isUploading}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isUploading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Images size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-600 font-medium mb-2">Gallery is empty</h3>
          <p className="text-slate-400 text-sm mb-4">
            Upload images and videos to showcase your campus life.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden aspect-[4/3]">
              {item.type === "IMAGE" ? (
                <Image src={item.url} alt={item.title || "Gallery"} fill className="object-cover" />
              ) : item.youtubeUrl ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <PlayCircle size={40} className="text-red-500" />
                </div>
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                   <video src={item.url} className="w-full h-full object-cover opacity-50" />
                   <Film size={32} className="text-white absolute" />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  {item.category && (
                    <span className="inline-block px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded mb-1">
                      {item.category}
                    </span>
                  )}
                  {item.title && (
                    <p className="text-white text-xs font-medium line-clamp-2">
                      {item.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
