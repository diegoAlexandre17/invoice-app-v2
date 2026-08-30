import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  Invoice,
  InvoiceStatus,
} from "@/features/invoices/domain/entities/Invoice";
import { useGetAllInvoices } from "@/features/invoices/presentation/hooks/useGetAllInvoices";
import { useDebounce } from "@/hooks/useDebounce";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/router/paths";
import { useNavigate } from "react-router";
import { useFormatDate } from "@/hooks/useFormatDate";
import { ActionTable } from "@/components/shared/ActionTable";
import { FileSearch, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PDFViewer from "@/components/shared/PDFViewer";
import { useGetSignedPdfUrl } from "@/features/invoices/presentation/hooks/useGetSignedPdfUrl";
import { toast } from "sonner";
import type { ParseKeys } from "i18next";
import { useDeleteInvoice } from "@/features/invoices/presentation/hooks/useDeleteInvoice";
import { useQueryClient } from "@tanstack/react-query";
import SweetModal from "@/components/shared/SweetAlert";

const PAGE_SIZE = 10;

const invoiceStateVariant: Record<
  InvoiceStatus,
  "default" | "success" | "warning" | "destructive"
> = {
  sent: "warning",
  paid: "success",
  cancelled: "destructive",
};

const InvoiceTable = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdfId, setLoadingPdfId] = useState<number | null>(null);

  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 400);
  const getSignedPdfUrl = useGetSignedPdfUrl();
  const deleteInvoice = useDeleteInvoice();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllInvoices({
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
  });

  const invoices = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleNavigateToCreateInvoice = () => {
    navigate(PATHS.createInvoice);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    SweetModal(
      "warning",
      t("common.warning"),
      t("invoices.deleteInvoiceConfirm"),
      t("common.delete"),
      (result) => {
        if (result?.isConfirmed) {
          deleteInvoice.mutate(invoiceId, {
            onSuccess: () => {
              toast.success(t("common.success"), {
                description: t("invoices.createInvoiceSuccess"),
              });
              queryClient.invalidateQueries({ queryKey: ["invoices"] });
            },
            onError: (error) => {
              toast.error(t("common.warning"), {
                description: t(error.message as ParseKeys),
              });
            },
          });
        }
      },
      { showCancelButton: true, cancelButtonText: t("common.cancel") },
    );
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: t("invoices.invoiceNumber"),
    },
    {
      accessorKey: "clientName",
      header: t("customers.customerName"),
    },
    {
      accessorKey: "clientEmail",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      header: t("invoices.createdAtDate"),
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("createdAt")) ?? "-"}</div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: t("invoices.issueDate"),
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("issueDate")) ?? "-"}</div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: t("invoices.dueDate"),
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("dueDate")) ?? "-"}</div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: t("common.total"),
      cell: ({ row }) => <div>{row.getValue("totalAmount") ?? "-"}</div>,
    },
    {
      accessorKey: "status",
      header: t("common.state"),
      cell: ({ row }) => {
        const invoiceStatus = row.getValue("status") as InvoiceStatus;

        return (
          <Badge variant={invoiceStateVariant[invoiceStatus] ?? "default"}>
            {t(`invoices.states.${invoiceStatus}`) ?? "-"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <>
          {row.original.pdfUrl ? (
            <ActionTable
              icon={<FileSearch />}
              loading={loadingPdfId === row.original.id}
              disabled={getSignedPdfUrl.isPending}
              onClick={() => {
                if (!row.original.pdfUrl) return;
                setLoadingPdfId(row.original.id);
                getSignedPdfUrl.mutate(row.original.pdfUrl, {
                  onSuccess: (url) => {
                    setPdfUrl(url);
                    setIsOpen(true);
                  },
                  onError: (error) => {
                    toast.error(t("common.warning"), {
                      description: t(error.message as ParseKeys),
                    });
                  },
                  onSettled: () => {
                    setLoadingPdfId(null);
                  },
                });
              }}
              tooltipText={t("invoices.viewInvoice")}
            />
          ) : (
            ""
          )}

          <ActionTable
            icon={<Trash2 />}
            onClick={() => handleDeleteInvoice(row.original.id)}
            tooltipText={t("invoices.deleteInvoice")}
            // loading={deleteCustomer.isPending}
          />
        </>
      ),
    },
  ];

  console.log(invoices)

  return (
    <>
      <DataTable
        columns={columns}
        data={invoices}
        searchValue={search}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        actions={
          <Button onClick={handleNavigateToCreateInvoice}>
            {t("invoices.createInvoice")}
          </Button>
        }
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] grid-rows-[auto_1fr_auto]">
          <DialogHeader>
            <DialogTitle className="pr-8">
              {t("invoices.invoicePreview")}
            </DialogTitle>
          </DialogHeader>

          <div className=" overflow-auto">
            <PDFViewer file={pdfUrl ?? ""} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceTable;
