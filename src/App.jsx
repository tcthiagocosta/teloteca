import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import AddTitlePage from "./pages/AddTitlePage.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import TmdbItemPage from "./pages/TmdbItemPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { supabaseClient } from "./lib/supabaseClient.js";
import "./App.css";

function App() {
  const [currentLocationHash, setCurrentLocationHash] = useState(
    () => window.location.hash,
  );
  const [currentSession, setCurrentSession] = useState(undefined);

  useEffect(() => {
    const synchronizeLocationHash = () =>
      setCurrentLocationHash(window.location.hash);
    window.addEventListener("hashchange", synchronizeLocationHash);
    return () =>
      window.removeEventListener("hashchange", synchronizeLocationHash);
  }, []);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: sessionData }) => {
      setCurrentSession(sessionData.session);
    });

    const { data: authSubscriptionData } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => setCurrentSession(session),
    );
    return () => authSubscriptionData.subscription.unsubscribe();
  }, []);

  if (currentSession === undefined) {
    return <main className="auth-page"><p className="loading-message">Carregando...</p></main>;
  }

  if (!currentSession) return <LoginPage onLogin={setCurrentSession} />;

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

  const mediaIdentifierMatch = currentLocationHash.match(/^#movie\/(\d+)$/);
  return mediaIdentifierMatch ? (
      <MoviePage mediaIdentifier={Number(mediaIdentifierMatch[1])} />
  ) : <HomePage />;
}

export default App;
