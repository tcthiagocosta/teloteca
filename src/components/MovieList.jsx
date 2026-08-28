const URL_BASE_IMAGEM_POSTER_TMDB = "https://image.tmdb.org/t/p/w342";

const ROTULOS_TIPO_MIDIA = {
  movie: "Filme",
  tv: "Série",
};

const ROTULOS_STATUS_MIDIA = {
  planejado: "Planejado",
  assistindo: "Assistindo",
  concluido: "Concluído",
  abandonado: "Abandonado",
};

function obterClasseStatus(statusMidia) {
  return `status-barra status-barra-${statusMidia}`;
}

function ListaFilmes({ itensMidia }) {
  return (
    <section className="catalog-list" aria-label="Lista de filmes e séries">
      {itensMidia.map((itemMidia) => (
        <a className="movie-card" href={`#movie/${itemMidia.id}`} key={itemMidia.id}>
          <div className={obterClasseStatus(itemMidia.status)}>
            {ROTULOS_STATUS_MIDIA[itemMidia.status] || itemMidia.status}
          </div>
          {itemMidia.caminho_poster ? (
            <div className="poster">
              <img
                className="media-poster-image"
                src={`${URL_BASE_IMAGEM_POSTER_TMDB}${itemMidia.caminho_poster}`}
                alt={`Pôster de ${itemMidia.titulo}`}
              />
              <span className="poster-type">{ROTULOS_TIPO_MIDIA[itemMidia.type] || itemMidia.type}</span>
              {itemMidia.avaliacao !== null && <span className="score">{itemMidia.avaliacao}</span>}
            </div>
          ) : (
            <div className="poster poster-missing">
              <span className="poster-type">{ROTULOS_TIPO_MIDIA[itemMidia.type] || itemMidia.type}</span>
              <strong>{itemMidia.titulo}</strong>
              {itemMidia.avaliacao !== null && <span className="score">{itemMidia.avaliacao}</span>}
            </div>
          )}
          <div className="movie-info">
            <p>{ROTULOS_TIPO_MIDIA[itemMidia.type] || itemMidia.type}</p>
            <h3>{itemMidia.titulo}</h3>
          </div>
        </a>
      ))}
    </section>
  );
}

export default ListaFilmes;
