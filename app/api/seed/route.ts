import { fetchAndStoreSets } from "@/lib/db/scripts";
import { NextResponse } from "next/server";

export async function GET() {
  // Example seed logic
  const seedData = {
    message: "Database seeded successfully!",
    timestamp: new Date().toISOString(),
  };

  await fetchAndStoreSets();

  // Return a JSON response
  return NextResponse.json(seedData);
}
