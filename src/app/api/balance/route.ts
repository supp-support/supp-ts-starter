import { NextResponse } from "next/server";
import { SuppError } from "supp-ts";
import { getSupp } from "@/lib/supp";

export async function GET() {
  try {
    const supp = getSupp();
    const balance = await supp.billing.balance();

    return NextResponse.json({
      balance: balance.balance,
      currency: balance.currency,
      recentCharges: balance.recentCharges.slice(0, 5),
    });
  } catch (error) {
    if (error instanceof SuppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
