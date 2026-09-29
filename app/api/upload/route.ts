import { NextRequest, NextResponse } from "next/server";
import { getSignedUploadParams } from "@/lib/cloudinary";
import { verifyJWT } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Verify admin session
  const token = request.cookies.get("prathvi_admin_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyJWT(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "gallery";
  const resourceType =
    (searchParams.get("type") as "image" | "video") || "image";

  const validFolders = ["colleges", "gallery", "about"];
  if (!validFolders.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  const params = getSignedUploadParams(folder, resourceType);

  return NextResponse.json(params);
}
