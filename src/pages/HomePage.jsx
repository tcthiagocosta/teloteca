function HomePage() {
  return (
    <main className="home-page">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Seu arquivo pessoal de audiovisual</p>
        <h1 id="page-title">Teloteca</h1>
        <p className="intro-copy">
          Um lugar para reunir as histórias que já passaram pela sua tela.
        </p>
      </section>

      <section className="catalog-placeholder" aria-labelledby="catalog-title">
        <div>
          <p className="section-label">Próxima etapa</p>
          <h2 id="catalog-title">Seu catálogo começa aqui.</h2>
        </div>
        <p>
          Em breve, filmes e séries poderão ser organizados neste espaço com a
          sua própria curadoria.
        </p>
      </section>
    </main>
  )
}

export default HomePage
