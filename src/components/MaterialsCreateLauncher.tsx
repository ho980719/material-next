"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pushToast } from "@/components/ToastArea";

type Zone = { id: number; name: string };

export default function MaterialsCreateLauncher({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [zoneId, setZoneId] = useState<number>(zones[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, zoneId }),
      });
      if (!res.ok) throw new Error("등록 실패");
      setShow(false);
      setName("");
      setQuantity(1);
      setZoneId(zones[0]?.id ?? 0);
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
        자재 등록
      </button>
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">자재 등록</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)} />
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="row g-2">
                <div className="col-12">
                  <label className="form-label">이름</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label">수량</label>
                  <input
                    type="number"
                    className="form-control"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Zone</label>
                  <select className="form-select" value={zoneId} onChange={(e) => setZoneId(Number(e.target.value))}>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
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


