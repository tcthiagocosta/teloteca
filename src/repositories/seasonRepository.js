import { clienteSupabase } from "../lib/supabaseClient.js";

/** @typedef {import("../types/database.types").Temporada} Temporada */
/** @typedef {import("../types/database.types").InsercaoTemporada} InsercaoTemporada */
/** @typedef {import("../types/database.types").AtualizacaoTemporada} AtualizacaoTemporada */

function lancarSeErroSupabase(erroSupabase) {
  if (erroSupabase) throw erroSupabase;
}

export const seasonRepository = {
  /** @returns {Promise<Temporada[]>} */
  async obterTodos() {
    const { data: linhasTemporada, error: erroSupabase } = await clienteSupabase
      .from("temporadas")
      .select("*")
      .order("numero_temporada", { ascending: true });
    lancarSeErroSupabase(erroSupabase);
    return linhasTemporada;
  },

  /** @param {number} identificadorMidia @returns {Promise<Temporada[]>} */
  async obterPorIdMidia(identificadorMidia) {
    const { data: linhasTemporada, error: erroSupabase } = await clienteSupabase
      .from("temporadas")
      .select("*")
      .eq("midia_id", identificadorMidia)
      .order("numero_temporada", { ascending: true });
    lancarSeErroSupabase(erroSupabase);
    return linhasTemporada;
  },

  /** @param {number} identificadorTemporada @returns {Promise<Temporada | null>} */
  async obterPorId(identificadorTemporada) {
    const { data: linhaTemporada, error: erroSupabase } = await clienteSupabase
      .from("temporadas")
      .select("*")
      .eq("id", identificadorTemporada)
      .maybeSingle();
    lancarSeErroSupabase(erroSupabase);
    return linhaTemporada;
  },

  /** @param {InsercaoTemporada} temporadaParaCriar @returns {Promise<Temporada>} */
    async criar(temporadaParaCriar) {
    const { data: linhaTemporadaCriada, error: erroSupabase } = await clienteSupabase
        .from("temporadas")
      .insert(temporadaParaCriar)
      .select()
      .single();
    lancarSeErroSupabase(erroSupabase);
    return linhaTemporadaCriada;
  },

  /** @param {number} identificadorTemporada @param {AtualizacaoTemporada} alteracoesTemporada @returns {Promise<Temporada>} */
    async atualizar(identificadorTemporada, alteracoesTemporada) {
    const { data: linhaTemporadaAtualizada, error: erroSupabase } = await clienteSupabase
        .from("temporadas")
      .update(alteracoesTemporada)
        .eq("id", identificadorTemporada)
      .select()
      .single();
    lancarSeErroSupabase(erroSupabase);
    return linhaTemporadaAtualizada;
  },

  /** @param {number} mediaIdentifier @returns {Promise<void>} */
    async removerPorIdMidia(identificadorMidia) {
    const { error: erroSupabase } = await clienteSupabase
        .from("temporadas")
      .delete()
        .eq("midia_id", identificadorMidia);
    lancarSeErroSupabase(erroSupabase);
  },

  /** @param {number} seasonIdentifier @returns {Promise<void>} */
    async remover(identificadorTemporada) {
    const { error: erroSupabase } = await clienteSupabase
        .from("temporadas")
      .delete()
        .eq("id", identificadorTemporada);
    lancarSeErroSupabase(erroSupabase);
  },
};
