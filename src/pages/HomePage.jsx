import { useEffect, useState } from "react";
import ListaFilmes from "../components/MovieList.jsx";
import BarraNavegacao from "../components/Navbar.jsx";
import { mediaRepository } from "../repositories/mediaRepository.js";
import { seasonRepository } from "../repositories/seasonRepository.js";
import { episodeRepository } from "../repositories/episodeRepository.js";

function formatarDuracao(minutosTotais) {
  const minutosPorMes = 30 * 24 * 60;
  const minutosPorHora = 60;
  const meses = Math.floor(minutosTotais / minutosPorMes);
  const minutosRestantesDoMes = minutosTotais % minutosPorMes;
  const horas = Math.floor(minutosRestantesDoMes / minutosPorHora);
  const minutos = minutosRestantesDoMes % minutosPorHora;
  const partesDuracao = [];

  if (meses > 0) partesDuracao.push(`${meses} ${meses === 1 ? "mês" : "meses"}`);
  partesDuracao.push(`${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")} horas`);

  return partesDuracao.join(" e ");
}

function PaginaInicial() {
  const [itensMidia, definirItensMidia] = useState([]);
  const [textoBusca, definirTextoBusca] = useState("");
  const [minutosFilmes, definirMinutosFilmes] = useState(0);
  const [minutosSeriesAssistidos, definirMinutosSeriesAssistidos] = useState(0);
  const [estaCarregandoMidia, definirEstaCarregandoMidia] = useState(true);
  const [erroCarregamentoMidia, definirErroCarregamentoMidia] = useState("");

  useEffect(() => {
    let componenteMontado = true;

    async function carregarItensMidia() {
      try {
        const linhasMidia = await mediaRepository.obterTodos();
        const minutosDosFilmes = linhasMidia
          .filter((itemMidia) => itemMidia.type === "movie")
          .reduce((total, itemMidia) => total + (Number(itemMidia.duracao) || 0), 0);
        const series = linhasMidia.filter((itemMidia) => itemMidia.type === "tv");
        const minutosDasSeriesAssistidos = await series.reduce(
          async (promessaTotal, itemSerie) => {
            const totalAtual = await promessaTotal;
            const temporadas = await seasonRepository.obterPorIdMidia(itemSerie.id);
            const episodiosPorTemporada = await Promise.all(
              temporadas.map((temporada) => episodeRepository.obterPorIdTemporada(temporada.id)),
            );
            const minutosDaSerie = episodiosPorTemporada
              .flat()
              .filter((episodio) => episodio.assistido)
              .reduce((total, episodio) => total + (Number(episodio.duracao) || 0), 0);
            return totalAtual + minutosDaSerie;
          },
          Promise.resolve(0),
        );

        if (componenteMontado) {
          definirItensMidia(linhasMidia);
          definirMinutosFilmes(minutosDosFilmes);
          definirMinutosSeriesAssistidos(minutosDasSeriesAssistidos);
        }
      } catch (erroRequisicaoMidia) {
        if (componenteMontado) {
          definirErroCarregamentoMidia(
            erroRequisicaoMidia.message || "Não foi possível carregar sua coleção.",
          );
        }
      } finally {
        if (componenteMontado) definirEstaCarregandoMidia(false);
      }
    }

    carregarItensMidia();
    return () => {
      componenteMontado = false;
    };
  }, []);

  const itensMidiaFiltrados = itensMidia.filter((itemMidia) =>
    itemMidia.titulo.toLocaleLowerCase().includes(textoBusca.trim().toLocaleLowerCase()),
  );

  return (
    <div className="app-shell">
      <BarraNavegacao />
      <main className="home-page" id="home">
        <section className="catalog-header" aria-labelledby="catalog-title">
          <div>
            <h1 id="catalog-title">Minha coleção</h1>
          </div>
          <div className="catalog-actions">
            <a href="#add-title">+ Adicionar título</a>
          </div>
        </section>
        <label className="catalog-search">
          <span>Buscar na coleção</span>
          <input
            type="search"
            value={textoBusca}
            onChange={(evento) => definirTextoBusca(evento.target.value)}
            placeholder="Buscar por título..."
            aria-label="Buscar na coleção"
          />
        </label>
        <section className="watch-time-section" aria-labelledby="watch-time-title">
          <div className="watch-time-heading">
            <p className="section-kicker">Seu tempo de tela</p>
            <h2 id="watch-time-title">O que você já assistiu</h2>
          </div>
          <div className="watch-time-cards">
            <article className="watch-time-card watch-time-card-movies">
              <span className="watch-time-icon" aria-hidden="true">▰</span>
              <div>
                <p>Tempo de filme</p>
                <strong>{formatarDuracao(minutosFilmes)}</strong>
              </div>
            </article>
            <article className="watch-time-card watch-time-card-series">
              <span className="watch-time-icon" aria-hidden="true">◉</span>
              <div>
                <p>Tempo de séries</p>
                <strong>{formatarDuracao(minutosSeriesAssistidos)}</strong>
              </div>
            </article>
          </div>
        </section>
        {estaCarregandoMidia && <p className="loading-message">Carregando sua coleção...</p>}
        {erroCarregamentoMidia && <p className="search-message is-error" role="alert">{erroCarregamentoMidia}</p>}
        {!estaCarregandoMidia && !erroCarregamentoMidia && <ListaFilmes itensMidia={itensMidiaFiltrados} />}
      </main>
    </div>
  );
}

export default PaginaInicial;
