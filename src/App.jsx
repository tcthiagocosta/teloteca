import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import AddTitlePage from "./pages/AddTitlePage.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import TmdbItemPage from "./pages/TmdbItemPage.jsx";
import { libraryTitles } from "./data/movies.js";
import "./App.css";

function App() {
  const [currentLocationHash, setCurrentLocationHash] = useState(
    () => window.location.hash,
  );

  useEffect(() => {
    const synchronizeLocationHash = () =>
      setCurrentLocationHash(window.location.hash);
    window.addEventListener("hashchange", synchronizeLocationHash);
    return () =>
      window.removeEventListener("hashchange", synchronizeLocationHash);
  }, []);

  if (currentLocationHash === "#add-title") return <AddTitlePage />;

  const tmdbRouteMatch = currentLocationHash.match(/^#tmdb\/(movie|tv)\/(\d+)$/);
  if (tmdbRouteMatch) {
    return (
      <TmdbItemPage
        tmdbMediaType={tmdbRouteMatch[1]}
        tmdbItemIdentifier={tmdbRouteMatch[2]}
      />
    );
  }

  const libraryTitleIdentifier = currentLocationHash.replace("#movie/", "");
  const selectedLibraryTitle = libraryTitles.find(
    (libraryTitle) => libraryTitle.titleIdentifier === libraryTitleIdentifier,
  );
  return selectedLibraryTitle ? (
    <MoviePage libraryTitle={selectedLibraryTitle} />
  ) : (
    <HomePage />
  );
}

export default App;
