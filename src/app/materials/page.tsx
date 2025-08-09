import { prisma } from "@/lib/prisma";
import MaterialList from "@/components/MaterialList";
import Pagination from "@/components/Pagination";
import MaterialsCreateLauncher from "@/components/MaterialsCreateLauncher";
import Link from "next/link";

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const pageSize = 10;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1));
  const q = sp?.q?.trim() ?? "";
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { zone: { name: { contains: q } } },
        ],
      }
    : undefined;

  const [total, materials, zones] = await Promise.all([
    prisma.material.count({ where }),
    prisma.material.findMany({ where, include: { zone: true }, orderBy: { id: "desc" }, take: pageSize, skip }),
    prisma.zone.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">자재 목록</h2>
        <div className="d-flex gap-2">
          <MaterialsCreateLauncher zones={zones} />
        </div>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <MaterialList initialItems={materials} zones={zones} page={page} pageSize={pageSize} total={total} />
        </div>
        <div className="col-12 d-flex justify-content-center">
          <Pagination page={page} pageSize={pageSize} total={total} />
        </div>
      </div>
    </div>
  );
}


