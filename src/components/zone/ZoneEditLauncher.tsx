"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pushToast } from "@/components/common/ToastArea";

type Zone = { id: number; name: string; memo: string | null };

export default function ZoneEditLauncher({ zone, iconOnly = false }: { zone: Zone; iconOnly?: boolean }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(zone.name);
  const [memo, setMemo] = useState(zone.memo ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/zones/${zone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memo }),
      });
      if (!res.ok) throw new Error("수정 실패");
      setShow(false);
      pushToast("저장되었습니다", "success");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "오류가 발생했습니다";
      setError(message);
      pushToast(message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-outline-primary btn-sm" onClick={() => setShow(true)} aria-label="수정">
        {iconOnly ? <i className="bi bi-pencil" /> : "수정"}
      </button>
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">창고 수정 - {zone.name}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)} />
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="row g-2">
                <div className="col-12">
                  <label className="form-label">이름</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">메모</label>
                  <input className="form-control" value={memo} onChange={(e) => setMemo(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShow(false)}>
                닫기
              </button>
              <button disabled={loading} className="btn btn-primary" onClick={submit}>
                {loading ? "저장중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show" />}
    </>
  );
}


