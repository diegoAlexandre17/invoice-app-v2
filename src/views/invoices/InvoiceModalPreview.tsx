import Loader from "@/components/shared/Loader";
import PDFViewer from "@/components/shared/PDFViewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateInvoice } from "@/features/invoices/presentation/hooks/useCreateInvoice";
import InvoicePDF, { type InvoicePDFProps } from "@/views/invoices/InvoicePDF";
import { usePDF } from "@react-pdf/renderer";
import { useQueryClient } from "@tanstack/react-query";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface InvoiceModalPreviewProps extends InvoicePDFProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetInvoiceForm: () => void;
}

const InvoiceModalPreview = ({
  open,
  onOpenChange,
  company,
  invoiceData,
  currencySymbol,
  resetInvoiceForm,
}: InvoiceModalPreviewProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const createInvoice = useCreateInvoice();

  // El Blob se genera acá: la modal lo necesita para DOS cosas — mostrarlo en el
  // PDFViewer y (al implementar el guardado) subirlo a Storage.
  const [instance] = usePDF({
    document: (
      <InvoicePDF
        company={company}
        invoiceData={invoiceData}
        currencySymbol={currencySymbol}
      />
    ),
  });

  const handleCreateInvoice = () => {
    if (!instance.blob) return;

    createInvoice.mutate(
      {
        invoiceData: { ...invoiceData, status: "sent" },
        //enviamos el status sent aca porque la modal es la que ejecura la accion de crear la factura.
        pdfBlob: instance.blob,
      },
      {
        onSuccess: () => {
          toast.success(t("common.success"), {
            description: t("invoices.createInvoiceSuccess"),
          });
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
          resetInvoiceForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(t("common.warning"), {
            description: t(error.message as ParseKeys),
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] grid-rows-[auto_1fr_auto]">
        <DialogHeader>
          <DialogTitle className="pr-8">
            {t("invoices.invoicePreview")}
          </DialogTitle>
        </DialogHeader>

        <div className=" overflow-auto">
          {instance.loading || !instance.blob ? (
            <Loader />
          ) : (
            <PDFViewer file={instance.blob} />
          )}
        </div>

        <DialogFooter>
          <Button
            variant={"destructive"}
            type="button"
            disabled={createInvoice.isPending}
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant={"success"}
            disabled={!instance.blob || createInvoice.isPending}
            onClick={handleCreateInvoice}
          >
            {t("invoices.createInvoice")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModalPreview;
