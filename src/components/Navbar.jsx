function Navbar() {
  return (
    <header className="topbar">
      <a className="brand" href="#home">
        TELOTECA<span>.</span>
      </a>
      <label className="search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          type="search"
          placeholder="Buscar na sua coleção..."
          aria-label="Buscar na coleção"
        />
      </label>
    </header>
  );
}
export default Navbar;
