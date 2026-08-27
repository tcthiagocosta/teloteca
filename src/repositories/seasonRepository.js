import { supabaseClient } from "../lib/supabaseClient.js";

/** @typedef {import("../types/database.types").Season} Season */
/** @typedef {import("../types/database.types").SeasonInsert} SeasonInsert */
/** @typedef {import("../types/database.types").SeasonUpdate} SeasonUpdate */

function throwIfSupabaseError(supabaseError) {
  if (supabaseError) throw supabaseError;
}

export const seasonRepository = {
  /** @param {number} mediaIdentifier @returns {Promise<Season[]>} */
  async getByMediaId(mediaIdentifier) {
    const { data: seasonRows, error: supabaseError } = await supabaseClient
      .from("seasons")
      .select("*")
      .eq("media_id", mediaIdentifier)
      .order("season_number", { ascending: true });
    throwIfSupabaseError(supabaseError);
    return seasonRows;
  },

  /** @param {number} seasonIdentifier @returns {Promise<Season | null>} */
  async getById(seasonIdentifier) {
    const { data: seasonRow, error: supabaseError } = await supabaseClient
      .from("seasons")
      .select("*")
      .eq("id", seasonIdentifier)
      .maybeSingle();
    throwIfSupabaseError(supabaseError);
    return seasonRow;
  },

  /** @param {SeasonInsert} seasonToCreate @returns {Promise<Season>} */
  async create(seasonToCreate) {
    const { data: createdSeasonRow, error: supabaseError } = await supabaseClient
      .from("seasons")
      .insert(seasonToCreate)
      .select()
      .single();
    throwIfSupabaseError(supabaseError);
    return createdSeasonRow;
  },

  /** @param {number} seasonIdentifier @param {SeasonUpdate} seasonChanges @returns {Promise<Season>} */
  async update(seasonIdentifier, seasonChanges) {
    const { data: updatedSeasonRow, error: supabaseError } = await supabaseClient
      .from("seasons")
      .update(seasonChanges)
      .eq("id", seasonIdentifier)
      .select()
      .single();
    throwIfSupabaseError(supabaseError);
    return updatedSeasonRow;
  },

  /** @param {number} mediaIdentifier @returns {Promise<void>} */
  async removeByMediaId(mediaIdentifier) {
    const { error: supabaseError } = await supabaseClient
      .from("seasons")
      .delete()
      .eq("media_id", mediaIdentifier);
    throwIfSupabaseError(supabaseError);
  },

  /** @param {number} seasonIdentifier @returns {Promise<void>} */
  async remove(seasonIdentifier) {
    const { error: supabaseError } = await supabaseClient
      .from("seasons")
      .delete()
      .eq("id", seasonIdentifier);
    throwIfSupabaseError(supabaseError);
  },
};
