import { useEffect, useState } from "react";

/**
 * Devuelve una versión "retrasada" del valor: solo se actualiza cuando
 * pasan `delay` ms sin que el valor original cambie.
 *
 * Uso típico: buscadores server-side. Evita disparar un request por cada
 * tecla; espera a que el usuario deje de escribir.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Si `value` cambia antes de que expire, se cancela el timer anterior
    // y se reinicia la cuenta. Ese es el corazón del debounce.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
