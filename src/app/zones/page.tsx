import { prisma } from "@/lib/prisma";
import ZoneList from "@/components/ZoneList";
import Pagination from "@/components/Pagination";
import ZonesCreateLauncher from "@/components/ZonesCreateLauncher";

export default async function ZonesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const pageSize = 10;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1));
  const q = sp?.q?.trim?.() ?? "";
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        name: { contains: q },
      }
    : undefined;

  const [total, zones] = await Promise.all([
    prisma.zone.count({ where }),
    prisma.zone.findMany({
      where,
      include: { _count: { select: { materials: true } } },
      orderBy: { id: "desc" },
      take: pageSize,
      skip,
    }),
  ]);

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">창고 목록</h2>
        <ZonesCreateLauncher />
      </div>
      <div className="row g-4">
        <div className="col-12">
          <ZoneList zones={zones} page={page} pageSize={pageSize} total={total} />
        </div>
        <div className="col-12 d-flex justify-content-center">
          <Pagination page={page} pageSize={pageSize} total={total} />
        </div>
      </div>
    </div>
  );
}


