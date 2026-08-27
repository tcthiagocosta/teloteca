import { useState } from "react";
import { supabaseClient } from "../lib/supabaseClient.js";

function LoginPage({ onLogin }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  async function handleLoginFormSubmission(formSubmissionEvent) {
    formSubmissionEvent.preventDefault();
    setIsSigningIn(true);
    setLoginErrorMessage("");

    const { data: signInData, error: signInError } =
      await supabaseClient.auth.signInWithPassword({
        email: emailAddress.trim(),
        password,
      });

    if (signInError) {
      setLoginErrorMessage(signInError.message || "Não foi possível entrar.");
    } else {
      onLogin(signInData.session);
    }
    setIsSigningIn(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="movie-kicker">TELOTECA</p>
        <h1 id="login-title">Entrar</h1>
        <form className="auth-form" onSubmit={handleLoginFormSubmission}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={emailAddress}
            onChange={(event) => setEmailAddress(event.target.value)}
            required
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button type="submit" disabled={isSigningIn}>
            {isSigningIn ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {loginErrorMessage && (
          <p className="search-message is-error" role="alert">
            {loginErrorMessage}
          </p>
        )}
      </section>
    </main>
  );
}

export default LoginPage;
