import Link from "next/link";

export default function Home() {
  return (
    <div className="py-5">
      <h1 className="mb-4">자재 위치 관리</h1>
      <p className="text-secondary">Next.js + Bootstrap + Prisma(MySQL)</p>
      <div className="row g-3 mt-4">
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">자재(Materials)</h5>
              <p className="card-text flex-grow-1">자재 등록/수정/삭제, 검색, Markdown 내보내기</p>
              <Link href="/materials" className="btn btn-primary mt-auto">
                이동하기
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">창고(Zones)</h5>
              <p className="card-text flex-grow-1">창고 등록/수정/삭제</p>
              <Link href="/zones" className="btn btn-outline-primary mt-auto">
                이동하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
