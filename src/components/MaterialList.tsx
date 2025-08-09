"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { pushToast } from "@/components/ToastArea";
import MaterialEditLauncher from "@/components/MaterialEditLauncher";

type Zone = { id: number; name: string };
type Material = { id: number; name: string; quantity: number; zoneId: number; zone: Zone };

export default function MaterialList({ initialItems, zones, page, pageSize, total }: { initialItems: Material[]; zones: Zone[]; page: number; pageSize: number; total: number }) {
  const router = useRouter();
  const [items, setItems] = useState<Material[]>(initialItems);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  const zoneById = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const search = async (term: string) => {
    // 서버 사이드 쿼리로 일원화: URL만 변경하여 페이지 전체를 최신 q 기준으로 리렌더
    const url = new URL(window.location.href);
    url.searchParams.set("q", term);
    url.searchParams.set("page", "1");
    // 히스토리 누적 피하고 즉시 서버 리프레시
    window.history.replaceState({}, "", url.toString());
    router.refresh();
  };

  const updateRow = async (m: Material, updates: Partial<Pick<Material, "quantity" | "zoneId">>) => {
    setError(null);
    const res = await fetch(`/api/materials/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "수정 실패");
      return;
    }
    router.refresh();
  };

  const onDelete = async (m: Material) => {
    setError(null);
    const res = await fetch(`/api/materials/${m.id}`, { method: "DELETE" });
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
          <h5 className="card-title m-0">자재 목록</h5>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              style={{ width: 240 }}
              placeholder="검색(자재명/zone명)"
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => search(v), 300);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") search(q);
              }}
            />
            <button className="btn btn-outline-primary" onClick={() => search(q)}>
              <i className="bi bi-search" /> 검색
            </button>
          </div>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="table-responsive">
          <table className="table table-hover align-middle table-sticky">
            <thead>
              <tr>
                <th style={{ width: "10%" }} className="text-secondary text-center">#</th>
                <th style={{ width: "1%" }} className="text-center" hidden>ID</th>
                <th className="text-center">이름</th>
                <th style={{ width: "30%" }} className="text-center">창고</th>
                <th style={{ width: "50px" }} className="text-center">수량</th>
                <th style={{ width: "20%" }} className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-secondary py-5">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((m, idx) => {
                  const rowNumber = total - ((page - 1) * pageSize) - idx;
                  return (
                    <tr key={m.id}>
                      <td className="text-secondary text-center">{rowNumber}</td>
                      <td hidden>{m.id}</td>
                      <td>{m.name}</td>
                      <td className="text-center">{zoneById.get(m.zoneId)?.name}</td>
                      <td className="text-end">{m.quantity}</td>
                      <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <MaterialEditLauncher material={m} zones={zones} />
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setConfirmId(m.id)}
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
          const target = items.find((x) => x.id === confirmId);
          setConfirmId(null);
          if (target) onDelete(target);
        }}
        onClose={() => setConfirmId(null)}
      />
    </div>
  );
}


