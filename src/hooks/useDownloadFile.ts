import { useState } from "react";

/**
 * Descarga un archivo remoto forzando el guardado en disco con un nombre propio.
 *
 * Por qué fetch + Blob y no un <a href download>: el atributo `download` se
 * ignora en URLs cross-origin (Supabase Storage es otro origen), así que el
 * navegador abriría el PDF en vez de descargarlo. Al traerlo como Blob y crear
 * un object URL local (mismo origen), el `download` y el nombre de archivo se
 * respetan en todos los navegadores.
 */
export function useDownloadFile() {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const download = async (url: string, fileName: string): Promise<void> => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("download_failed");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      // Liberamos el object URL para no filtrar memoria.
      URL.revokeObjectURL(objectUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
}
