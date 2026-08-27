import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import AddTitlePage from "./pages/AddTitlePage.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import TmdbItemPage from "./pages/TmdbItemPage.jsx";
import { movies } from "./data/movies.js";
import "./App.css";

function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  if (hash === "#add-title") return <AddTitlePage />;

  const tmdbMatch = hash.match(/^#tmdb\/(movie|tv)\/(\d+)$/);
  if (tmdbMatch) {
    return <TmdbItemPage mediaType={tmdbMatch[1]} itemId={tmdbMatch[2]} />;
  }

  const movieId = hash.replace("#movie/", "");
  const movie = movies.find((item) => item.id === movieId);
  return movie ? <MoviePage movie={movie} /> : <HomePage />;
}

export default App;
