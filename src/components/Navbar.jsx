import { supabaseClient } from "../lib/supabaseClient.js";

function Navbar() {
  async function handleSignOut() {
    await supabaseClient.auth.signOut();
  }

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
      <button className="sign-out-button" type="button" onClick={handleSignOut}>
        Sair
      </button>
    </header>
  );
}
export default Navbar;
