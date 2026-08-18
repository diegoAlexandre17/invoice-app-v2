import Loader from "@/components/shared/Loader";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Worker de pdf.js resuelto vía Vite. Debe configurarse en el mismo módulo
// donde se usan los componentes de react-pdf.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewerProps {
  /** El PDF a mostrar: un Blob (recién generado) o una URL (ya guardado). */
  file: Blob | string;
  /** Ancho máximo en px de cada página. Por defecto se adapta al contenedor. */
  maxWidth?: number;
}

/**
 * Visualizador genérico de PDFs sobre <canvas> (sin iframe ni PDFViewer nativo).
 * No sabe NADA del contenido: recibe un PDF (Blob o URL) y lo dibuja página a
 * página, adaptando el ancho al contenedor (responsive dentro de modales).
 */
const PDFViewer = ({ file, maxWidth = 800 }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>();

  // Mide el contenedor y renderiza el PDF a ese ancho (con tope maxWidth),
  // restando el padding para que la página no toque los bordes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - 32; // p-4 = 16px por lado
      setPageWidth(Math.min(available, maxWidth));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [maxWidth]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-4 bg-muted/40 rounded-lg overflow-auto h-full"
    >
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<Loader />}
      >
        {pageWidth !== undefined &&
          Array.from({ length: numPages }, (_, index) => (
            <div
              key={`page_${index + 1}`}
              className="mb-4 rounded-md shadow-lg overflow-hidden bg-white"
            >
              <Page
                pageNumber={index + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
