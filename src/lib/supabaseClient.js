import { createClient } from "@supabase/supabase-js";
import { CHAVE_ANONIMA_SUPABASE, URL_SUPABASE } from "../config/supabase.js";

/** @typedef {import("../types/database.types").BancoDeDados} BancoDeDados */

const urlProjetoSupabase = URL_SUPABASE;
const chaveAnonimaSupabase = CHAVE_ANONIMA_SUPABASE;

if (
  urlProjetoSupabase === "COLE_A_URL_DO_SEU_PROJETO_SUPABASE_AQUI" ||
  chaveAnonimaSupabase === "COLE_A_CHAVE_ANON_DO_SEU_PROJETO_SUPABASE_AQUI"
) {
  throw new Error(
    "Configure SUPABASE_URL and SUPABASE_ANON_KEY in src/config/supabase.js before starting the application.",
  );
}

/** @type {import("@supabase/supabase-js").SupabaseClient<BancoDeDados>} */
export const clienteSupabase = createClient(
  urlProjetoSupabase,
  chaveAnonimaSupabase,
);
