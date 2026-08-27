import Navbar from "../components/Navbar.jsx";

function MoviePage({ libraryTitle }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="movie-page">
        <a className="back-link" href="#home">
          ← Voltar para a coleção
        </a>
        <article className="movie-detail">
          <div className={`detail-poster poster poster-${libraryTitle.posterAccentColor}`}>
            <span className="poster-type">{libraryTitle.mediaTypeLabel}</span>
            <strong>{libraryTitle.displayTitle}</strong>
            <span className="score">{libraryTitle.userRatingScore}</span>
          </div>
          <div className="movie-copy">
            <p className="movie-kicker">{libraryTitle.viewingStatusLabel}</p>
            <h1>{libraryTitle.displayTitle}</h1>
            <p className="movie-meta">
              {libraryTitle.releaseYear} · {libraryTitle.genreLabel} · {libraryTitle.runtimeLabel}
            </p>
            <p className="movie-synopsis">{libraryTitle.plotSynopsis}</p>
            <dl className="movie-facts">
              <div>
                <dt>Direção</dt>
                <dd>{libraryTitle.directorName}</dd>
              </div>
              <div>
                <dt>Minha nota</dt>
                <dd>{libraryTitle.userRatingScore} / 10</dd>
              </div>
            </dl>
            <button type="button">✓ {libraryTitle.viewingStatusLabel}</button>
          </div>
        </article>
      </main>
    </div>
  );
}

export default MoviePage;
