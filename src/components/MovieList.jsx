function MovieList({ libraryTitles }) {
  return (
    <section className="catalog-list" aria-label="Lista de filmes e séries">
      {libraryTitles.map((libraryTitle) => (
        <a className="movie-card" href={`#movie/${libraryTitle.titleIdentifier}`} key={libraryTitle.titleIdentifier}>
          <div
            className={`poster poster-${libraryTitle.posterAccentColor}`}
            aria-label={`Ver informações de ${libraryTitle.displayTitle}`}
          >
            <span className="poster-type">{libraryTitle.mediaTypeLabel}</span>
            <strong>{libraryTitle.displayTitle}</strong>
            {libraryTitle.userRatingScore && <span className="score">{libraryTitle.userRatingScore}</span>}
          </div>
          <div className="movie-info">
            <p>
              {libraryTitle.releaseYear} · {libraryTitle.genreLabel}
            </p>
            <h3>{libraryTitle.displayTitle}</h3>
          </div>
          <span className="status">{libraryTitle.viewingStatusLabel}</span>
        </a>
      ))}
    </section>
  );
}

export default MovieList;
