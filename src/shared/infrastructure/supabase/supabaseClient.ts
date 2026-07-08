import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase.
 *
 * ⚠️ ESTE ES EL ÚNICO LUGAR DE TODA LA APP QUE CONOCE SUPABASE.
 *
 * ¿Por qué está aislado acá? Porque Supabase es "momentáneo". El día que
 * migres a tu backend propio, vas a reemplazar las implementaciones que usan
 * este cliente (los repositorios en cada feature/infrastructure) y este archivo
 * puede desaparecer. Ningún componente ni caso de uso importa esto directamente:
 * solo lo hacen los repositorios de infraestructura.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Revisá tu archivo .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
