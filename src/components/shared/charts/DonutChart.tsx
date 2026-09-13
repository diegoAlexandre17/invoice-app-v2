import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LABEL_COLOR = "#18181b";
const MUTED_COLOR = "#71717a";

interface DonutSegment {
  /** Segment label shown in the legend. */
  label: string;
  /** Numeric value of the segment. */
  value: number;
  /** Segment color. */
  color: string;
}

interface DonutChartProps {
  /** Segments to render (e.g. paid vs pending). */
  data: DonutSegment[];
  /** Card title. */
  title?: string;
  /** Card description shown under the title. */
  description?: string;
  /** Extra classes for the wrapping Card. */
  className?: string;
  /** Chart height in px. Keep it small so the card stays short. Defaults to 200. */
  height?: number;
  /** Label shown under the total in the donut center. Defaults to "Total". */
  totalLabel?: string;
}

const DonutChart = ({
  data,
  title,
  description,
  className,
  height = 120,
  totalLabel = "Total",
}: DonutChartProps) => {
  const series = useMemo(() => data.map((d) => d.value), [data]);

  const chartOptions = useMemo<ApexOptions>(() => {
    return {
      chart: {
        type: "donut",
        fontFamily: "inherit",
        background: "transparent",
      },
      labels: data.map((d) => d.label),
      colors: data.map((d) => d.color),
      stroke: { width: 0 },
      legend: {
        position: "right",
        horizontalAlign: "left",
        offsetX: 10,
        fontSize: "13px",
        labels: { colors: LABEL_COLOR },
        markers: { size: 6 },
        itemMargin: { horizontal: 4, vertical: 2 },
        formatter: (legendLabel, opts) => {
          const count = opts?.w.globals.series[opts.seriesIndex] ?? "";
          return `${legendLabel}: ${count}`;
        },
      },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              name: {
                fontSize: "13px",
                color: MUTED_COLOR,
                offsetY: 20,
              },
              value: {
                fontSize: "22px",
                fontWeight: 600,
                color: LABEL_COLOR,
                offsetY: -16,
                formatter: (val: string) => `${val}`,
              },
              total: {
                show: true,
                label: totalLabel,
                color: MUTED_COLOR,
                fontSize: "13px",
                formatter: (w) =>
                  `${w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  )}`,
              },
            },
          },
        },
      },
      tooltip: {
        theme: "light",
      },
    };
  }, [data, totalLabel]);

  return (
    <Card className={cn("w-full gap-0", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ReactApexChart
          type="donut"
          series={series}
          options={chartOptions}
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default DonutChart;
