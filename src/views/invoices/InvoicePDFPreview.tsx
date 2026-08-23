import Loader from "@/components/shared/Loader";
import PDFViewer from "@/components/shared/PDFViewer";
import InvoicePDF, { type InvoicePDFProps } from "@/views/invoices/InvoicePDF";
import { usePDF } from "@react-pdf/renderer";

/**
 * Envoltorio específico de la factura: genera el Blob del <InvoicePDF> y lo
 * delega al visualizador genérico. La factura sabe QUÉ documento generar;
 * PDFViewer sabe CÓMO mostrarlo.
 *
 * Reusa InvoicePDFProps (fuente única de verdad) y hace spread {...props}: al
 * agregar una prop a InvoicePDF, este envoltorio no necesita cambios.
 */
const InvoicePDFPreview = (props: InvoicePDFProps) => {
  const [instance] = usePDF({ document: <InvoicePDF {...props} /> });

  if (instance.loading || !instance.blob) {
    return <Loader />;
  }

  return <PDFViewer file={instance.blob} />;
};

export default InvoicePDFPreview;
