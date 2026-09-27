import DonutChart from "@/components/shared/charts/DonutChart";
import HorizontalBarChart, {
  type HorizontalBarDatum,
} from "@/components/shared/charts/HorizontalBarChart";
import StatListCard, {
  type StatListItem,
} from "@/components/shared/charts/StatListCard";
import { useGetInvoicesSummary } from "@/features/invoices/presentation/hooks/useGetInvoicesSummary";
import { format, subMonths } from "date-fns";
import { FileChartLine, FileExclamationPoint, FileX } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

interface InvoiceChartsProps {
  dateRange?: DateRange | undefined;
}

const InvoiceCharts = ({ dateRange }: InvoiceChartsProps) => {
  const { t, i18n } = useTranslation();

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

  // MOCK: todavia no hay endpoint de facturacion mensual. Cuando exista,
  // reemplazar por el hook de la feature (features/invoices/presentation/hooks).
  const MOCKED_MONTHLY_BILLING = [4200, 6850, 5400];

  const billingByMonthData: HorizontalBarDatum[] = MOCKED_MONTHLY_BILLING.map(
    (amount, index) => ({
      label: format(subMonths(new Date(), 2 - index), "MMM yyyy"),
      value: amount,
    }),
  );

  // DEMO: mes sin facturacion en medio de meses que si la tuvieron.
  const partialBillingData: HorizontalBarDatum[] = billingByMonthData.map(
    (month, index) => (index === 1 ? { ...month, value: 0 } : month),
  );

  const formatAmount = (value: number) =>
    `$${value.toLocaleString(i18n.language)}`;

  const totalsByStateData: StatListItem[] = [
    {
      id: "paid",
      icon: FileChartLine,
      label: t("invoices.graphs.totalPaid"),
      value: invoiceSummary?.totalPaid ?? 0,
      avatarFallbackClassName: "bg-success/10 text-success",
      valueClassName: "text-success",
    },
    {
      id: "pending",
      icon: FileExclamationPoint,
      label: t("invoices.states.sent"),
      value: invoiceSummary?.pendingAmount ?? 0,
      avatarFallbackClassName: "bg-warning/10 text-warning",
      valueClassName: "text-success",
    },
    {
      id: "overdue",
      icon: FileX,
      label: t("invoices.states.overdue"),
      value: invoiceSummary?.overdueAmount ?? 0,
      avatarFallbackClassName: "bg-destructive/10 text-destructive",
      valueClassName: "text-success",
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DonutChart
        title={t("invoices.graphs.invoicesByState")}
        data={invoicesStateData}
      />

      <StatListCard
        title={t("invoices.graphs.totalByState")}
        items={totalsByStateData}
      />

      <HorizontalBarChart
        title={t("invoices.graphs.billingLastMonths")}
        seriesName={t("invoices.graphs.billingLastMonths")}
        data={billingByMonthData}
        valueFormatter={formatAmount}
        showAxisValues={false}
      />

      {/* DEMO: misma grafica con un mes en cero entre meses con facturacion. */}
      <HorizontalBarChart
        title={t("invoices.graphs.billingLastMonths")}
        seriesName={t("invoices.graphs.billingLastMonths")}
        data={partialBillingData}
        valueFormatter={formatAmount}
        showAxisValues={false}
      />
    </div>
  );
};

export default InvoiceCharts;
