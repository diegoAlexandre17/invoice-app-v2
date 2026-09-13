import DonutChart from "@/components/shared/charts/DonutChart";
import { useGetInvoicesSummary } from "@/features/invoices/presentation/hooks/useGetInvoicesSummary";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

interface InvoiceChartsProps {
  dateRange?: DateRange | undefined;
}

const InvoiceCharts = ({ dateRange }: InvoiceChartsProps) => {
  const { t } = useTranslation();

  const { data: invoiceSummary } = useGetInvoicesSummary({
    dateFrom: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    dateTo: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  const invoicesStateData = [
    {
      label: t("invoices.states.paid"),
      value: invoiceSummary?.paidCount ?? 0,
      color: "#22c55e",
    },
    {
      label: t("invoices.states.sent"),
      value: invoiceSummary?.pendingCount ?? 0,
      color: "#f59e0b",
    },
    {
      label: t("invoices.states.overdue"),
      value: invoiceSummary?.overdueCount ?? 0,
      color: "#ef4444",
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DonutChart
        title={t("invoices.graphs.invoicesByState")}
        data={invoicesStateData}
      />
    </div>
  );
};

export default InvoiceCharts;
