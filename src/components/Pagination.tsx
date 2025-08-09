"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  pageSize: number;
  total: number;
};

export default function Pagination({ page, pageSize, total }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const blockSize = 10; // 한 블록에 보여줄 페이지 수
  const currentBlock = Math.floor((page - 1) / blockSize);
  const blockStart = currentBlock * blockSize + 1;
  const blockEnd = Math.min(blockStart + blockSize - 1, totalPages);

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPages = (): number[] => {
    const items: number[] = [];
    for (let i = blockStart; i <= blockEnd; i++) items.push(i);
    return items;
  };

  const items = buildPages();

  return (
    <nav aria-label="Pagination">
      <ul className="pagination pagination-sm pagination-modern mb-0 gap-1">
        <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
          <button className="page-link" aria-label="First" onClick={() => go(1)}>
            <i className="bi bi-chevron-double-left" />
          </button>
        </li>
        <li className={`page-item ${blockStart <= 1 ? "disabled" : ""}`}>
          <button className="page-link" aria-label="Prev block" onClick={() => go(blockStart - 1)}>
            <i className="bi bi-chevron-left" />
          </button>
        </li>
        {items.map((it) => (
          <li key={it} className={`page-item ${it === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => go(it)}>
              {it}
            </button>
          </li>
        ))}
        <li className={`page-item ${blockEnd >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" aria-label="Next block" onClick={() => go(blockEnd + 1)}>
            <i className="bi bi-chevron-right" />
          </button>
        </li>
        <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" aria-label="Last" onClick={() => go(totalPages)}>
            <i className="bi bi-chevron-double-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}


