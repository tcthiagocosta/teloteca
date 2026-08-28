import { clienteSupabase } from "../lib/supabaseClient.js";

/** @typedef {import("../types/database.types").Episodio} Episodio */
/** @typedef {import("../types/database.types").InsercaoEpisodio} InsercaoEpisodio */
/** @typedef {import("../types/database.types").AtualizacaoEpisodio} AtualizacaoEpisodio */

function lancarSeErroSupabase(erroSupabase) {
  if (erroSupabase) throw erroSupabase;
}

export const episodeRepository = {
  /** @returns {Promise<Episodio[]>} */
  async obterTodos() {
    const { data: linhasEpisodio, error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .select("*")
      .order("numero_episodio", { ascending: true });
    lancarSeErroSupabase(erroSupabase);
    return linhasEpisodio;
  },

  /** @param {number} identificadorTemporada @returns {Promise<Episodio[]>} */
  async obterPorIdTemporada(identificadorTemporada) {
    const { data: linhasEpisodio, error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .select("*")
      .eq("temporada_id", identificadorTemporada)
      .order("numero_episodio", { ascending: true });
    lancarSeErroSupabase(erroSupabase);
    return linhasEpisodio;
  },

  /** @param {number} identificadorEpisodio @returns {Promise<Episodio | null>} */
  async obterPorId(identificadorEpisodio) {
    const { data: linhaEpisodio, error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .select("*")
      .eq("id", identificadorEpisodio)
      .maybeSingle();
    lancarSeErroSupabase(erroSupabase);
    return linhaEpisodio;
  },

  /** @param {InsercaoEpisodio} episodioParaCriar @returns {Promise<Episodio>} */
  async criar(episodioParaCriar) {
    const { data: linhaEpisodioCriada, error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .insert(episodioParaCriar)
      .select()
      .single();
    lancarSeErroSupabase(erroSupabase);
    return linhaEpisodioCriada;
  },

  /** @param {number} identificadorEpisodio @param {AtualizacaoEpisodio} alteracoesEpisodio @returns {Promise<Episodio>} */
  async atualizar(identificadorEpisodio, alteracoesEpisodio) {
    const { data: linhaEpisodioAtualizada, error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .update(alteracoesEpisodio)
      .eq("id", identificadorEpisodio)
      .select()
      .single();
    lancarSeErroSupabase(erroSupabase);
    return linhaEpisodioAtualizada;
  },

  /** @param {number} identificadorTemporada @returns {Promise<void>} */
  async removerPorIdTemporada(identificadorTemporada) {
    const { error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .delete()
      .eq("temporada_id", identificadorTemporada);
    lancarSeErroSupabase(erroSupabase);
  },

  /** @param {number} identificadorEpisodio @returns {Promise<void>} */
  async remover(identificadorEpisodio) {
    const { error: erroSupabase } = await clienteSupabase
      .from("episodios")
      .delete()
      .eq("id", identificadorEpisodio);
    lancarSeErroSupabase(erroSupabase);
  },

  async todosAssistidosPorIdMidia(identificadorMidia) {
    // Busca todas as temporadas da mídia
    const { data: temporadas, error: erroTemporadas } =
      await clienteSupabase
        .from("temporadas")
        .select("id")
        .eq("midia_id", identificadorMidia);

    lancarSeErroSupabase(erroTemporadas);

    const idsTemporadas = temporadas.map(
      (temporada) => temporada.id,
    );

    // Se não existem temporadas, a mídia não pode ser considerada concluída
    if (idsTemporadas.length === 0) {
      return false;
    }

    // Busca todos os episódios dessas temporadas
    const { data: episodios, error: erroEpisodios } =
      await clienteSupabase
        .from("episodios")
        .select("id, assistido")
        .in("temporada_id", idsTemporadas);

    lancarSeErroSupabase(erroEpisodios);

    // Se não existem episódios, não considera concluída
    if (episodios.length === 0) {
      return false;
    }

    // Só retorna true se TODOS estiverem assistidos
    return episodios.every(
      (episodio) => episodio.assistido === true,
    );
  },
};
