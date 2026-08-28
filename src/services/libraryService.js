import { mediaRepository } from "../repositories/mediaRepository.js";

/**
 * Receives only the values needed from an external catalog and creates the
 * database insert payload inside the persistence boundary.
 */
export async function adicionarItemTmdbBiblioteca({
  identificadorTmdb,
  tipoMidia,
  tituloMidia,
  caminhoPoster,
  descricaoMidia,
  temporadasTmdb = [],
  episodiosTmdb = [],
  duracaoTmdb,
  statusMidia,
}) {
  const midiaExistente = await mediaRepository.obterPorIdentificadorETipoTmdb(
    identificadorTmdb,
    tipoMidia,
  );

  if (midiaExistente) {
    return { midia: midiaExistente, foiCriada: false };
  }

  const midiaParaCriar = {
    tmdb_id: identificadorTmdb,
    type: tipoMidia,
    titulo: tituloMidia,
    caminho_poster: caminhoPoster,
    descricao: descricaoMidia,
    duracao: duracaoTmdb,
    status: statusMidia,
  };
  const midiaCriada = tipoMidia === "tv"
    ? await mediaRepository.criarSerie(midiaParaCriar, temporadasTmdb, episodiosTmdb)
    : await mediaRepository.criar(midiaParaCriar);

  return { midia: midiaCriada, foiCriada: true };
}
