import { useEffect, useState } from "react";
import BarraNavegacao from "../components/Navbar.jsx";
import { CHAVE_ACESSO_API_TMDB } from "../config/tmdb.js";
import { adicionarItemTmdbBiblioteca } from "../services/libraryService.js";

const URL_BASE_IMAGEM_POSTER_TMDB = "https://image.tmdb.org/t/p/w500";

function obterTituloExibicaoItemTmdb(detalhesItemTmdb, tmdbMediaType) {
  return tmdbMediaType === "tv" ? detalhesItemTmdb.name : detalhesItemTmdb.title;
}

function obterAnoLancamentoItemTmdb(detalhesItemTmdb, tmdbMediaType) {
  const dataLancamentoItem =
    tmdbMediaType === "tv"
      ? detalhesItemTmdb.first_air_date
      : detalhesItemTmdb.release_date;
  return dataLancamentoItem ? dataLancamentoItem.slice(0, 4) : "Ano não informado";
}

async function carregarTodosEpisodiosSerie(identificadorSerie, temporadasSerie) {
  const temporadasComEpisodios = await Promise.all(
    temporadasSerie
      .filter((detalhesTemporada) => detalhesTemporada.season_number > 0)
      .map(async (detalhesTemporada) => {
        const parametrosRequisicaoTemporadaTmdb = new URLSearchParams({
          api_key: CHAVE_ACESSO_API_TMDB,
          language: "pt-BR",
        });
        const respostaTemporadaTmdb = await fetch(
          `https://api.themoviedb.org/3/tv/${identificadorSerie}/season/${detalhesTemporada.season_number}?${parametrosRequisicaoTemporadaTmdb}`,
        );
        if (!respostaTemporadaTmdb.ok) {
          throw new Error(`Não foi possível carregar a temporada ${detalhesTemporada.season_number}.`);
        }
        const dadosRespostaTemporada = await respostaTemporadaTmdb.json();
        return {
          detalhesTemporada,
          episodes: dadosRespostaTemporada.episodes || [],
        };
      }),
  );

  return {
    
    temporadas: temporadasComEpisodios.map(({ detalhesTemporada }) => ({
      tmdb_id: detalhesTemporada.id,
      numero_temporada: detalhesTemporada.season_number,
      nome: detalhesTemporada.name,
    })),
    episodios: temporadasComEpisodios.flatMap(({ detalhesTemporada, episodes }) =>
      episodes.map((detalhesEpisodio) => ({
        numero_temporada: detalhesTemporada.season_number,
        tmdb_id: detalhesEpisodio.id,
        numero_episodio: detalhesEpisodio.episode_number,
        nome: detalhesEpisodio.name,
        duracao: detalhesEpisodio.runtime
      })),
    ),
  };
}

