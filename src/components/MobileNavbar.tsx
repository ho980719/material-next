"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href;

  const go = (href: string) => {
    const el = document.getElementById("mobileMenu");
    const navigate = () => router.push(href);
    // Bootstrap Offcanvas 제어 (번들 로드 보장됨: ClientBootstrap)
    const BSObj = window as unknown as {
      bootstrap?: { Offcanvas?: { getOrCreateInstance: (el: Element) => { hide: () => void } } };
    };
    const Offcanvas = BSObj.bootstrap?.Offcanvas;
    if (el && Offcanvas) {
      const offcanvas = Offcanvas.getOrCreateInstance(el);
      const onHidden = () => navigate();
      el.addEventListener("hidden.bs.offcanvas", onHidden, { once: true } as AddEventListenerOptions);
      offcanvas.hide();
    } else {
      navigate();
    }
  };

  return (
    <nav className="navbar bg-body-tertiary d-md-none border-bottom">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" href="/materials">
          Material App
        </Link>
        <button
          className="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
          aria-controls="mobileMenu"
          aria-label="Open navigation"
        >
          <i className="bi bi-list" style={{ fontSize: 20 }} />
        </button>
      </div>

      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileMenu" aria-labelledby="mobileMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">메뉴</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column gap-1">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className={`btn text-start nav-link rounded ${isActive("/materials") ? "bg-primary text-white" : "text-body"}`}
              onClick={() => go("/materials")}
            >
              자재
            </button>
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className={`btn text-start nav-link rounded ${isActive("/zones") ? "bg-primary text-white" : "text-body"}`}
              onClick={() => go("/zones")}
            >
              창고
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}


