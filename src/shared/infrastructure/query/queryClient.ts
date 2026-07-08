import { QueryClient } from "@tanstack/react-query";

/**
 * Instancia global de TanStack Query.
 *
 * Maneja el "server state": cache, loading, errores y revalidación de los
 * datos que vienen del backend. Vive en shared/ porque es transversal a
 * todos los features.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cuánto tiempo un dato se considera "fresco" antes de revalidar (5 min).
      staleTime: 1000 * 60 * 5,
      // Reintentos automáticos si una query falla.
      retry: 1,
      // No refetchear cada vez que la ventana recupera el foco (evita ruido).
      refetchOnWindowFocus: false,
    },
  },
});
