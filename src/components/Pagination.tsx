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

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPages = (): (number | "…")[] => {
    const items: (number | "…")[] = [];
    const maxButtons = 5;
    if (totalPages <= maxButtons + 2) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }
    items.push(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) items.push("…");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < totalPages - 1) items.push("…");
    items.push(totalPages);
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
        <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
          <button className="page-link" aria-label="Previous" onClick={() => go(page - 1)}>
            <i className="bi bi-chevron-left" />
          </button>
        </li>
        {items.map((it, idx) =>
          it === "…" ? (
            <li key={`e-${idx}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={it} className={`page-item ${it === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => go(it)}>
                {it}
              </button>
            </li>
          )
        )}
        <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" aria-label="Next" onClick={() => go(page + 1)}>
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


