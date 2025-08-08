import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateZoneSchema } from "@/lib/validation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const parsed = updateZoneSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, memo } = parsed.data;
  try {
    const updated = await prisma.zone.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        memo: memo ?? null,
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Zone name must be unique" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update zone" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const matCount = await prisma.material.count({ where: { zoneId: id } });
  if (matCount > 0) {
    return NextResponse.json({ error: "Cannot delete zone with materials" }, { status: 400 });
  }
  await prisma.zone.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


