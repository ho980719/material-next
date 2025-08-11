"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pushToast } from "@/components/ToastArea";

export default function ZonesCreateLauncher() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memo }),
      });
      if (!res.ok) throw new Error("등록 실패");
      setShow(false);
      setName("");
      setMemo("");
      pushToast("등록되었습니다", "success");
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
      <button className="btn btn-primary btn-sm" onClick={() => setShow(true)}>
        창고 등록
      </button>
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">창고 등록</h5>
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
                {loading ? "등록중..." : "등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show" />}
    </>
  );
}


