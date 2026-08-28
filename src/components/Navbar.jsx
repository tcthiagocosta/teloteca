import { clienteSupabase } from "../lib/supabaseClient.js";

function BarraNavegacao() {
  async function lidarComSaida() {
    await clienteSupabase.auth.signOut();
  }

  return (
    <header className="topbar">
      <a className="brand" href="#home">
        TELOTECA<span>.</span>
      </a>
      <button className="sign-out-button" type="button" onClick={lidarComSaida}>
        Sair
      </button>
    </header>
  );
}
export default BarraNavegacao;
