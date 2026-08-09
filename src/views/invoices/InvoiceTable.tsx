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

  const { t } = useTranslation();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 400);

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
      accessorKey: "issueDate",
      header: t("invoices.createdAtDate"),
      cell: ({ row }) => <div>{row.getValue("issueDate") ?? "-"}</div>,
    },
    {
      accessorKey: "dueDate",
      header: t("invoices.dueDate"),
      cell: ({ row }) => <div>{row.getValue("dueDate") ?? "-"}</div>,
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
  ];

  return (
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
  );
};

export default InvoiceTable;
