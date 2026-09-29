import { NextRequest, NextResponse } from "next/server";
import { submitEnquiry } from "@/actions/enquiries";
import { getClientIP } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  try {
    const body = await request.json();
    const result = await submitEnquiry(body, ip);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }

    return NextResponse.json({ success: true, enquiry: result.enquiry });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
