import { supabaseClient } from "../lib/supabaseClient.js";

/** @typedef {import("../types/database.types").Media} Media */
/** @typedef {import("../types/database.types").MediaInsert} MediaInsert */
/** @typedef {import("../types/database.types").MediaUpdate} MediaUpdate */
/** @typedef {import("../types/database.types").MediaType} MediaType */

function throwIfSupabaseError(supabaseError) {
  if (supabaseError) throw supabaseError;
}

export const mediaRepository = {
  /** @returns {Promise<Media[]>} */
  async getAll() {
    const { data: mediaRows, error: supabaseError } = await supabaseClient
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    throwIfSupabaseError(supabaseError);
    return mediaRows;
  },

  /** @param {number} mediaIdentifier @returns {Promise<Media | null>} */
  async getById(mediaIdentifier) {
    const { data: mediaRow, error: supabaseError } = await supabaseClient
      .from("media")
      .select("*")
      .eq("id", mediaIdentifier)
      .maybeSingle();
    throwIfSupabaseError(supabaseError);
    return mediaRow;
  },

  /** @param {number} tmdbIdentifier @param {MediaType} mediaType @returns {Promise<Media | null>} */
  async getByTmdbIdentifierAndType(tmdbIdentifier, mediaType) {
    const { data: mediaRow, error: supabaseError } = await supabaseClient
      .from("media")
      .select("*")
      .eq("tmdb_id", tmdbIdentifier)
      .eq("type", mediaType)
      .maybeSingle();
    throwIfSupabaseError(supabaseError);
    return mediaRow;
  },

  /** @param {MediaInsert} mediaToCreate @returns {Promise<Media>} */
  async create(mediaToCreate) {
    const { data: createdMediaRow, error: supabaseError } = await supabaseClient
      .from("media")
      .insert(mediaToCreate)
      .select()
      .single();
    throwIfSupabaseError(supabaseError);
    return createdMediaRow;
  },

  /** @param {number} mediaIdentifier @param {MediaUpdate} mediaChanges @returns {Promise<Media>} */
  async update(mediaIdentifier, mediaChanges) {
    const { data: updatedMediaRow, error: supabaseError } = await supabaseClient
      .from("media")
      .update(mediaChanges)
      .eq("id", mediaIdentifier)
      .select()
      .single();
    throwIfSupabaseError(supabaseError);
    return updatedMediaRow;
  },

  /** @param {number} mediaIdentifier @returns {Promise<void>} */
  async remove(mediaIdentifier) {
    const { error: supabaseError } = await supabaseClient
      .from("media")
      .delete()
      .eq("id", mediaIdentifier);
    throwIfSupabaseError(supabaseError);
  },
};
