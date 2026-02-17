import { NextRequest, NextResponse } from "next/server";
import { SuppError } from "supp-js";
import { getSupp } from "@/lib/supp";

export async function GET(request: NextRequest) {
  try {
    const category =
      request.nextUrl.searchParams.get("category") || undefined;

    const supp = getSupp();
    const result = await supp.intents.list({ category });

    return NextResponse.json({
      intents: result.intents,
      total: result.total,
    });
  } catch (error) {
    if (error instanceof SuppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list intents" },
      { status: 500 }
    );
  }
}
