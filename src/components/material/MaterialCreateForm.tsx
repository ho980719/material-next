"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Zone = { id: number; name: string };

export default function MaterialCreateForm({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [zoneId, setZoneId] = useState<number>(zones[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, zoneId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "등록 실패");
      }
      setName("");
      setQuantity(1);
      setZoneId(zones[0]?.id ?? 0);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "오류가 발생했습니다";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card">
      <div className="card-body">
        <h5 className="card-title">자재 등록</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">이름</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label">수량</label>
            <input
              type="number"
              className="form-control"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label">Zone</label>
            <select className="form-select" value={zoneId} onChange={(e) => setZoneId(Number(e.target.value))}>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2 d-grid">
            <button disabled={loading || zones.length === 0} className="btn btn-primary" type="submit">
              {loading ? "등록중..." : "등록"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


