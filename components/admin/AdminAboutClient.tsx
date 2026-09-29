"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updateAbout } from "@/actions/about";

interface AboutData {
  id?: string;
  title: string;
  description: string;
  vision: string;
  mission: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
}

interface AdminAboutClientProps {
  about: AboutData | null;
}

const defaultForm: AboutData = {
  title: "",
  description: "",
  vision: "",
  mission: "",
};

export default function AdminAboutClient({ about }: AdminAboutClientProps) {
  const [form, setForm] = useState<AboutData>(about || defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const paramsRes = await fetch("/api/upload?folder=about&type=image");
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
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("vision", form.vision);
      fd.append("mission", form.mission);
      if (form.imageUrl) fd.append("imageUrl", form.imageUrl);
      if (form.imagePublicId) fd.append("imagePublicId", form.imagePublicId);

      await updateAbout(fd);
      toast.success("About content updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={6}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Vision *
            </label>
            <textarea
              value={form.vision}
              onChange={(e) => setForm({ ...form, vision: e.target.value })}
              required
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Mission *
            </label>
            <textarea
              value={form.mission}
              onChange={(e) => setForm({ ...form, mission: e.target.value })}
              required
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            About Image
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
            <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border border-slate-200">
              <Image src={form.imageUrl} alt="About" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, imageUrl: "", imagePublicId: "" })}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="w-full max-w-md h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
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

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="btn-primary"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
