import { mediaRepository } from "../repositories/mediaRepository.js";

/**
 * Receives only the values needed from an external catalog and creates the
 * database insert payload inside the persistence boundary.
 */
export async function addTmdbItemToLibrary({
  tmdbItemIdentifier,
  tmdbMediaType,
  tmdbItemTitle,
  tmdbPosterPath,
}) {
  const existingMedia = await mediaRepository.getByTmdbIdentifierAndType(
    tmdbItemIdentifier,
    tmdbMediaType,
  );

  if (existingMedia) {
    return { media: existingMedia, wasCreated: false };
  }

  const createdMedia = await mediaRepository.create({
    tmdb_id: tmdbItemIdentifier,
    type: tmdbMediaType,
    title: tmdbItemTitle,
    poster_path: tmdbPosterPath,
  });

  return { media: createdMedia, wasCreated: true };
}
