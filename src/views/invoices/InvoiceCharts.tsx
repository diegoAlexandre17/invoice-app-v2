import DonutChart from "@/components/shared/charts/DonutChart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useGetInvoicesSummary } from "@/features/invoices/presentation/hooks/useGetInvoicesSummary";
import { format } from "date-fns";
import { FileChartLine, FileExclamationPoint } from "lucide-react";
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

      <Card>
        <CardContent className="flex justify-around h-full">
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Avatar className="size-18 after:border-0">
              <AvatarFallback className="bg-success/10 text-success">
                <FileChartLine className="size-10" />
              </AvatarFallback>
            </Avatar>
            <CardTitle>{t("invoices.graphs.totalPaid")}</CardTitle>
            <CardTitle className="font-semibold text-success">
              {invoiceSummary?.totalPaid ?? 0}
            </CardTitle>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Avatar className="size-18 after:border-0">
              <AvatarFallback className="bg-warning/10 text-warning">
                <FileExclamationPoint className="size-10" />
              </AvatarFallback>
            </Avatar>
            <CardTitle>{t("invoices.states.sent")}</CardTitle>
            <CardTitle className="font-semibold text-success">
              {invoiceSummary?.pendingAmount ?? 0}
            </CardTitle>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCharts;
