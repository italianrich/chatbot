import { NextResponse } from "next/server";
import { readInbox } from "@/lib/storage";

export async function GET() {
  try {
    const data = await readInbox();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading inbox:", error);
    return NextResponse.json({ error: "Failed to fetch inbox" }, { status: 500 });
  }
}
