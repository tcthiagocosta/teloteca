import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { TMDB_API_ACCESS_KEY } from "../config/tmdb.js";

const TMDB_POSTER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

function getTmdbResultDisplayTitle(tmdbSearchResult) {
  return tmdbSearchResult.title || tmdbSearchResult.name || "Título não informado";
}

function getTmdbResultReleaseYear(tmdbSearchResult) {
  const titleReleaseDate =
    tmdbSearchResult.release_date || tmdbSearchResult.first_air_date;
  return titleReleaseDate ? titleReleaseDate.slice(0, 4) : "Ano não informado";
}

function AddTitlePage() {
  const [searchQueryText, setSearchQueryText] = useState("");
  const [tmdbSearchResults, setTmdbSearchResults] = useState([]);
  const [isSearchRequestInProgress, setIsSearchRequestInProgress] = useState(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");

  async function handleTitleSearchFormSubmission(formSubmissionEvent) {
    formSubmissionEvent.preventDefault();
    if (!searchQueryText.trim()) {
      setSearchErrorMessage("Digite um título para pesquisar.");
      return;
    }

    if (TMDB_API_ACCESS_KEY === "COLE_SUA_CHAVE_DA_TMDB_AQUI") {
      setSearchErrorMessage("Configure a chave da TMDB no arquivo src/config/tmdb.js.");
      return;
    }

    setIsSearchRequestInProgress(true);
    setSearchErrorMessage("");

    try {
      const tmdbSearchRequestParameters = new URLSearchParams({
        api_key: TMDB_API_ACCESS_KEY,
        language: "pt-BR",
        query: searchQueryText.trim(),
        include_adult: "false",
      });
      const tmdbSearchResponse = await fetch(
        `https://api.themoviedb.org/3/search/multi?${tmdbSearchRequestParameters}`,
      );

      if (!tmdbSearchResponse.ok) throw new Error("Não foi possível consultar a TMDB.");

      const tmdbSearchResponseData = await tmdbSearchResponse.json();
      console.log("TMDB search response:", tmdbSearchResponseData);
      setTmdbSearchResults(
        tmdbSearchResponseData.results.filter((tmdbSearchResult) =>
          ["movie", "tv"].includes(tmdbSearchResult.media_type),
        ),
      );
    } catch (tmdbSearchRequestError) {
      setSearchErrorMessage(
        tmdbSearchRequestError.message || "Ocorreu um erro ao realizar a consulta.",
      );
      setTmdbSearchResults([]);
    } finally {
      setIsSearchRequestInProgress(false);
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
          <form className="title-search-form" onSubmit={handleTitleSearchFormSubmission}>
            <input
              type="search"
              value={searchQueryText}
              onChange={(inputChangeEvent) => setSearchQueryText(inputChangeEvent.target.value)}
              placeholder="Ex.: Interestelar"
              aria-label="Título para pesquisar"
            />
            <button type="submit" disabled={isSearchRequestInProgress}>
              {isSearchRequestInProgress ? "Consultando..." : "Consultar"}
            </button>
          </form>
          {searchErrorMessage && (
            <p className="search-message is-error" role="alert">
              {searchErrorMessage}
            </p>
          )}
        </section>

        {tmdbSearchResults.length > 0 && (
          <section className="tmdb-results" aria-label="Resultados da pesquisa">
            <h2>Resultados encontrados</h2>
            <div className="tmdb-results-grid">
              {tmdbSearchResults.map((tmdbSearchResult) => (
                <a
                  className="tmdb-result"
                  href={`#tmdb/${tmdbSearchResult.media_type}/${tmdbSearchResult.id}`}
                  key={`${tmdbSearchResult.media_type}-${tmdbSearchResult.id}`}
                >
                  {tmdbSearchResult.poster_path ? (
                    <img
                      src={`${TMDB_POSTER_IMAGE_BASE_URL}${tmdbSearchResult.poster_path}`}
                      alt={`Pôster de ${getTmdbResultDisplayTitle(tmdbSearchResult)}`}
                    />
                  ) : (
                    <div className="missing-poster">Sem pôster</div>
                  )}
                  <div>
                    <p>
                      {tmdbSearchResult.media_type === "tv" ? "Série" : "Filme"} ·{" "}
                      {getTmdbResultReleaseYear(tmdbSearchResult)}
                    </p>
                    <h3>{getTmdbResultDisplayTitle(tmdbSearchResult)}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AddTitlePage;
