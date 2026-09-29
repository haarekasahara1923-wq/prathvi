import { getAllColleges } from "@/actions/colleges";
import AdminCollegesClient from "@/components/admin/AdminCollegesClient";

export const dynamic = "force-dynamic";

export default async function AdminCollegesPage() {
  const colleges = await getAllColleges();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Colleges</h1>
        <p className="text-slate-500 text-sm mt-1">
          Add, edit, and manage your colleges. Each college appears on the public website.
        </p>
      </div>
      <AdminCollegesClient colleges={colleges} />
    </div>
  );
}
