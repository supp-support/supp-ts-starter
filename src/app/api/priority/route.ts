import { NextRequest, NextResponse } from "next/server";
import { SuppError } from "supp-ts";
import { getSupp } from "@/lib/supp";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const supp = getSupp();
    const result = await supp.priorityScore(message);

    return NextResponse.json({
      priority: result.priority,
      cost: result.cost,
    });
  } catch (error) {
    if (error instanceof SuppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Priority scoring failed" },
      { status: 500 }
    );
  }
}
