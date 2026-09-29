import { getEnquiries } from "@/actions/enquiries";
import AdminEnquiriesClient from "@/components/admin/AdminEnquiriesClient";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Enquiries</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage admission enquiries from the website and WhatsApp.
        </p>
      </div>
      <AdminEnquiriesClient initialEnquiries={enquiries} />
    </div>
  );
}
