import { useState } from "react";
import BarraNavegacao from "../components/Navbar.jsx";
import { CHAVE_ACESSO_API_TMDB } from "../config/tmdb.js";

const URL_BASE_IMAGEM_POSTER_TMDB = "https://image.tmdb.org/t/p/w342";

function obterTituloExibicaoResultadoTmdb(resultadoBuscaTmdb) {
  return resultadoBuscaTmdb.title || resultadoBuscaTmdb.name || "Título não informado";
}

function obterAnoLancamentoResultadoTmdb(resultadoBuscaTmdb) {
  const dataLancamentoTitulo =
    resultadoBuscaTmdb.release_date || resultadoBuscaTmdb.first_air_date;
  return dataLancamentoTitulo ? dataLancamentoTitulo.slice(0, 4) : "Ano não informado";
}

function PaginaAdicionarTitulo() {
  const [textoConsulta, definirTextoConsulta] = useState("");
  const [resultadosBuscaTmdb, definirResultadosBuscaTmdb] = useState([]);
  const [estaRealizandoBusca, definirEstaRealizandoBusca] = useState(false);
  const [mensagemErroBusca, definirMensagemErroBusca] = useState("");

  async function lidarComEnvioFormularioBuscaTitulo(eventoEnvioFormulario) {
    eventoEnvioFormulario.preventDefault();
    if (!textoConsulta.trim()) {
      definirMensagemErroBusca("Digite um título para pesquisar.");
      return;
    }

    if (CHAVE_ACESSO_API_TMDB === "COLE_SUA_CHAVE_DA_TMDB_AQUI") {
      definirMensagemErroBusca("Configure a chave da TMDB no arquivo src/config/tmdb.js.");
      return;
    }

    definirEstaRealizandoBusca(true);
    definirMensagemErroBusca("");

    try {
      const parametrosRequisicaoBuscaTmdb = new URLSearchParams({
        api_key: CHAVE_ACESSO_API_TMDB,
        language: "pt-BR",
        query: textoConsulta.trim(),
        include_adult: "false",
      });
      const respostaBuscaTmdb = await fetch(
        `https://api.themoviedb.org/3/search/multi?${parametrosRequisicaoBuscaTmdb}`,
      );

      if (!respostaBuscaTmdb.ok) throw new Error("Não foi possível consultar a TMDB.");

      const dadosRespostaBuscaTmdb = await respostaBuscaTmdb.json();
      console.log("TMDB search response:", dadosRespostaBuscaTmdb);
      definirResultadosBuscaTmdb(
        dadosRespostaBuscaTmdb.results.filter((resultadoBuscaTmdb) =>
          ["movie", "tv"].includes(resultadoBuscaTmdb.media_type),
        ),
      );
    } catch (erroRequisicaoBuscaTmdb) {
      definirMensagemErroBusca(
        erroRequisicaoBuscaTmdb.message || "Ocorreu um erro ao realizar a consulta.",
      );
      definirResultadosBuscaTmdb([]);
    } finally {
      definirEstaRealizandoBusca(false);
    }
  }

  return (
    <div className="app-shell">
      <BarraNavegacao />
      <main className="add-title-page">
        <a className="back-link" href="#home">
          ← Voltar para a Home
        </a>
        <section className="search-title-panel" aria-labelledby="search-title">
          <p className="movie-kicker">TMDB</p>
          <h1 id="search-title">Adicionar título</h1>
          <p>
            Pesquise filmes ou séries para encontrar um novo título para sua
            coleção.
          </p>
          <form className="title-search-form" onSubmit={lidarComEnvioFormularioBuscaTitulo}>
            <input
              type="search"
              value={textoConsulta}
              onChange={(eventoAlteracaoEntrada) => definirTextoConsulta(eventoAlteracaoEntrada.target.value)}
              placeholder="Ex.: Interestelar"
              aria-label="Título para pesquisar"
            />
            <button type="submit" disabled={estaRealizandoBusca}>
              {estaRealizandoBusca ? "Consultando..." : "Consultar"}
            </button>
          </form>
          {mensagemErroBusca && (
            <p className="search-message is-error" role="alert">
              {mensagemErroBusca}
            </p>
          )}
        </section>

        {resultadosBuscaTmdb.length > 0 && (
          <section className="tmdb-results" aria-label="Resultados da pesquisa">
            <h2>Resultados encontrados</h2>
            <div className="tmdb-results-grid">
              {resultadosBuscaTmdb.map((resultadoBuscaTmdb) => (
                <a
                  className="tmdb-result"
                  href={`#tmdb/${resultadoBuscaTmdb.media_type}/${resultadoBuscaTmdb.id}`}
                  key={`${resultadoBuscaTmdb.media_type}-${resultadoBuscaTmdb.id}`}
                >
                  {resultadoBuscaTmdb.poster_path ? (
                    <img
                      src={`${URL_BASE_IMAGEM_POSTER_TMDB}${resultadoBuscaTmdb.poster_path}`}
                      alt={`Pôster de ${obterTituloExibicaoResultadoTmdb(resultadoBuscaTmdb)}`}
                    />
                  ) : (
                    <div className="missing-poster">Sem pôster</div>
                  )}
                  <div>
                    <p>
                      {resultadoBuscaTmdb.media_type === "tv" ? "Série" : "Filme"} ·{" "}
                      {obterAnoLancamentoResultadoTmdb(resultadoBuscaTmdb)}
                    </p>
                    <h3>{obterTituloExibicaoResultadoTmdb(resultadoBuscaTmdb)}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default PaginaAdicionarTitulo;
