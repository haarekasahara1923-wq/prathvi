import { getGalleryItems } from "@/actions/gallery";
import AdminGalleryClient from "@/components/admin/AdminGalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gallery</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload and manage photos and videos for the public gallery.
        </p>
      </div>
      <AdminGalleryClient initialItems={items} />
    </div>
  );
}
