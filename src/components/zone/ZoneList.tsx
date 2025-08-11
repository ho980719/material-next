"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { pushToast } from "@/components/common/ToastArea";
import ZoneEditLauncher from "@/components/zone/ZoneEditLauncher";

type Zone = {
  id: number;
  name: string;
  memo: string | null;
  _count: { materials: number };
};

export default function ZoneList({ zones, page, pageSize, total }: { zones: Zone[]; page: number; pageSize: number; total: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    // URL의 q를 초기값으로 반영
    try {
      const url = new URL(window.location.href);
      setQ(url.searchParams.get("q") ?? "");
    } catch {}
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const applySearch = (term: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", term);
    url.searchParams.set("page", "1");
    router.replace(`${url.pathname}?${url.searchParams.toString()}`);
  };
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const onDelete = async (id: number) => {
    setError(null);
    const res = await fetch(`/api/zones/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "삭제 실패");
      return;
    }
    pushToast("삭제되었습니다", "success");
    router.refresh();
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
          <h5 className="card-title m-0">창고 목록</h5>
          <div className="d-flex gap-2">
            <form
              className="d-flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const term = inputRef.current?.value?.trim() ?? "";
                applySearch(term);
              }}
            >
              <input
                ref={inputRef}
                className="form-control form-control-sm"
                placeholder="검색(창고)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-primary btn-sm flex-shrink-0">
                <i className="bi bi-search" /> 검색
              </button>
            </form>
          </div>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="table-responsive">
          <table className="table table-hover align-middle table-sticky">
            <thead>
              <tr>
                <th className="text-secondary text-center d-none d-sm-table-cell" style={{ width: "10%" }}>#</th>
                <th className="text-center" hidden>ID</th>
                <th className="text-center">이름</th>
                <th className="text-center d-none d-md-table-cell">메모</th>
                <th className="text-center" style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-5">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                zones.map((z, idx) => {
                  const rowNumber = total - ((page - 1) * pageSize) - idx;
                  return (
                    <tr key={z.id}>
                      <td className="text-secondary text-center d-none d-sm-table-cell">{rowNumber}</td>
                      <td hidden>{z.id}</td>
                      <td>
                        <span>{z.name}</span>
                        <span className="badge text-bg-secondary ms-2" title={`자재 ${z._count.materials}개`}>
                          {z._count.materials}
                        </span>
                      </td>
                      <td className="d-none d-md-table-cell">{z.memo ?? "-"}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <ZoneEditLauncher zone={z} iconOnly={true} />
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => setConfirmId(z.id)}
                            disabled={z._count.materials > 0}
                            title={z._count.materials > 0 ? `자재 ${z._count.materials}개가 있어 삭제 불가` : undefined}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        show={confirmId !== null}
        title="삭제 확인"
        body="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        confirmVariant="danger"
        onConfirm={() => {
          const id = confirmId;
          setConfirmId(null);
          if (id) onDelete(id);
        }}
        onClose={() => setConfirmId(null)}
      />
    </div>
  );
}


