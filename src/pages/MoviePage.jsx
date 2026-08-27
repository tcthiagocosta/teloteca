import Navbar from "../components/Navbar.jsx";

function MoviePage({ movie }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="movie-page">
        <a className="back-link" href="#home">
          ← Voltar para a coleção
        </a>
        <article className="movie-detail">
          <div className={`detail-poster poster poster-${movie.accent}`}>
            <span className="poster-type">{movie.type}</span>
            <strong>{movie.title}</strong>
            <span className="score">{movie.score}</span>
          </div>
          <div className="movie-copy">
            <p className="movie-kicker">{movie.status}</p>
            <h1>{movie.title}</h1>
            <p className="movie-meta">
              {movie.year} · {movie.genre} · {movie.duration}
            </p>
            <p className="movie-synopsis">{movie.synopsis}</p>
            <dl className="movie-facts">
              <div>
                <dt>Direção</dt>
                <dd>{movie.director}</dd>
              </div>
              <div>
                <dt>Minha nota</dt>
                <dd>{movie.score} / 10</dd>
              </div>
            </dl>
            <button type="button">✓ {movie.status}</button>
          </div>
        </article>
      </main>
    </div>
  );
}

export default MoviePage;
