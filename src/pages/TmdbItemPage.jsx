import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { TMDB_API_KEY } from "../config/tmdb.js";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function getTitle(item, mediaType) {
  return mediaType === "tv" ? item.name : item.title;
}

function getYear(item, mediaType) {
  const date = mediaType === "tv" ? item.first_air_date : item.release_date;
  return date ? date.slice(0, 4) : "Ano não informado";
}

function SeasonAccordion({ seriesId, season }) {
  const [episodes, setEpisodes] = useState(null);
  const [error, setError] = useState("");

  async function loadEpisodes(event) {
    if (!event.currentTarget.open || episodes) return;

    try {
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: "pt-BR",
      });
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/season/${season.season_number}?${params}`,
      );

      if (!response.ok)
        throw new Error("Não foi possível carregar os episódios.");

      const data = await response.json();
      setEpisodes(data.episodes);
    } catch (requestError) {
      setError(
        requestError.message || "Ocorreu um erro ao carregar os episódios.",
      );
    }
  }

  return (
    <details className="season-accordion" onToggle={loadEpisodes}>
      <summary>
        {season.poster_path ? (
          <img
            src={`${TMDB_IMAGE_URL}${season.poster_path}`}
            alt={`Pôster de ${season.name}`}
          />
        ) : (
          <div className="missing-poster">Sem pôster</div>
        )}
        <div className="season-summary-copy">
          <p>
            Temporada {season.season_number} · {season.episode_count} episódios
          </p>
          <h3>{season.name}</h3>
          <span>
            {season.air_date
              ? season.air_date.slice(0, 4)
              : "Data não informada"}
          </span>
        </div>
        <span className="accordion-icon" aria-hidden="true">
          ⌄
        </span>
      </summary>
      <div className="episodes-panel">
        {!episodes && !error && <p>Carregando episódios...</p>}
        {error && <p className="search-message is-error">{error}</p>}
        {episodes && (
          <ol className="episodes-list">
            {episodes.map((episode) => (
              <li key={episode.id}>
                <span>{String(episode.episode_number).padStart(2, "0")}</span>
                <strong>{episode.name}</strong>
                <time>
                  {episode.runtime
                    ? `${episode.runtime} min`
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

function TmdbItemPage({ mediaType, itemId }) {
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      if (TMDB_API_KEY === "COLE_SUA_CHAVE_DA_TMDB_AQUI") {
        setError("Configure a chave da TMDB no arquivo src/config/tmdb.js.");
        return;
      }

      setItem(null);
      setError("");

      try {
        const params = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: "pt-BR",
        });
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${itemId}?${params}`,
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar este título.");
        }

        const data = await response.json();
        console.log("Detalhes do título TMDB:", data);
        setItem(data);
      } catch (requestError) {
        setError(
          requestError.message || "Ocorreu um erro ao carregar o título.",
        );
      }
    }

    loadItem();
  }, [itemId, mediaType]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="tmdb-detail-page">
        <a className="back-link" href="#add-title">
          ← Voltar para a pesquisa
        </a>
        {error && (
          <p className="search-message is-error" role="alert">
            {error}
          </p>
        )}
        {!item && !error && (
          <p className="loading-message">Carregando informações...</p>
        )}
        {item && (
          <>
            <article className="tmdb-detail">
              {item.poster_path ? (
                <img
                  className="tmdb-detail-poster"
                  src={`${TMDB_IMAGE_URL}${item.poster_path}`}
                  alt={`Pôster de ${getTitle(item, mediaType)}`}
                />
              ) : (
                <div className="tmdb-detail-poster missing-poster">
                  Sem pôster
                </div>
              )}
              <div className="tmdb-detail-copy">
                <p className="movie-kicker">
                  {mediaType === "tv" ? "Série" : "Filme"}
                </p>
                <h1>{getTitle(item, mediaType)}</h1>
                <p className="movie-meta">
                  {getYear(item, mediaType)} ·{" "}
                  {item.genres.map((genre) => genre.name).join(", ") ||
                    "Gênero não informado"}
                </p>
                <p className="movie-synopsis">
                  {item.overview || "Sinopse não disponível."}
                </p>
                <dl className="movie-facts">
                  <div>
                    <dt>Avaliação TMDB</dt>
                    <dd>{item.vote_average?.toFixed(1) || "—"} / 10</dd>
                  </div>
                  <div>
                    <dt>{mediaType === "tv" ? "Temporadas" : "Duração"}</dt>
                    <dd>
                      {mediaType === "tv"
                        ? item.number_of_seasons
                        : `${item.runtime || "—"} min`}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>

            {mediaType === "tv" && item.seasons?.length > 0 && (
              <section
                className="seasons-section"
                aria-labelledby="seasons-title"
              >
                <h2 id="seasons-title">Temporadas</h2>
                <div className="seasons-list">
                  {item.seasons
                    .filter((season) => season.season_number > 0)
                    .map((season) => (
                      <SeasonAccordion
                        key={season.id}
                        seriesId={item.id}
                        season={season}
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

export default TmdbItemPage;
