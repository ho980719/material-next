import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMaterialSchema } from "@/lib/validation";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const parsed = updateMaterialSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, quantity, zoneId } = parsed.data;
  const data: { name?: string; quantity?: number; zoneId?: number } = {};
  if (name !== undefined) data.name = name;
  if (quantity !== undefined) data.quantity = quantity;
  if (zoneId !== undefined) data.zoneId = zoneId;
  try {
    const updated = await prisma.material.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  await prisma.material.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


