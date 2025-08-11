"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pushToast } from "@/components/common/ToastArea";

type Zone = { id: number; name: string };
type Material = { id: number; name: string; quantity: number; zoneId: number };

export default function MaterialEditLauncher({
  material,
  zones,
  iconOnly = false,
}: {
  material: Material;
  zones: Zone[];
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>(material.name);
  const [quantity, setQuantity] = useState<number>(material.quantity);
  const [zoneId, setZoneId] = useState<number>(material.zoneId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/materials/${material.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, zoneId }),
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
              <h5 className="modal-title">자재 수정 - {material.name}</h5>
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
                  <label className="form-label">창고</label>
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


