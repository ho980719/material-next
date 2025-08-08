import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const materials = await prisma.material.findMany({
    include: { zone: true },
    orderBy: [{ zoneId: "asc" }, { id: "asc" }],
  });

  const lines: string[] = ["# Materials", ""];
  const byZone: Map<number, { zoneName: string; items: { name: string; qty: number }[] }> = new Map();
  for (const m of materials) {
    const existing = byZone.get(m.zoneId) ?? { zoneName: m.zone.name, items: [] };
    existing.items.push({ name: m.name, qty: m.quantity });
    byZone.set(m.zoneId, existing);
  }
  for (const [, group] of byZone) {
    lines.push(`## ${group.zoneName}`);
    for (const item of group.items) lines.push(`- ${item.name} x ${item.qty}`);
    lines.push("");
  }

  const body = lines.join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=materials.md",
    },
  });
}


