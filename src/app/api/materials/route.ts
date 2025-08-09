import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMaterialSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limitParam = Number(searchParams.get("limit") ?? "");
  const take = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(100, limitParam) : 50;
  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { zone: { name: { contains: q } } },
        ],
      }
    : undefined;
  const materials = await prisma.material.findMany({
    where,
    include: { zone: true },
    orderBy: { id: "desc" },
    take,
  });
  return NextResponse.json(materials);
}

export async function POST(req: NextRequest) {
  const parsed = createMaterialSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, quantity, zoneId } = parsed.data;
  try {
    const created = await prisma.material.create({
      data: { name, quantity, zoneId },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}


