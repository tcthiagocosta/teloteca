import { useEffect, useState } from "react";
import MovieList from "../components/MovieList.jsx";
import Navbar from "../components/Navbar.jsx";
import { mediaRepository } from "../repositories/mediaRepository.js";

function HomePage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [mediaLoadError, setMediaLoadError] = useState("");

  useEffect(() => {
    let isComponentMounted = true;

    async function loadMediaItems() {
      try {
        const mediaRows = await mediaRepository.getAll();
        if (isComponentMounted) setMediaItems(mediaRows);
      } catch (mediaRequestError) {
        if (isComponentMounted) {
          setMediaLoadError(
            mediaRequestError.message || "Não foi possível carregar sua coleção.",
          );
        }
      } finally {
        if (isComponentMounted) setIsLoadingMedia(false);
      }
    }

    loadMediaItems();
    return () => {
      isComponentMounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="home-page" id="home">
        <section className="catalog-header" aria-labelledby="catalog-title">
          <div>
            <h1 id="catalog-title">Minha coleção</h1>
          </div>
          <div className="catalog-actions">
            <a href="#add-title">+ Adicionar título</a>
          </div>
        </section>
        {isLoadingMedia && <p className="loading-message">Carregando sua coleção...</p>}
        {mediaLoadError && <p className="search-message is-error" role="alert">{mediaLoadError}</p>}
        {!isLoadingMedia && !mediaLoadError && <MovieList mediaItems={mediaItems} />}
      </main>
    </div>
  );
}

export default HomePage;
