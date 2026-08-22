import Loader from "@/components/shared/Loader";
import PDFViewer from "@/components/shared/PDFViewer";
import type { Company } from "@/features/company/domain/entities/Company";
import type { Invoice } from "@/features/invoices/domain/entities/Invoice";
import InvoicePDF from "@/views/invoices/InvoicePDF";
import { usePDF } from "@react-pdf/renderer";

interface InvoicePDFPreviewProps {
  company: Omit<Company, "createdAt" | "currency" | "id">;
  invoiceData: Omit<Invoice, "createdAt" | "id" | "paidAt" | "pdfUrl" | "status">
}

/**
 * Envoltorio específico de la factura: genera el Blob del <InvoicePDF> y lo
 * delega al visualizador genérico. La factura sabe QUÉ documento generar;
 * PDFViewer sabe CÓMO mostrarlo.
 */
const InvoicePDFPreview = ({ company, invoiceData }: InvoicePDFPreviewProps) => {
  const [instance] = usePDF({ document: <InvoicePDF company={company} invoiceData={invoiceData} /> });

  if (instance.loading || !instance.blob) {
    return <Loader />;
  }

  return <PDFViewer file={instance.blob} />;
};

export default InvoicePDFPreview;
