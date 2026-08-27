import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { TMDB_API_ACCESS_KEY } from "../config/tmdb.js";
import { addTmdbItemToLibrary } from "../services/libraryService.js";

const TMDB_POSTER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function getTmdbItemDisplayTitle(tmdbItemDetails, tmdbMediaType) {
  return tmdbMediaType === "tv" ? tmdbItemDetails.name : tmdbItemDetails.title;
}

function getTmdbItemReleaseYear(tmdbItemDetails, tmdbMediaType) {
  const itemReleaseDate =
    tmdbMediaType === "tv"
      ? tmdbItemDetails.first_air_date
      : tmdbItemDetails.release_date;
  return itemReleaseDate ? itemReleaseDate.slice(0, 4) : "Ano não informado";
}

async function loadAllSeriesEpisodes(seriesIdentifier, seriesSeasons) {
  const seasonsWithEpisodes = await Promise.all(
    seriesSeasons
      .filter((seasonDetails) => seasonDetails.season_number > 0)
      .map(async (seasonDetails) => {
        const tmdbSeasonRequestParameters = new URLSearchParams({
          api_key: TMDB_API_ACCESS_KEY,
          language: "pt-BR",
        });
        const tmdbSeasonResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${seriesIdentifier}/season/${seasonDetails.season_number}?${tmdbSeasonRequestParameters}`,
        );
        if (!tmdbSeasonResponse.ok) {
          throw new Error(`Não foi possível carregar a temporada ${seasonDetails.season_number}.`);
        }
        const seasonResponseData = await tmdbSeasonResponse.json();
        return {
          seasonDetails,
          episodes: seasonResponseData.episodes || [],
        };
      }),
  );

  return {
    seasons: seasonsWithEpisodes.map(({ seasonDetails }) => ({
      tmdb_id: seasonDetails.id,
      season_number: seasonDetails.season_number,
      name: seasonDetails.name,
    })),
    episodes: seasonsWithEpisodes.flatMap(({ seasonDetails, episodes }) =>
      episodes.map((episodeDetails) => ({
        season_number: seasonDetails.season_number,
        tmdb_id: episodeDetails.id,
        episode_number: episodeDetails.episode_number,
        name: episodeDetails.name,
      })),
    ),
  };
}

function SeasonAccordion({ seriesIdentifier, seasonDetails }) {
  const [seasonEpisodes, setSeasonEpisodes] = useState(null);
  const [episodeLoadingErrorMessage, setEpisodeLoadingErrorMessage] = useState("");

  async function loadSeasonEpisodes(detailsToggleEvent) {
    if (!detailsToggleEvent.currentTarget.open || seasonEpisodes) return;

    try {
      const tmdbSeasonRequestParameters = new URLSearchParams({
        api_key: TMDB_API_ACCESS_KEY,
        language: "pt-BR",
      });
      const tmdbSeasonResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesIdentifier}/season/${seasonDetails.season_number}?${tmdbSeasonRequestParameters}`,
      );

      if (!tmdbSeasonResponse.ok)
        throw new Error("Não foi possível carregar os episódios.");

      const tmdbSeasonResponseData = await tmdbSeasonResponse.json();
      setSeasonEpisodes(tmdbSeasonResponseData.episodes);
    } catch (seasonRequestError) {
      setEpisodeLoadingErrorMessage(
        seasonRequestError.message || "Ocorreu um erro ao carregar os episódios.",
      );
    }
  }

  return (
    <details className="season-accordion" onToggle={loadSeasonEpisodes}>
      <summary>
        {seasonDetails.poster_path ? (
          <img
            src={`${TMDB_POSTER_IMAGE_BASE_URL}${seasonDetails.poster_path}`}
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
        {!seasonEpisodes && !episodeLoadingErrorMessage && <p>Carregando episódios...</p>}
        {episodeLoadingErrorMessage && <p className="search-message is-error">{episodeLoadingErrorMessage}</p>}
        {seasonEpisodes && (
          <ol className="episodes-list">
            {seasonEpisodes.map((episodeDetails) => (
              <li key={episodeDetails.id}>
                <span>{String(episodeDetails.episode_number).padStart(2, "0")}</span>
                <strong>{episodeDetails.name}</strong>
                <time>
                  {episodeDetails.runtime
                    ? `${episodeDetails.runtime} min`
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

function TmdbItemPage({ tmdbMediaType, tmdbItemIdentifier }) {
  const [tmdbItemDetails, setTmdbItemDetails] = useState(null);
  const [itemLoadingErrorMessage, setItemLoadingErrorMessage] = useState("");
  const [isAddingItemToLibrary, setIsAddingItemToLibrary] = useState(false);
  const [libraryActionMessage, setLibraryActionMessage] = useState("");

  useEffect(() => {
    async function loadTmdbItemDetails() {
      if (TMDB_API_ACCESS_KEY === "COLE_SUA_CHAVE_DA_TMDB_AQUI") {
        setItemLoadingErrorMessage("Configure a chave da TMDB no arquivo src/config/tmdb.js.");
        return;
      }

      setTmdbItemDetails(null);
      setItemLoadingErrorMessage("");

      try {
        const tmdbItemRequestParameters = new URLSearchParams({
          api_key: TMDB_API_ACCESS_KEY,
          language: "pt-BR",
        });
        const tmdbItemResponse = await fetch(
          `https://api.themoviedb.org/3/${tmdbMediaType}/${tmdbItemIdentifier}?${tmdbItemRequestParameters}`,
        );

        if (!tmdbItemResponse.ok) {
          throw new Error("Não foi possível carregar este título.");
        }

        const tmdbItemResponseData = await tmdbItemResponse.json();
        setTmdbItemDetails(tmdbItemResponseData);
      } catch (itemRequestError) {
        setItemLoadingErrorMessage(
          itemRequestError.message || "Ocorreu um erro ao carregar o título.",
        );
      }
    }

    loadTmdbItemDetails();
  }, [tmdbItemIdentifier, tmdbMediaType]);

  async function handleAddItemToLibrary() {
    if (!tmdbItemDetails) return;

    setIsAddingItemToLibrary(true);
    setLibraryActionMessage("");

    try {
      const seriesData = tmdbMediaType === "tv"
        ? await loadAllSeriesEpisodes(tmdbItemDetails.id, tmdbItemDetails.seasons || [])
        : { seasons: [], episodes: [] };
      const { wasCreated } = await addTmdbItemToLibrary({
        tmdbItemIdentifier: Number(tmdbItemIdentifier),
        tmdbMediaType,
        tmdbItemTitle: getTmdbItemDisplayTitle(tmdbItemDetails, tmdbMediaType),
        tmdbPosterPath: tmdbItemDetails.poster_path,
        tmdbItemDescription: tmdbItemDetails.overview || null,
        tmdbSeasons: seriesData.seasons,
        tmdbEpisodes: seriesData.episodes,
      });
      setLibraryActionMessage(
        wasCreated ? "Título adicionado à coleção." : "Este título já está na coleção.",
      );
    } catch (libraryRequestError) {
      setLibraryActionMessage(
        libraryRequestError.message || "Não foi possível adicionar o título.",
      );
    } finally {
      setIsAddingItemToLibrary(false);
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="tmdb-detail-page">
        <a className="back-link" href="#add-title">
          ← Voltar para a pesquisa
        </a>
        {itemLoadingErrorMessage && (
          <p className="search-message is-error" role="alert">
            {itemLoadingErrorMessage}
          </p>
        )}
        {!tmdbItemDetails && !itemLoadingErrorMessage && (
          <p className="loading-message">Carregando informações...</p>
        )}
        {tmdbItemDetails && (
          <>
            <article className="tmdb-detail">
              <div className="tmdb-poster-action-panel">
                {tmdbItemDetails.poster_path ? (
                  <img
                    className="tmdb-detail-poster"
                    src={`${TMDB_POSTER_IMAGE_BASE_URL}${tmdbItemDetails.poster_path}`}
                    alt={`Pôster de ${getTmdbItemDisplayTitle(tmdbItemDetails, tmdbMediaType)}`}
                  />
                ) : (
                  <div className="tmdb-detail-poster missing-poster">
                    Sem pôster
                  </div>
                )}
                <button
                  className="add-tmdb-title-button"
                  type="button"
                  disabled={isAddingItemToLibrary}
                  onClick={handleAddItemToLibrary}
                >
                  {isAddingItemToLibrary ? "Adicionando..." : "Adicionar"}
                </button>
                {libraryActionMessage && (
                  <p className="library-action-message" role="status">
                    {libraryActionMessage}
                  </p>
                )}
              </div>
              <div className="tmdb-detail-copy">
                <p className="movie-kicker">
                  {tmdbMediaType === "tv" ? "Série" : "Filme"}
                </p>
                <h1>{getTmdbItemDisplayTitle(tmdbItemDetails, tmdbMediaType)}</h1>
                <p className="movie-meta">
                  {getTmdbItemReleaseYear(tmdbItemDetails, tmdbMediaType)} ·{" "}
                  {tmdbItemDetails.genres.map((genreDetails) => genreDetails.name).join(", ") ||
                    "Gênero não informado"}
                </p>
                <p className="movie-synopsis">
                  {tmdbItemDetails.overview || "Sinopse não disponível."}
                </p>
                <dl className="movie-facts">
                  <div>
                    <dt>Avaliação TMDB</dt>
                    <dd>{tmdbItemDetails.vote_average?.toFixed(1) || "—"} / 10</dd>
                  </div>
                  <div>
                    <dt>{tmdbMediaType === "tv" ? "Temporadas" : "Duração"}</dt>
                    <dd>
                      {tmdbMediaType === "tv"
                        ? tmdbItemDetails.number_of_seasons
                        : `${tmdbItemDetails.runtime || "—"} min`}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>

            {tmdbMediaType === "tv" && tmdbItemDetails.seasons?.length > 0 && (
              <section
                className="seasons-section"
                aria-labelledby="seasons-title"
              >
                <h2 id="seasons-title">Temporadas</h2>
                <div className="seasons-list">
                  {tmdbItemDetails.seasons
                    .filter((seasonDetails) => seasonDetails.season_number > 0)
                    .map((seasonDetails) => (
                      <SeasonAccordion
                        key={seasonDetails.id}
                        seriesIdentifier={tmdbItemDetails.id}
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

export default TmdbItemPage;
