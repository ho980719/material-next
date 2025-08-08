import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand bg-body-tertiary mb-4">
      <div className="container">
        <Link className="navbar-brand" href="/">
          Material App
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" href="/materials">
            Materials
          </Link>
          <Link className="nav-link" href="/zones">
            Zones
          </Link>
        </div>
      </div>
    </nav>
  );
}


