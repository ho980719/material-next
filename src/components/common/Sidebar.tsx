"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className="d-none d-md-flex flex-column border-end bg-body-tertiary"
      style={{ width: 200 }}
    >
      <div className="p-3 border-bottom">
        <div className="fw-bold">Material App</div>
        <small className="text-secondary">Next.js + Prisma</small>
      </div>
      <nav className="nav flex-column p-2 gap-1">
        <Link
          href="/materials"
          className={`nav-link rounded ${isActive("/materials") ? "bg-primary text-white" : "text-body"}`}
        >
          자재
        </Link>
        <Link
          href="/zones"
          className={`nav-link rounded ${isActive("/zones") ? "bg-primary text-white" : "text-body"}`}
        >
          창고
        </Link>
        <div className="mt-2 pt-2 border-top" />
        {/* Export 링크 제거 */}
      </nav>
      <div className="mt-auto p-3 small text-secondary border-top">© {new Date().getFullYear()}</div>
    </aside>
  );
}


