import { NextRequest, NextResponse } from "next/server";
import { SuppError } from "supp-js";
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
    const result = await supp.classify(message);

    return NextResponse.json({
      intent: result.intent,
      confidence: result.confidence,
      allIntents: result.allIntents?.slice(0, 5),
      actionType: result.actionType,
      suggestedResponse: result.suggestedResponse,
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
      { error: error instanceof Error ? error.message : "Classification failed" },
      { status: 500 }
    );
  }
}
