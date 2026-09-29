import Image from "next/image";
import Link from "next/link";
import { MapPin, BookOpen, MessageCircle, Clock, ChevronRight } from "lucide-react";

interface Course {
  id: string;
  name: string;
  duration: string;
  description?: string | null;
}

interface College {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  address?: string | null;
  courses: Course[];
}

interface CollegeCardProps {
  college: College;
  compact?: boolean;
  whatsappNumber?: string;
}

export default function CollegeCard({
  college,
  compact = false,
  whatsappNumber,
}: CollegeCardProps) {
  const waMessage = `Hello Prathvi Group of College! I am interested in ${college.name} and would like to know more about courses and admissions.`;
  const waUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-50 overflow-hidden card-hover flex flex-col">
      {/* College Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-blue-900 to-blue-700 flex-shrink-0">
        {college.imageUrl ? (
          <Image
            src={college.imageUrl}
            alt={`${college.name} campus`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <BookOpen size={40} className="mx-auto mb-2 text-amber-300 opacity-80" />
              <p className="text-sm font-medium opacity-80">{college.name}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-md">
            {college.courses.length} Course{college.courses.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-blue-900 text-lg mb-2 leading-tight">
          {college.name}
        </h3>

        {college.address && (
          <div className="flex items-start gap-1.5 text-slate-500 text-sm mb-3">
            <MapPin size={13} className="mt-0.5 flex-shrink-0 text-amber-500" />
            <span className="line-clamp-1">{college.address}</span>
          </div>
        )}

        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {college.description}
        </p>

        {/* Courses */}
        {!compact && college.courses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Courses Offered
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-900">
                    <th className="text-left px-3 py-2 rounded-tl-lg font-semibold text-xs">
                      Course
                    </th>
                    <th className="text-left px-3 py-2 rounded-tr-lg font-semibold text-xs">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((course, idx) => (
                    <tr
                      key={course.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-3 py-2 text-slate-700">{course.name}</td>
                      <td className="px-3 py-2 text-slate-500 flex items-center gap-1">
                        <Clock size={11} className="text-amber-500" />
                        {course.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compact: show first 3 courses as pills */}
        {compact && college.courses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {college.courses.slice(0, 3).map((course) => (
              <span
                key={course.id}
                className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-md font-medium border border-blue-100"
              >
                {course.name}
              </span>
            ))}
            {college.courses.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                +{college.courses.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
          <Link
            href="/contact#enquiry-form"
            className="flex-1 py-2 px-3 text-center text-sm font-semibold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Enquire Now
          </Link>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-2 px-3 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#25D366" }}
              aria-label={`Enquire about ${college.name} on WhatsApp`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
