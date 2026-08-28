import { useState } from "react";
import { clienteSupabase } from "../lib/supabaseClient.js";

function PaginaLogin({ onLogin }) {
  const [enderecoEmail, definirEnderecoEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [estaEntrando, definirEstaEntrando] = useState(false);
  const [mensagemErroLogin, definirMensagemErroLogin] = useState("");

  async function lidarComEnvioFormularioLogin(eventoEnvioFormulario) {
    eventoEnvioFormulario.preventDefault();
    definirEstaEntrando(true);
    definirMensagemErroLogin("");

    const { data: dadosEntrada, error: erroEntrada } =
      await clienteSupabase.auth.signInWithPassword({
        email: enderecoEmail.trim(),
        password: senha,
      });

    if (erroEntrada) {
      definirMensagemErroLogin(erroEntrada.message || "Não foi possível entrar.");
    } else {
      onLogin(dadosEntrada.session);
    }
    definirEstaEntrando(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="movie-kicker">TELOTECA</p>
        <h1 id="login-title">Entrar</h1>
        <form className="auth-form" onSubmit={lidarComEnvioFormularioLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={enderecoEmail}
            onChange={(evento) => definirEnderecoEmail(evento.target.value)}
            required
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => definirSenha(evento.target.value)}
            required
          />
          <button type="submit" disabled={estaEntrando}>
            {estaEntrando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {mensagemErroLogin && (
          <p className="search-message is-error" role="alert">
            {mensagemErroLogin}
          </p>
        )}
      </section>
    </main>
  );
}

export default PaginaLogin;
