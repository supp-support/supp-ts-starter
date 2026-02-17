import { NextResponse } from "next/server";
import { SuppError } from "supp-js";
import { getSupp } from "@/lib/supp";

export async function GET() {
  try {
    const supp = getSupp();
    const conversations = await supp.conversations.list({ limit: 5 });

    return NextResponse.json({
      conversations: conversations.map((c) => ({
        id: c.id,
        intent: c.intent,
        status: c.status,
        priority: c.priority,
        createdAt: c.createdAt,
      })),
      total: conversations.length,
    });
  } catch (error) {
    if (error instanceof SuppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list conversations" },
      { status: 500 }
    );
  }
}
