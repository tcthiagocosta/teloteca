import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { mediaRepository } from "../repositories/mediaRepository.js";
import { seasonRepository } from "../repositories/seasonRepository.js";
import { episodeRepository } from "../repositories/episodeRepository.js";

const TMDB_POSTER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MEDIA_TYPE_LABELS = {
  movie: "Filme",
  tv: "Série",
};

const MEDIA_STATUS_LABELS = {
  planned: "Para ver",
  watching: "Assistindo",
  completed: "Assistido",
  dropped: "Abandonado",
};

function MoviePage({ mediaIdentifier }) {
  const [mediaItem, setMediaItem] = useState(null);
  const [seriesSeasons, setSeriesSeasons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState("");
  const [episodeErrorMessage, setEpisodeErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  useEffect(() => {
    async function loadMediaDetails() {
      try {
        const savedMedia = await mediaRepository.getById(mediaIdentifier);
        if (!savedMedia) throw new Error("Título não encontrado na coleção.");
        setMediaItem(savedMedia);

        if (savedMedia.type === "tv") {
          const savedSeasons = await seasonRepository.getByMediaId(mediaIdentifier);
          const seasonsWithEpisodes = await Promise.all(
            savedSeasons.map(async (savedSeason) => ({
              ...savedSeason,
              episodes: await episodeRepository.getBySeasonId(savedSeason.id),
            })),
          );
          setSeriesSeasons(seasonsWithEpisodes);
        }
      } catch (mediaRequestError) {
        setLoadingErrorMessage(
          mediaRequestError.message || "Não foi possível carregar o título.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMediaDetails();
  }, [mediaIdentifier]);

  async function handleEpisodeWatchedChange(episodeIdentifier, watched) {
    setEpisodeErrorMessage("");
    setSeriesSeasons((currentSeasons) => currentSeasons.map((season) => ({
      ...season,
      episodes: season.episodes.map((episode) =>
        episode.id === episodeIdentifier ? { ...episode, watched } : episode,
      ),
    })));

    try {
      await episodeRepository.update(episodeIdentifier, {
        watched,
        watched_at: watched ? new Date().toISOString() : null,
      });
    } catch (episodeRequestError) {
      setEpisodeErrorMessage(
        episodeRequestError.message || "Não foi possível atualizar o episódio.",
      );
      setSeriesSeasons((currentSeasons) => currentSeasons.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) =>
          episode.id === episodeIdentifier ? { ...episode, watched: !watched } : episode,
        ),
      })));
    }
  }

  async function handleDeleteMedia() {
    setIsDeletingMedia(true);
    setDeleteErrorMessage("");

    try {
      for (const season of seriesSeasons) {
        await episodeRepository.removeBySeasonId(season.id);
      }
      if (mediaItem.type === "tv") {
        await seasonRepository.removeByMediaId(mediaIdentifier);
      }
      await mediaRepository.remove(mediaIdentifier);
      window.location.hash = "#home";
    } catch (mediaDeleteError) {
      setDeleteErrorMessage(
        mediaDeleteError.message || "Não foi possível excluir o título.",
      );
      setIsDeletingMedia(false);
    }
  }

  if (isLoading) {
    return <main className="auth-page"><p className="loading-message">Carregando informações...</p></main>;
  }

  if (loadingErrorMessage) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="tmdb-detail-page">
          <p className="search-message is-error" role="alert">{loadingErrorMessage}</p>
        </main>
      </div>
    );
  }

  const mediaTypeLabel = MEDIA_TYPE_LABELS[mediaItem.type] || mediaItem.type;
  const statusLabel = MEDIA_STATUS_LABELS[mediaItem.status] || mediaItem.status;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="tmdb-detail-page">
        <a className="back-link" href="#home">← Voltar para a coleção</a>
        <article className="tmdb-detail">
          <div className="tmdb-poster-action-panel">
            {mediaItem.poster_path ? (
              <img
                className="tmdb-detail-poster"
                src={`${TMDB_POSTER_IMAGE_BASE_URL}${mediaItem.poster_path}`}
                alt={`Pôster de ${mediaItem.title}`}
              />
            ) : <div className="tmdb-detail-poster missing-poster">Sem pôster</div>}
          </div>
          <div className="tmdb-detail-copy">
            <p className="movie-kicker">{statusLabel}</p>
            <h1>{mediaItem.title}</h1>
            <p className="movie-meta">{mediaTypeLabel} · TMDB {mediaItem.tmdb_id}</p>
            <p className="movie-synopsis">{mediaItem.description || "Sinopse não disponível."}</p>
            <dl className="movie-facts">
            
              <div>
                <dt>Adicionado em</dt>
                <dd>{new Date(mediaItem.created_at).toLocaleDateString("pt-BR")}</dd>
              </div>
            </dl>
            <button
              className="delete-media-button"
              type="button"
              onClick={() => {
                setDeleteErrorMessage("");
                setIsDeleteModalOpen(true);
              }}
            >
              Excluir título
            </button>
          </div>
        </article>

        {mediaItem.type === "tv" && (
          <section className="seasons-section" aria-labelledby="seasons-title">
            <h2 id="seasons-title">Temporadas</h2>
            {episodeErrorMessage && <p className="search-message is-error" role="alert">{episodeErrorMessage}</p>}
            <div className="seasons-list">
              {seriesSeasons.map((season) => (
                <details className="season-accordion saved-season-accordion" key={season.id}>
                  <summary>
                    <div className="season-summary-copy">
                      <h3>Temporada {season.season_number}</h3>
                    </div>
                    <span className="accordion-icon" aria-hidden="true">⌄</span>
                  </summary>
                  <div className="episodes-panel">
                    <ol className="episodes-list">
                      {season.episodes.map((episode) => (
                        <li key={episode.id}>
                          <span>{String(episode.episode_number).padStart(2, "0")}</span>
                          <strong>{episode.name || "Episódio sem nome"}</strong>
                          <label className="episode-watched">
                            <input
                              type="checkbox"
                              checked={episode.watched}
                              onChange={(event) => handleEpisodeWatchedChange(episode.id, event.target.checked)}
                            />
                            Assistido
                          </label>
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
      {isDeleteModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <h2 id="delete-title">Excluir título?</h2>
            <p>Tem certeza que deseja excluir {mediaItem.title} da sua coleção?</p>
            {deleteErrorMessage && <p className="search-message is-error" role="alert">{deleteErrorMessage}</p>}
            <div className="modal-actions">
              <button
                className="modal-cancel-button"
                type="button"
                disabled={isDeletingMedia}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-delete-button"
                type="button"
                disabled={isDeletingMedia}
                onClick={handleDeleteMedia}
              >
                {isDeletingMedia ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default MoviePage;
