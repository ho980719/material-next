"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { pushToast } from "@/components/ToastArea";
import MaterialEditLauncher from "@/components/MaterialEditLauncher";

type UIZone = { id: number; name: string };
type UIMaterial = { id: number; name: string; quantity: number | null; zoneId: number; zone: UIZone };

export default function MaterialList({ initialItems, zones, page, pageSize, total }: { initialItems: UIMaterial[]; zones: UIZone[]; page: number; pageSize: number; total: number }) {
  const router = useRouter();
  const [items, setItems] = useState<UIMaterial[]>(initialItems);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  const zoneById = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const search = (term: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", term);
    url.searchParams.set("page", "1");
    // 히스토리 누적 없이 soft navigation으로 SSR 재요청
    router.replace(`${url.pathname}?${url.searchParams.toString()}`);
  };

  // updateRow: 현재는 직접 호출하지 않음. 필요 시 행 인라인 수정 기능에 재사용 가능.

  const onDelete = async (m: UIMaterial) => {
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
            <form
              className="d-flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const term = inputRef.current?.value?.trim() ?? "";
                search(term);
              }}
            >
              <input
                ref={inputRef}
                className="form-control"
                style={{ width: 240 }}
                placeholder="검색(자재명/zone명)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-primary">
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
                <th style={{ width: "10%" }} className="text-secondary text-center d-none d-sm-table-cell">#</th>
                <th style={{ width: "1%" }} className="text-center" hidden>ID</th>
                <th className="text-center">이름</th>
                <th style={{ width: "30%" }} className="text-center">창고</th>
                <th style={{ width: "20%" }} className="text-center d-none d-md-table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-5">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((m, idx) => {
                  const rowNumber = total - ((page - 1) * pageSize) - idx;
                  return (
                    <tr key={m.id}>
                      <td className="text-secondary text-center d-none d-sm-table-cell">{rowNumber}</td>
                      <td hidden>{m.id}</td>
                      <td>{m.name}</td>
                      <td className="text-center">{zoneById.get(m.zoneId)?.name}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <MaterialEditLauncher iconOnly material={{ id: m.id, name: m.name, quantity: m.quantity ?? 0, zoneId: m.zoneId }} zones={zones} />
                          <button
                            className="btn btn-outline-danger btn-sm"
                            title="삭제"
                            aria-label="삭제"
                            onClick={() => setConfirmId(m.id)}
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
          const target = items.find((x) => x.id === confirmId);
          setConfirmId(null);
          if (target) onDelete(target);
        }}
        onClose={() => setConfirmId(null)}
      />
    </div>
  );
}


