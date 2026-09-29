import { getAbout } from "@/actions/about";
import AdminAboutClient from "@/components/admin/AdminAboutClient";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAbout();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">About Content</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update the content shown on the public About Us page.
        </p>
      </div>
      <AdminAboutClient about={about} />
    </div>
  );
}