function AcordeaoTemporada({ seriesIdentifier, seasonDetails }) {
  const [episodiosTemporada, definirEpisodiosTemporada] = useState(null);
  const [mensagemErroCarregamentoEpisodios, definirMensagemErroCarregamentoEpisodios] = useState("");

  async function carregarEpisodiosTemporada(eventoAlternanciaDetalhes) {
    if (!eventoAlternanciaDetalhes.currentTarget.open || episodiosTemporada) return;

    try {
      const parametrosRequisicaoTemporadaTmdb = new URLSearchParams({
        api_key: CHAVE_ACESSO_API_TMDB,
        language: "pt-BR",
      });
      const respostaTemporadaTmdb = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesIdentifier}/season/${seasonDetails.season_number}?${parametrosRequisicaoTemporadaTmdb}`,
      );

      if (!respostaTemporadaTmdb.ok)
        throw new Error("Não foi possível carregar os episódios.");

      const dadosRespostaTemporadaTmdb = await respostaTemporadaTmdb.json();
      definirEpisodiosTemporada(dadosRespostaTemporadaTmdb.episodes);
    } catch (erroRequisicaoTemporada) {
      definirMensagemErroCarregamentoEpisodios(
        erroRequisicaoTemporada.message || "Ocorreu um erro ao carregar os episódios.",
      );
    }
  }

  return (
    <details className="season-accordion" onToggle={carregarEpisodiosTemporada}>
      <summary>
        {seasonDetails.poster_path ? (
          <img
            src={`${URL_BASE_IMAGEM_POSTER_TMDB}${seasonDetails.poster_path}`}
            alt={`Pôster de ${seasonDetails.name}`}
          />
        ) : (
          <div className="missing-poster">Sem pôster</div>
        )}
        <div className="season-summary-copy">
          <p>
            Temporada {seasonDetails.season_number} · {seasonDetails.episode_count} episódios
          </p>
          <h3>{seasonDetails.name}</h3>
          <span>
            {seasonDetails.air_date
              ? seasonDetails.air_date.slice(0, 4)
              : "Data não informada"}
          </span>
        </div>
        <span className="accordion-icon" aria-hidden="true">
          ⌄
        </span>
      </summary>
      <div className="episodes-panel">
        {!episodiosTemporada && !mensagemErroCarregamentoEpisodios && <p>Carregando episódios...</p>}
        {mensagemErroCarregamentoEpisodios && <p className="search-message is-error">{mensagemErroCarregamentoEpisodios}</p>}
        {episodiosTemporada && (
          <ol className="episodes-list">
            {episodiosTemporada.map((detalhesEpisodio) => (
              <li key={detalhesEpisodio.id}>
                <span>{String(detalhesEpisodio.episode_number).padStart(2, "0")}</span>
                <strong>{detalhesEpisodio.name}</strong>
                <time>
                  {detalhesEpisodio.runtime
                    ? `${detalhesEpisodio.runtime} min`
                    : "Duração não informada"}
                </time>
              </li>
            ))}
          </ol>
        )}
      </div>
    </details>
  );
}

function PaginaItemTmdb({ tmdbMediaType, tmdbItemIdentifier }) {
  const [detalhesItemTmdb, definirDetalhesItemTmdb] = useState(null);
  const [mensagemErroCarregamentoItem, definirMensagemErroCarregamentoItem] = useState("");
  const [estaAdicionandoItemBiblioteca, definirEstaAdicionandoItemBiblioteca] = useState(false);
  const [mensagemAcaoBiblioteca, definirMensagemAcaoBiblioteca] = useState("");

  useEffect(() => {
    async function carregarDetalhesItemTmdb() {
      if (CHAVE_ACESSO_API_TMDB === "COLE_SUA_CHAVE_DA_TMDB_AQUI") {
        definirMensagemErroCarregamentoItem("Configure a chave da TMDB no arquivo src/config/tmdb.js.");
        return;
      }

      definirDetalhesItemTmdb(null);
      definirMensagemErroCarregamentoItem("");

      try {
        const parametrosRequisicaoItemTmdb = new URLSearchParams({
          api_key: CHAVE_ACESSO_API_TMDB,
          language: "pt-BR",
        });
        const respostaItemTmdb = await fetch(
          `https://api.themoviedb.org/3/${tmdbMediaType}/${tmdbItemIdentifier}?${parametrosRequisicaoItemTmdb}`,
        );

        if (!respostaItemTmdb.ok) {
          throw new Error("Não foi possível carregar este título.");
        }

        const dadosRespostaItemTmdb = await respostaItemTmdb.json();
        definirDetalhesItemTmdb(dadosRespostaItemTmdb);
      } catch (erroRequisicaoItem) {
        definirMensagemErroCarregamentoItem(
          erroRequisicaoItem.message || "Ocorreu um erro ao carregar o título.",
        );
      }
    }

    carregarDetalhesItemTmdb();
  }, [tmdbItemIdentifier, tmdbMediaType]);

  async function lidarComAdicaoItemBiblioteca() {
    if (!detalhesItemTmdb) return;

    definirEstaAdicionandoItemBiblioteca(true);
    definirMensagemAcaoBiblioteca("");

    try {
      const dadosSerie = tmdbMediaType === "tv"
        ? await carregarTodosEpisodiosSerie(detalhesItemTmdb.id, detalhesItemTmdb.seasons || [])
        : { seasons: [], episodes: [] };
      const { foiCriada, midia } = await adicionarItemTmdbBiblioteca({
        identificadorTmdb: Number(tmdbItemIdentifier),
        tipoMidia: tmdbMediaType,
        tituloMidia: obterTituloExibicaoItemTmdb(detalhesItemTmdb, tmdbMediaType),
        caminhoPoster: detalhesItemTmdb.poster_path,
        descricaoMidia: detalhesItemTmdb.overview || null,
        temporadasTmdb: dadosSerie.temporadas,
        episodiosTmdb: dadosSerie.episodios,
        duracaoTmdb: detalhesItemTmdb.runtime || null,
        statusMidia: tmdbMediaType === "movie" ? "concluido" : "planejado",
      });

      const identificadorMidiaSalva = midia?.id;
      if (foiCriada && identificadorMidiaSalva) {
        window.location.hash = `#movie/${identificadorMidiaSalva}`;
        return;
      }

      definirMensagemAcaoBiblioteca(
        foiCriada ? "Título adicionado à coleção." : "Este título já está na coleção.",
      );
    } catch (erroRequisicaoBiblioteca) {
      definirMensagemAcaoBiblioteca(
        erroRequisicaoBiblioteca.message || "Não foi possível adicionar o título.",
      );
    } finally {
      definirEstaAdicionandoItemBiblioteca(false);
    }
  }

  return (
    <div className="app-shell">
      <BarraNavegacao />
      <main className="tmdb-detail-page">
        <a className="back-link" href="#add-title">
          ← Voltar para a pesquisa
        </a>
        {mensagemErroCarregamentoItem && (
          <p className="search-message is-error" role="alert">
            {mensagemErroCarregamentoItem}
          </p>
        )}
        {!detalhesItemTmdb && !mensagemErroCarregamentoItem && (
          <p className="loading-message">Carregando informações...</p>
        )}
        {detalhesItemTmdb && (
          <>
            <article className="tmdb-detail">
              <div className="tmdb-poster-action-panel">
                {detalhesItemTmdb.poster_path ? (
                  <img
                    className="tmdb-detail-poster"
                    src={`${URL_BASE_IMAGEM_POSTER_TMDB}${detalhesItemTmdb.poster_path}`}
                    alt={`Pôster de ${obterTituloExibicaoItemTmdb(detalhesItemTmdb, tmdbMediaType)}`}
                  />
                ) : (
                  <div className="tmdb-detail-poster missing-poster">
                    Sem pôster
                  </div>
                )}
                <button
                  className="add-tmdb-title-button"
                  type="button"
                  disabled={estaAdicionandoItemBiblioteca}
                  onClick={lidarComAdicaoItemBiblioteca}
                >
                  {estaAdicionandoItemBiblioteca ? "Adicionando..." : "Adicionar"}
                </button>
                {mensagemAcaoBiblioteca && (
                  <p className="library-action-message" role="status">
                    {mensagemAcaoBiblioteca}
                  </p>
                )}
              </div>
              <div className="tmdb-detail-copy">
                <p className="movie-kicker">
                  {tmdbMediaType === "tv" ? "Série" : "Filme"}
                </p>
                <h1>{obterTituloExibicaoItemTmdb(detalhesItemTmdb, tmdbMediaType)}</h1>
                <p className="movie-meta">
                  {obterAnoLancamentoItemTmdb(detalhesItemTmdb, tmdbMediaType)} ·{" "}
                  {detalhesItemTmdb.genres.map((detalhesGenero) => detalhesGenero.name).join(", ") ||
                    "Gênero não informado"}
                </p>
                <p className="movie-synopsis">
                  {detalhesItemTmdb.overview || "Sinopse não disponível."}
                </p>
                <dl className="movie-facts">
                  <div>
                    <dt>Avaliação TMDB</dt>
                    <dd>{detalhesItemTmdb.vote_average?.toFixed(1) || "—"} / 10</dd>
                  </div>
                  <div>
                    <dt>{tmdbMediaType === "tv" ? "Temporadas" : "Duração"}</dt>
                    <dd>
                      {tmdbMediaType === "tv"
                        ? detalhesItemTmdb.number_of_seasons
                        : `${detalhesItemTmdb.runtime || "—"} min`}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>

            {tmdbMediaType === "tv" && detalhesItemTmdb.seasons?.length > 0 && (
              <section
                className="seasons-section"
                aria-labelledby="seasons-title"
              >
                <h2 id="seasons-title">Temporadas</h2>
                <div className="seasons-list">
                  {detalhesItemTmdb.seasons
                    .filter((seasonDetails) => seasonDetails.season_number > 0)
                    .map((seasonDetails) => (
                      <AcordeaoTemporada
                        key={seasonDetails.id}
                        seriesIdentifier={detalhesItemTmdb.id}
                        seasonDetails={seasonDetails}
                      />
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default PaginaItemTmdb;
