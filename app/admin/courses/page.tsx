import { getAllCourses } from "@/actions/courses";
import { getColleges } from "@/actions/colleges";
import AdminCoursesClient from "@/components/admin/AdminCoursesClient";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [courses, colleges] = await Promise.all([
    getAllCourses(),
    getColleges(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage courses offered across your colleges.
        </p>
      </div>
      <AdminCoursesClient courses={courses} colleges={colleges} />
    </div>
  );
}
