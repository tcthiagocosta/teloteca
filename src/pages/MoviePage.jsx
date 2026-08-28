import { useEffect, useState } from "react";
import BarraNavegacao from "../components/Navbar.jsx";
import { mediaRepository } from "../repositories/mediaRepository.js";
import { seasonRepository } from "../repositories/seasonRepository.js";
import { episodeRepository } from "../repositories/episodeRepository.js";

const URL_BASE_IMAGEM_POSTER_TMDB = "https://image.tmdb.org/t/p/w500";

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

function PaginaFilme({ mediaIdentifier }) {
  const [itemMidia, definirItemMidia] = useState(null);
  const [temporadasSerie, definirTemporadasSerie] = useState([]);
  const [estaCarregando, definirEstaCarregando] = useState(true);
  const [mensagemErroCarregamento, definirMensagemErroCarregamento] = useState("");
  const [mensagemErroEpisodio, definirMensagemErroEpisodio] = useState("");
  const [modalExclusaoAberto, definirModalExclusaoAberto] = useState(false);
  const [estaExcluindoMidia, definirEstaExcluindoMidia] = useState(false);
  const [mensagemErroExclusao, definirMensagemErroExclusao] = useState("");
  const [estaAtualizandoStatusMidia, definirEstaAtualizandoStatusMidia] = useState(false);
  const [mensagemErroStatusMidia, definirMensagemErroStatusMidia] = useState("");

  useEffect(() => {
    let componenteMontado = true;

    async function carregarDetalhesMidia() {
      try {
        const midiaSalva = await mediaRepository.obterPorId(mediaIdentifier);
        if (!midiaSalva) throw new Error("Título não encontrado na coleção.");
        if (!componenteMontado) return;
        definirItemMidia(midiaSalva);

        if (midiaSalva.type === "tv") {
          const temporadasSalvas = await seasonRepository.obterPorIdMidia(mediaIdentifier);
          const temporadasComEpisodios = await Promise.all(
            temporadasSalvas.map(async (temporadaSalva) => ({
              ...temporadaSalva,
              episodios: await episodeRepository.obterPorIdTemporada(temporadaSalva.id),
            })),
          );
          if (!componenteMontado) return;
          definirTemporadasSerie(temporadasComEpisodios);
        }
      } catch (erroRequisicaoMidia) {
        if (!componenteMontado) return;
        definirMensagemErroCarregamento(
          erroRequisicaoMidia.message || "Não foi possível carregar o título.",
        );
      } finally {
        if (componenteMontado) definirEstaCarregando(false);
      }
    }

    carregarDetalhesMidia();
    return () => {
      componenteMontado = false;
    };
  }, [mediaIdentifier]);


  async function lidarComAlteracaoEpisodioAssistido(
    identificadorEpisodio,
    assistido,
  ) {
    definirMensagemErroEpisodio("");

    // Atualização otimista da interface
    definirTemporadasSerie((temporadasAtuais) =>
      temporadasAtuais.map((temporada) => ({
        ...temporada,
        episodios: temporada.episodios.map((episodio) =>
          episodio.id === identificadorEpisodio
            ? { ...episodio, assistido }
            : episodio,
        ),
      })),
    );

    try {
      // 1. Atualiza o episódio
      await episodeRepository.atualizar(identificadorEpisodio, {
        assistido,
        assistido_em: assistido
          ? new Date().toISOString()
          : null,
      });

      // 2. Verifica TODOS os episódios de TODAS as temporadas
      const todosEpisodiosAssistidos =
        await episodeRepository.todosAssistidosPorIdMidia(
          mediaIdentifier,
        );

      // 3. Define o status da mídia
      await mediaRepository.atualizar(mediaIdentifier, {
        status: todosEpisodiosAssistidos
          ? "concluido"
          : "assistindo",
      });
    } catch (erroRequisicaoEpisodio) {
      definirMensagemErroEpisodio(
        erroRequisicaoEpisodio.message ||
        "Não foi possível atualizar o episódio.",
      );

      // Desfaz a alteração otimista
      definirTemporadasSerie((temporadasAtuais) =>
        temporadasAtuais.map((temporada) => ({
          ...temporada,
          episodios: temporada.episodios.map((episodio) =>
            episodio.id === identificadorEpisodio
              ? {
                ...episodio,
                assistido: !assistido,
              }
              : episodio,
          ),
        })),
      );
    }
  }

  async function lidarComExclusaoMidia() {
    definirEstaExcluindoMidia(true);
    definirMensagemErroExclusao("");

    try {
      for (const temporada of temporadasSerie) {
        await episodeRepository.removerPorIdTemporada(temporada.id);
      }
      if (itemMidia.type === "tv") {
        await seasonRepository.removerPorIdMidia(mediaIdentifier);
      }
      await mediaRepository.remover(mediaIdentifier);
      window.location.hash = "#home";
    } catch (erroExclusaoMidia) {
      definirMensagemErroExclusao(
        erroExclusaoMidia.message || "Não foi possível excluir o título.",
      );
      definirEstaExcluindoMidia(false);
    }
  }

  async function lidarComAlteracaoStatusFilme(estaAssistido) {
    const statusAnterior = itemMidia.status;
    definirMensagemErroStatusMidia("");
    definirEstaAtualizandoStatusMidia(true);
    definirItemMidia((midiaAtual) => ({
      ...midiaAtual,
      status: estaAssistido ? "concluido" : "planejado",
    }));

    try {
      await mediaRepository.atualizar(mediaIdentifier, {
        status: estaAssistido ? "concluido" : "planejado",
      });
    } catch (erroAtualizacaoStatus) {
      definirItemMidia((midiaAtual) => ({
        ...midiaAtual,
        status: statusAnterior,
      }));
      definirMensagemErroStatusMidia(
        erroAtualizacaoStatus.message || "Não foi possível atualizar o status.",
      );
    } finally {
      definirEstaAtualizandoStatusMidia(false);
    }
  }

  if (estaCarregando) {
    return <main className="auth-page"><p className="loading-message">Carregando informações...</p></main>;
  }

  if (mensagemErroCarregamento) {
    return (
      <div className="app-shell">
        <BarraNavegacao />
        <main className="tmdb-detail-page">
          <p className="search-message is-error" role="alert">{mensagemErroCarregamento}</p>
        </main>
      </div>
    );
  }

  const rotuloTipoMidia = ROTULOS_TIPO_MIDIA[itemMidia.type] || itemMidia.type;
  const rotuloStatus = ROTULOS_STATUS_MIDIA[itemMidia.status] || itemMidia.status;
  const classeStatus = `status-barra status-barra-${itemMidia.status}`;

  return (
    <div className="app-shell">
      <BarraNavegacao />
      <main className="tmdb-detail-page">
        <a className="back-link" href="#home">← Voltar para a coleção</a>
        <article className="tmdb-detail">
          <div className="tmdb-poster-action-panel">
            <div className={classeStatus}>{rotuloStatus}</div>
            {itemMidia.caminho_poster ? (
              <img
                className="tmdb-detail-poster"
                src={`${URL_BASE_IMAGEM_POSTER_TMDB}${itemMidia.caminho_poster}`}
                alt={`Pôster de ${itemMidia.titulo}`}
              />
            ) : <div className="tmdb-detail-poster missing-poster">Sem pôster</div>}
          </div>
          <div className="tmdb-detail-copy">
            <h1>{itemMidia.titulo}</h1>
            <p className="movie-meta">{rotuloTipoMidia} · TMDB {itemMidia.tmdb_id}</p>
            <p className="movie-meta">Duração {itemMidia.duracao} min</p>
            <p className="movie-synopsis">{itemMidia.descricao || "Sinopse não disponível."}</p>
            <dl className="movie-facts">

              <div>
                <dt>Adicionado em</dt>
                <dd>{new Date(itemMidia.criado_em).toLocaleDateString("pt-BR")}</dd>
              </div>
            </dl>
            <button
              className="delete-media-button"
              type="button"
              onClick={() => {
                definirMensagemErroExclusao("");
                definirModalExclusaoAberto(true);
              }}
            >
              Excluir título
            </button>
            {itemMidia.type === "movie" && (
              <label className="movie-watched">
                <input
                  type="checkbox"
                  checked={itemMidia.status === "concluido"}
                  disabled={estaAtualizandoStatusMidia}
                  onChange={(evento) => lidarComAlteracaoStatusFilme(evento.target.checked)}
                />
                Concluído
              </label>
            )}
            {mensagemErroStatusMidia && (
              <p className="search-message is-error" role="alert">
                {mensagemErroStatusMidia}
              </p>
            )}
          </div>
        </article>

        {itemMidia.type === "tv" && (
          <section className="seasons-section" aria-labelledby="seasons-title">
            <h2 id="seasons-title">Temporadas</h2>
            {mensagemErroEpisodio && <p className="search-message is-error" role="alert">{mensagemErroEpisodio}</p>}
            <div className="seasons-list">
              {temporadasSerie.map((temporada) => (
                <details className="season-accordion saved-season-accordion" key={temporada.id}>
                  <summary>
                    <div className="season-summary-copy">
                      <h3>Temporada {temporada.numero_temporada}</h3>
                    </div>
                    <span className="accordion-icon" aria-hidden="true">⌄</span>
                  </summary>
                  <div className="episodes-panel">
                    <ol className="episodes-list">
                      {temporada.episodios.map((episodio) => (
                        <li key={episodio.id}>
                          <span>{String(episodio.numero_episodio).padStart(2, "0")}</span>
                          <strong>{episodio.nome || "Episódio sem nome"}</strong>
                          <label className="episode-watched">
                            <input
                              type="checkbox"
                              checked={episodio.assistido}
                              onChange={(evento) => lidarComAlteracaoEpisodioAssistido(episodio.id, evento.target.checked)}
                            />
                            Concluído
                          </label>
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
      {modalExclusaoAberto && (
        <div className="modal-backdrop" role="presentation">
          <section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <h2 id="delete-title">Excluir título?</h2>
            <p>Tem certeza que deseja excluir {itemMidia.titulo} da sua coleção?</p>
            {mensagemErroExclusao && <p className="search-message is-error" role="alert">{mensagemErroExclusao}</p>}
            <div className="modal-actions">
              <button
                className="modal-cancel-button"
                type="button"
                disabled={estaExcluindoMidia}
                onClick={() => definirModalExclusaoAberto(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-delete-button"
                type="button"
                disabled={estaExcluindoMidia}
                onClick={lidarComExclusaoMidia}
              >
                {estaExcluindoMidia ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default PaginaFilme;
