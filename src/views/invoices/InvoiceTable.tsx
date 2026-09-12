import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  canDelete,
  canTransition,
  isOverdue,
  type Invoice,
  type InvoiceStatus,
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
import {
  CircleCheck,
  CircleX,
  Download,
  FileSearch,
  Trash2,
} from "lucide-react";
import { useDownloadFile } from "@/hooks/useDownloadFile";
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
import { useUpdateInvoiceStatus } from "@/features/invoices/presentation/hooks/useUpdateInvoiceStatus";
import { type DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import DateRangePicker from "@/components/shared/DateRangePicker";

const PAGE_SIZE = 10;

const invoiceStateVariant: Record<
  InvoiceStatus,
  "default" | "success" | "warning" | "ghost"
> = {
  sent: "warning",
  paid: "success",
  cancelled: "ghost",
};

type StatusFilter = "all" | InvoiceStatus | "overdue";

const InvoiceTable = () => {
  const [search, setSearch] = useState<string>("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] =
    useState<StatusFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdfId, setLoadingPdfId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 400);
  const getSignedPdfUrl = useGetSignedPdfUrl();
  const { download } = useDownloadFile();
  const deleteInvoice = useDeleteInvoice();
  const queryClient = useQueryClient();

  // Si es "all" o "overdue", NO mando status. En cualquier otro caso, mando el valor.
  const statusParam =
    invoiceStatusFilter === "all" || invoiceStatusFilter === "overdue"
      ? undefined
      : invoiceStatusFilter;

  // overdue es true SOLO cuando el filtro es "overdue". Si no, undefined.
  const overdueParam = invoiceStatusFilter === "overdue" ? true : undefined;

  const { data, isLoading } = useGetAllInvoices({
    search: debouncedSearch,
    status: statusParam,
    overdue: overdueParam,
    dateFrom: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    dateTo: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const updateInvoiceStatus = useUpdateInvoiceStatus();

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

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (!invoice.pdfUrl) return;
    setDownloadingId(invoice.id);
    getSignedPdfUrl.mutate(invoice.pdfUrl, {
      onSuccess: async (url) => {
        try {
          await download(url, `${invoice.invoiceNumber}.pdf`);
        } catch {
          toast.error(t("common.warning"), {
            description: t("invoices.downloadInvoiceError"),
          });
        }
      },
      onError: (error) => {
        toast.error(t("common.warning"), {
          description: t(error.message as ParseKeys),
        });
      },
      onSettled: () => {
        setDownloadingId(null);
      },
    });
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
                description: t("invoices.deleteInvoiceSuccess"),
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

  const handleUpdateInvoiceStatus = (
    invoiceId: number,
    status: Exclude<InvoiceStatus, "sent">,
  ) => {
    const getMessages = (
      status: Exclude<InvoiceStatus, "sent">,
    ): { confirm: ParseKeys; success: ParseKeys } => {
      switch (status) {
        case "paid":
          return {
            confirm: "invoices.markAsPaidConfirm",
            success: "invoices.markAsPaidSuccess",
          };
        case "cancelled":
          return {
            confirm: "invoices.cancelInvoiceConfirm",
            success: "invoices.cancelInvoiceSuccess",
          };
      }
    };

    const { confirm, success } = getMessages(status);

    SweetModal(
      "warning",
      t("common.warning"),
      t(confirm),
      t("common.ok"),
      (result) => {
        if (result?.isConfirmed) {
          updateInvoiceStatus.mutate(
            { invoiceId, status },
            {
              onSuccess: () => {
                toast.success(t("common.success"), {
                  description: t(success),
                });
                queryClient.invalidateQueries({ queryKey: ["invoices"] });
              },
              onError: (error) => {
                toast.error(t("common.warning"), {
                  description: t(error.message as ParseKeys),
                });
              },
            },
          );
        }
      },
      { showCancelButton: true, cancelButtonText: t("common.cancel") },
    );
  };

  const handleViewPdf = (invoice: Invoice) => {
    if (!invoice.pdfUrl) return;
    setLoadingPdfId(invoice.id);
    getSignedPdfUrl.mutate(invoice.pdfUrl, {
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

        const isOverdueStatus = isOverdue(row.original);
        const badgeVariant = isOverdueStatus
          ? "destructive"
          : (invoiceStateVariant[invoiceStatus] ?? "default");
        const badgeText = isOverdueStatus
          ? t("invoices.states.overdue")
          : (t(`invoices.states.${invoiceStatus}`) ?? "-");

        return <Badge variant={badgeVariant}>{badgeText}</Badge>;
      },
    },
    {
      accessorKey: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <>
          {row.original.pdfUrl ? (
            <>
              <ActionTable
                icon={<FileSearch />}
                loading={loadingPdfId === row.original.id}
                disabled={getSignedPdfUrl.isPending}
                onClick={() => {
                  handleViewPdf(row.original);
                }}
                tooltipText={t("invoices.viewInvoice")}
              />

              <ActionTable
                icon={<Download />}
                loading={downloadingId === row.original.id}
                disabled={getSignedPdfUrl.isPending}
                onClick={() => handleDownloadInvoice(row.original)}
                tooltipText={t("invoices.downloadInvoice")}
              />
            </>
          ) : (
            ""
          )}

          {canDelete(row.original) && (
            <ActionTable
              icon={<Trash2 />}
              onClick={() => handleDeleteInvoice(row.original.id)}
              tooltipText={t("invoices.deleteInvoice")}
            />
          )}

          {canTransition(row.original.status, "paid") && (
            <ActionTable
              icon={<CircleCheck />}
              onClick={() => {
                handleUpdateInvoiceStatus(row.original.id, "paid");
              }}
              tooltipText={t("invoices.markAsPaid")}
            />
          )}

          {canTransition(row.original.status, "cancelled") && (
            <ActionTable
              icon={<CircleX />}
              onClick={() => {
                handleUpdateInvoiceStatus(row.original.id, "cancelled");
              }}
              tooltipText={t("invoices.cancelInvoice")}
            />
          )}
        </>
      ),
    },
  ];

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  };

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
          <div className="flex flex-col gap-2 @lg:flex-row @lg:flex-wrap">
            <Select
              value={invoiceStatusFilter}
              onValueChange={(value: StatusFilter) =>
                setInvoiceStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full @lg:w-auto @lg:flex-1 @lg:min-w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">{t("invoices.all")}</SelectItem>
                <SelectItem value="sent">
                  {t("invoices.states.sent")}
                </SelectItem>
                <SelectItem value="paid">
                  {t("invoices.states.paid")}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t("invoices.states.cancelled")}
                </SelectItem>
                <SelectItem value="overdue">
                  {t("invoices.states.overdue")}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="w-full @lg:flex-1 @lg:min-w-56">
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>
            <Button
              className="w-full @lg:w-auto @lg:flex-1 @lg:min-w-32"
              onClick={handleNavigateToCreateInvoice}
            >
              {t("invoices.createInvoice")}
            </Button>
          </div>
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
