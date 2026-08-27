import { supabaseClient } from "../lib/supabaseClient.js";

/** @typedef {import("../types/database.types").Episode} Episode */
/** @typedef {import("../types/database.types").EpisodeInsert} EpisodeInsert */
/** @typedef {import("../types/database.types").EpisodeUpdate} EpisodeUpdate */

function throwIfSupabaseError(supabaseError) {
  if (supabaseError) throw supabaseError;
}

export const episodeRepository = {
  /** @param {number} seasonIdentifier @returns {Promise<Episode[]>} */
  async getBySeasonId(seasonIdentifier) {
    const { data: episodeRows, error: supabaseError } = await supabaseClient
      .from("episodes")
      .select("*")
      .eq("season_id", seasonIdentifier)
      .order("episode_number", { ascending: true });
    throwIfSupabaseError(supabaseError);
    return episodeRows;
  },

  /** @param {number} episodeIdentifier @returns {Promise<Episode | null>} */
  async getById(episodeIdentifier) {
    const { data: episodeRow, error: supabaseError } = await supabaseClient
      .from("episodes")
      .select("*")
      .eq("id", episodeIdentifier)
      .maybeSingle();
    throwIfSupabaseError(supabaseError);
    return episodeRow;
  },

  /** @param {EpisodeInsert} episodeToCreate @returns {Promise<Episode>} */
  async create(episodeToCreate) {
    const { data: createdEpisodeRow, error: supabaseError } = await supabaseClient
      .from("episodes")
      .insert(episodeToCreate)
      .select()
      .single();
    throwIfSupabaseError(supabaseError);
    return createdEpisodeRow;
  },

  /** @param {number} episodeIdentifier @param {EpisodeUpdate} episodeChanges @returns {Promise<Episode>} */
  async update(episodeIdentifier, episodeChanges) {
    const { data: updatedEpisodeRow, error: supabaseError } = await supabaseClient
      .from("episodes")
      .update(episodeChanges)
      .eq("id", episodeIdentifier)
      .select()
      .single();
    throwIfSupabaseError(supabaseError);
    return updatedEpisodeRow;
  },

  /** @param {number} episodeIdentifier @returns {Promise<void>} */
  async remove(episodeIdentifier) {
    const { error: supabaseError } = await supabaseClient
      .from("episodes")
      .delete()
      .eq("id", episodeIdentifier);
    throwIfSupabaseError(supabaseError);
  },
};
