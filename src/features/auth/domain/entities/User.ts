/**
 * ENTIDAD del dominio: User.
 *
 * Describe QUÉ es un usuario para TU negocio, con TUS nombres de campos.
 * NO tiene por qué coincidir con lo que devuelve Supabase (eso se traduce
 * en la capa de infraestructura). Si mañana cambiás de backend, esta entidad
 * sigue exactamente igual: el resto de la app depende de ESTO, no del backend.
 *
 * Regla: el domain NO importa nada de React, Supabase, ni librerías externas.
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Datos que necesita el negocio para iniciar sesión.
 */
export interface LoginCredentials {
  email: string;
  password: string;
  captchaToken: string;
}

// Register
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
