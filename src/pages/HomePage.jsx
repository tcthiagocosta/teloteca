import MovieList from "../components/MovieList.jsx";
import Navbar from "../components/Navbar.jsx";
import { libraryTitles } from "../data/movies.js";

function HomePage() {
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
        <MovieList libraryTitles={libraryTitles} />
      </main>
    </div>
  );
}

export default HomePage;
