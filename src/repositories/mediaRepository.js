import { clienteSupabase } from "../lib/supabaseClient.js";

/** @typedef {import("../types/database.types").Midia} Midia */
/** @typedef {import("../types/database.types").InsercaoMidia} InsercaoMidia */
/** @typedef {import("../types/database.types").AtualizacaoMidia} AtualizacaoMidia */
/** @typedef {import("../types/database.types").TipoMidia} TipoMidia */

function lancarSeErroSupabase(erroSupabase) {
  if (erroSupabase) throw erroSupabase;
}

export const mediaRepository = {
  /** @returns {Promise<Midia[]>} */
  async obterTodos() {
    const { data: linhasMidia, error: erroSupabase } = await clienteSupabase
      .from("midias")
      .select("*")
      .order("criado_em", { ascending: false });
    lancarSeErroSupabase(erroSupabase);
    return linhasMidia;
  },

  /** @param {number} identificadorMidia @returns {Promise<Midia | null>} */
  async obterPorId(identificadorMidia) {
    const { data: linhaMidia, error: erroSupabase } = await clienteSupabase
      .from("midias")
      .select("*")
      .eq("id", identificadorMidia)
      .maybeSingle();
    lancarSeErroSupabase(erroSupabase);
    return linhaMidia;
  },

  /** @param {number} identificadorTmdb @param {TipoMidia} tipoMidia @returns {Promise<Midia | null>} */
  async obterPorIdentificadorETipoTmdb(identificadorTmdb, tipoMidia) {
    const { data: linhaMidia, error: erroSupabase } = await clienteSupabase
      .from("midias")
      .select("*")
      .eq("tmdb_id", identificadorTmdb)
      .eq("type", tipoMidia)
      .maybeSingle();
    lancarSeErroSupabase(erroSupabase);
    return linhaMidia;
  },

  /** @param {InsercaoMidia} midiaParaCriar @returns {Promise<Midia>} */
  async criar(midiaParaCriar) {
    const { data: linhaMidiaCriada, error: erroSupabase } = await clienteSupabase
      .from("midias")
      .insert(midiaParaCriar)
      .select()
      .single();
    lancarSeErroSupabase(erroSupabase);
    return linhaMidiaCriada;
  },

  async criarSerie(midiaParaCriar, temporadasParaCriar, episodiosParaCriar) {
    let linhaMidiaCriada = null;

    try {
      // ========================================================
      // 1. CRIAR MÍDIA
      // ========================================================

      const { data: midiaCriada, error: erroCriacaoMidia } =
        await clienteSupabase
          .from("midias")
          .insert(midiaParaCriar)
          .select()
          .single();

      lancarSeErroSupabase(erroCriacaoMidia);

      linhaMidiaCriada = midiaCriada;


      // ========================================================
      // 2. CRIAR TEMPORADAS
      // ========================================================

      const temporadasComMidia = temporadasParaCriar.map((temporada) => ({
        ...temporada,
        midia_id: linhaMidiaCriada.id,
      }));

      const { data: temporadasCriadas, error: erroCriacaoTemporadas } =
        await clienteSupabase
          .from("temporadas")
          .insert(temporadasComMidia)
          .select();

      lancarSeErroSupabase(erroCriacaoTemporadas);


      // ========================================================
      // 3. CRIAR EPISÓDIOS
      // ========================================================

      const episodiosComTemporada = episodiosParaCriar
        .map((episodio) => {
          const {
            numero_temporada: numeroTemporada,
            ...dadosEpisodio
          } = episodio;

          const temporadaCriada = temporadasCriadas.find(
            (temporada) =>
              temporada.numero_temporada === numeroTemporada,
          );

          return temporadaCriada
            ? {
              ...dadosEpisodio,
              temporada_id: temporadaCriada.id,
            }
            : null;
        })
        .filter(Boolean);

      const { error: erroCriacaoEpisodios } =
        await clienteSupabase
          .from("episodios")
          .insert(episodiosComTemporada);

      lancarSeErroSupabase(erroCriacaoEpisodios);

      return linhaMidiaCriada;

    } catch (erro) {

      // ========================================================
      // ROLLBACK MANUAL
      // ========================================================

      if (linhaMidiaCriada?.id) {
        const { error: erroRollback } = await clienteSupabase
          .from("midias")
          .delete()
          .eq("id", linhaMidiaCriada.id);

        if (erroRollback) {
          console.error(
            "Erro ao desfazer criação da série:",
            erroRollback,
          );
        }
      }

      throw erro;
    }
  },

  /**
  * @param {InsercaoMidia} midiaParaCriar
  * @param {object[]} temporadasParaCriar
  * @param {object[]} episodiosParaCriar
  * @returns {Promise<Midia>}
   */
  async criarSerie2(midiaParaCriar, temporadasParaCriar, episodiosParaCriar) {
    const { data: linhaMidiaCriada, error: erroCriacaoMidia } = await clienteSupabase
      .from("midias")
      .insert(midiaParaCriar)
      .select()
      .single();
    lancarSeErroSupabase(erroCriacaoMidia);

    const temporadasComMidia = temporadasParaCriar.map((temporada) => ({
      ...temporada,
      midia_id: linhaMidiaCriada.id,
    }));
    const { data: temporadasCriadas, error: erroCriacaoTemporadas } = await clienteSupabase
      .from("temporadas")
      .insert(temporadasComMidia)
      .select();
    lancarSeErroSupabase(erroCriacaoTemporadas);

    const episodiosComTemporada = episodiosParaCriar
      .map((episodio) => {
        const { numero_temporada: numeroTemporada, ...dadosEpisodio } = episodio;
        const temporadaCriada = temporadasCriadas.find(
          (temporada) => temporada.numero_temporada === numeroTemporada,
        );
        return temporadaCriada
          ? { ...dadosEpisodio, temporada_id: temporadaCriada.id }
          : null;
      })
      .filter(Boolean);
    const { error: erroCriacaoEpisodios } = await clienteSupabase
      .from("episodios")
      .insert(episodiosComTemporada);
    lancarSeErroSupabase(erroCriacaoEpisodios);

    return linhaMidiaCriada;
  },

  /** @param {number} identificadorMidia @param {AtualizacaoMidia} alteracoesMidia @returns {Promise<Midia>} */
  async atualizar(identificadorMidia, alteracoesMidia) {
    const { data: linhaMidiaAtualizada, error: erroSupabase } = await clienteSupabase
      .from("midias")
      .update(alteracoesMidia)
      .eq("id", identificadorMidia)
      .select()
      .single();
    lancarSeErroSupabase(erroSupabase);
    return linhaMidiaAtualizada;
  },

  /** @param {number} identificadorMidia @returns {Promise<void>} */
  async remover(identificadorMidia) {
    const { error: erroSupabase } = await clienteSupabase
      .from("midias")
      .delete()
      .eq("id", identificadorMidia);
    lancarSeErroSupabase(erroSupabase);
  },
};
