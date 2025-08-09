"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { pushToast } from "@/components/ToastArea";
import ZoneEditLauncher from "@/components/ZoneEditLauncher";

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
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // URL의 q를 초기값으로 반영
    try {
      const url = new URL(window.location.href);
      setQ(url.searchParams.get("q") ?? "");
    } catch {}
  }, []);

  const applySearch = (term: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", term);
    url.searchParams.set("page", "1");
    window.history.replaceState({}, "", url.toString());
    router.refresh();
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
            <input
              className="form-control"
              style={{ width: 240 }}
              placeholder="창고 이름 검색"
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => applySearch(v), 300);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  applySearch(q);
                }
              }}
            />
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                applySearch(q);
              }}
            >
              <i className="bi bi-search" /> 검색
            </button>
          </div>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="table-responsive">
          <table className="table table-hover align-middle table-sticky">
            <thead>
              <tr>
                <th className="text-secondary text-center" style={{ width: "10%" }}>#</th>
                <th className="text-center" style={{ width: "1%" }} hidden>ID</th>
                <th className="text-center" style={{ width: "20%" }}>이름</th>
                <th className="text-center" style={{ width: "80px" }}>자재수</th>
                <th className="text-center">메모</th>
                <th className="text-center" style={{ width: "20%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-secondary py-5">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                zones.map((z, idx) => {
                  const rowNumber = total - ((page - 1) * pageSize) - idx;
                  return (
                    <tr key={z.id}>
                      <td className="text-secondary text-center">{rowNumber}</td>
                      <td hidden>{z.id}</td>
                      <td>{z.name}</td>
                      <td className="text-end">{z._count.materials}</td>
                      <td>{z.memo ?? "-"}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <ZoneEditLauncher zone={z} />
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => setConfirmId(z.id)}
                            disabled={z._count.materials > 0}
                            title={z._count.materials > 0 ? "자재가 있는 창고는 삭제 불가" : undefined}
                          >
                            삭제
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


