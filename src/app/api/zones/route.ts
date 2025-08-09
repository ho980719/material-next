import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createZoneSchema } from "@/lib/validation";

export async function GET() {
  const zones = await prisma.zone.findMany({
    include: { _count: { select: { materials: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(zones);
}

export async function POST(req: NextRequest) {
  const parse = createZoneSchema.safeParse(await req.json());
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  const { name, memo } = parse.data;
  try {
    const created = await prisma.zone.create({ data: { name, memo: memo ?? null } });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const e = error as { code?: string } | unknown;
    if (typeof e === "object" && e && (e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Zone name must be unique" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create zone" }, { status: 500 });
  }
}


