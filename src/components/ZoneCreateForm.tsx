"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ZoneCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "등록 실패");
      }
      setName("");
      setMemo("");
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
        <h5 className="card-title">창고 등록</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">이름</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">메모</label>
            <input className="form-control" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
          <div className="col-12 col-md-2 d-grid">
            <button disabled={loading} className="btn btn-primary" type="submit">
              {loading ? "등록중..." : "등록"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


