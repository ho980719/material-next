"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { pushToast } from "@/components/ToastArea";
import ZoneEditLauncher from "@/components/ZoneEditLauncher";

type Zone = {
  id: number;
  name: string;
  memo: string | null;
  _count: { materials: number };
};

export default function ZoneList({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
        <h5 className="card-title">창고 목록</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="table-responsive">
          <table className="table table-hover align-middle table-sticky">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>메모</th>
                <th>자재수</th>
                <th className="text-end">Actions</th>
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
                zones.map((z) => (
                  <tr key={z.id}>
                    <td>{z.id}</td>
                    <td>{z.name}</td>
                    <td>{z.memo ?? "-"}</td>
                    <td>{z._count.materials}</td>
                    <td className="text-end">
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
                ))
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


