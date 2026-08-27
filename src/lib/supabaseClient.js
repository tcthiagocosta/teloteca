import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../config/supabase.js";

/** @typedef {import("../types/database.types").Database} Database */

const supabaseProjectUrl = SUPABASE_URL;
const supabaseAnonymousKey = SUPABASE_ANON_KEY;

if (
  supabaseProjectUrl === "COLE_A_URL_DO_SEU_PROJETO_SUPABASE_AQUI" ||
  supabaseAnonymousKey === "COLE_A_CHAVE_ANON_DO_SEU_PROJETO_SUPABASE_AQUI"
) {
  throw new Error(
    "Configure SUPABASE_URL and SUPABASE_ANON_KEY in src/config/supabase.js before starting the application.",
  );
}

/** @type {import("@supabase/supabase-js").SupabaseClient<Database>} */
export const supabaseClient = createClient(
  supabaseProjectUrl,
  supabaseAnonymousKey,
);
