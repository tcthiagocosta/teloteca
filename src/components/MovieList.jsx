const TMDB_POSTER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

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

function MovieList({ mediaItems }) {
  return (
    <section className="catalog-list" aria-label="Lista de filmes e séries">
      {mediaItems.map((mediaItem) => (
        <a className="movie-card" href={`#movie/${mediaItem.id}`} key={mediaItem.id}>
          {mediaItem.poster_path ? (
            <div className="poster">
              <img
                className="media-poster-image"
                src={`${TMDB_POSTER_IMAGE_BASE_URL}${mediaItem.poster_path}`}
                alt={`Pôster de ${mediaItem.title}`}
              />
              <span className="poster-type">{MEDIA_TYPE_LABELS[mediaItem.type] || mediaItem.type}</span>
              {mediaItem.rating !== null && <span className="score">{mediaItem.rating}</span>}
            </div>
          ) : (
            <div className="poster poster-missing">
              <span className="poster-type">{MEDIA_TYPE_LABELS[mediaItem.type] || mediaItem.type}</span>
              <strong>{mediaItem.title}</strong>
              {mediaItem.rating !== null && <span className="score">{mediaItem.rating}</span>}
            </div>
          )}
          <div className="movie-info">
            <p>{MEDIA_TYPE_LABELS[mediaItem.type] || mediaItem.type}</p>
            <h3>{mediaItem.title}</h3>
          </div>
          <span className="status">{MEDIA_STATUS_LABELS[mediaItem.status] || mediaItem.status}</span>
        </a>
      ))}
    </section>
  );
}

export default MovieList;
