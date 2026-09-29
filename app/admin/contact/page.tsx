import { getContactDetails } from "@/actions/contact";
import AdminContactClient from "@/components/admin/AdminContactClient";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const contact = await getContactDetails();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contact Details</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your contact info, social links, and WhatsApp settings.
        </p>
      </div>
      <AdminContactClient contact={contact} />
    </div>
  );
}
