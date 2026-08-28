import { useEffect, useState } from "react";
import PaginaInicial from "./pages/HomePage.jsx";
import PaginaAdicionarTitulo from "./pages/AddTitlePage.jsx";
import PaginaFilme from "./pages/MoviePage.jsx";
import PaginaItemTmdb from "./pages/TmdbItemPage.jsx";
import PaginaLogin from "./pages/LoginPage.jsx";
import { clienteSupabase } from "./lib/supabaseClient.js";
import "./App.css";

function Aplicacao() {
  const [hashLocalizacaoAtual, definirHashLocalizacaoAtual] = useState(
    () => window.location.hash,
  );
  const [sessaoAtual, definirSessaoAtual] = useState(undefined);

  useEffect(() => {
    const sincronizarHashLocalizacao = () =>
      definirHashLocalizacaoAtual(window.location.hash);
    window.addEventListener("hashchange", sincronizarHashLocalizacao);
    return () =>
      window.removeEventListener("hashchange", sincronizarHashLocalizacao);
  }, []);

  useEffect(() => {
    clienteSupabase.auth.getSession().then(({ data: dadosSessao }) => {
      definirSessaoAtual(dadosSessao.session);
    });

    const { data: dadosInscricaoAutenticacao } = clienteSupabase.auth.onAuthStateChange(
      (_evento, sessao) => definirSessaoAtual(sessao),
    );
    return () => dadosInscricaoAutenticacao.subscription.unsubscribe();
  }, []);

  if (sessaoAtual === undefined) {
    return <main className="auth-page"><p className="loading-message">Carregando...</p></main>;
  }

  if (!sessaoAtual) return <PaginaLogin onLogin={definirSessaoAtual} />;

  if (hashLocalizacaoAtual === "#add-title") return <PaginaAdicionarTitulo />;

  const correspondenciaRotaTmdb = hashLocalizacaoAtual.match(/^#tmdb\/(movie|tv)\/(\d+)$/);
  if (correspondenciaRotaTmdb) {
    return (
      <PaginaItemTmdb
        tmdbMediaType={correspondenciaRotaTmdb[1]}
        tmdbItemIdentifier={correspondenciaRotaTmdb[2]}
      />
    );
  }

  const correspondenciaIdentificadorMidia = hashLocalizacaoAtual.match(/^#movie\/(\d+)$/);
  return correspondenciaIdentificadorMidia ? (
      <PaginaFilme mediaIdentifier={Number(correspondenciaIdentificadorMidia[1])} />
  ) : <PaginaInicial />;
}

export default Aplicacao;
