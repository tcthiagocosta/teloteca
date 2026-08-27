function MovieList({ movies }) {
  return (
    <section className="catalog-list" aria-label="Lista de filmes e séries">
      {movies.map((movie) => (
        <a className="movie-card" href={`#movie/${movie.id}`} key={movie.id}>
          <div
            className={`poster poster-${movie.accent}`}
            aria-label={`Ver informações de ${movie.title}`}
          >
            <span className="poster-type">{movie.type}</span>
            <strong>{movie.title}</strong>
            {movie.score && <span className="score">{movie.score}</span>}
          </div>
          <div className="movie-info">
            <p>
              {movie.year} · {movie.genre}
            </p>
            <h3>{movie.title}</h3>
          </div>
          <span className="status">{movie.status}</span>
        </a>
      ))}
    </section>
  );
}

export default MovieList;
