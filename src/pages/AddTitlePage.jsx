import { useState } from "react";
import Navbar from "../components/Navbar.jsx";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w342";

function getTitle(result) {
  return result.title || result.name || "Título não informado";
}

function getReleaseYear(result) {
  const releaseDate = result.release_date || result.first_air_date;
  return releaseDate ? releaseDate.slice(0, 4) : "Ano não informado";
}

function AddTitlePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    if (!query.trim()) {
      setError("Digite um título para pesquisar.");
      return;
    }

    if (!apiKey) {
      setError("Configure a chave VITE_TMDB_API_KEY no arquivo .env.local.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        api_key: apiKey,
        language: "pt-BR",
        query: query.trim(),
        include_adult: "false",
      });
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?${params}`,
      );

      if (!response.ok) throw new Error("Não foi possível consultar a TMDB.");

      const data = await response.json();
      setResults(
        data.results.filter((item) =>
          ["movie", "tv"].includes(item.media_type),
        ),
      );
    } catch (requestError) {
      setError(
        requestError.message || "Ocorreu um erro ao realizar a consulta.",
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
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
          <form className="title-search-form" onSubmit={handleSearch}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: Interestelar"
              aria-label="Título para pesquisar"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Consultando..." : "Consultar"}
            </button>
          </form>
          {error && (
            <p className="search-message is-error" role="alert">
              {error}
            </p>
          )}
        </section>

        {results.length > 0 && (
          <section className="tmdb-results" aria-label="Resultados da pesquisa">
            <h2>Resultados encontrados</h2>
            <div className="tmdb-results-grid">
              {results.map((result) => (
                <article
                  className="tmdb-result"
                  key={`${result.media_type}-${result.id}`}
                >
                  {result.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_URL}${result.poster_path}`}
                      alt={`Pôster de ${getTitle(result)}`}
                    />
                  ) : (
                    <div className="missing-poster">Sem pôster</div>
                  )}
                  <div>
                    <p>
                      {result.media_type === "tv" ? "Série" : "Filme"} ·{" "}
                      {getReleaseYear(result)}
                    </p>
                    <h3>{getTitle(result)}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AddTitlePage;
