import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

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
const GRID_COLOR = "#e4e4e7";
const IN_BAR_LABEL_COLOR = "#ffffff";
/**
 * Color por defecto de la serie: el `--primary` de la plataforma, que en modo
 * claro es `oklch(0.347 0.049 183)` (y coincide con `--chart-1`). Va en hex
 * porque ApexCharts manipula el color para hover y sombreados, y no parsea
 * `var()` ni `oklch()`. Si cambiás `--primary` en index.css, actualizá este hex.
 */
const DEFAULT_BAR_COLOR = "#16423c";
/** Alto que ocupa cada barra cuando no se pasa `height`. */
const ROW_HEIGHT = 40;
/** Alto extra reservado para la escala inferior cuando está visible. */
const AXIS_HEIGHT = 40;
/** Track de ancho completo que se dibuja detrás de cada barra. */
const TRACK_COLOR = "#eceef0";
/** Color de una barra en cero. 1.7:1 contra TRACK_COLOR. */
const ZERO_BAR_COLOR = "#b3b8c0";
/** Color del valor dentro de una barra en cero. 5.2:1 contra ZERO_BAR_COLOR. */
const ZERO_LABEL_COLOR = "#3f3f46";
/**
 * Ancho que se dibuja para una barra en cero, como fracción del máximo del eje.
 * Un cero real mide cero píxeles, así que necesita un stub para seguir siendo
 * legible — igual en todas las filas, porque todos los ceros son el mismo cero.
 * El número que se imprime encima sigue siendo el valor real.
 */
const ZERO_BAR_FILL = 0.16;
/** Filas que se dibujan cuando el dataset llega totalmente vacío (sin labels). */
const EMPTY_PLACEHOLDER_ROWS = 3;

export interface HorizontalBarDatum {
  /** Nombre de la categoría que se muestra en el eje izquierdo. */
  label: string;
  /** Magnitud numérica de la barra. */
  value: number;
  /**
   * Color propio de la barra. Usalo solo cuando cada barra es una ENTIDAD
   * distinta (identidad). Para una misma medida a lo largo del tiempo dejalo
   * sin definir para que todas compartan `color`: pintar por rango engaña.
   */
  color?: string;
}

interface HorizontalBarChartProps {
  /** Barras a renderizar, en orden de aparición (la primera va arriba). */
  data: HorizontalBarDatum[];
  /** Nombre de la serie. Identifica la medida graficada ante ApexCharts. */
  seriesName?: string;
  /** Título de la card. */
  title?: string;
  /** Descripción de la card, debajo del título. */
  description?: string;
  /** Clases extra para la Card que envuelve el gráfico. */
  className?: string;
  /** Clases extra para el CardHeader. */
  headerClassName?: string;
  /** Clases extra para el CardTitle. */
  titleClassName?: string;
  /** Clases extra para el CardContent. */
  contentClassName?: string;
  /**
   * Alto del gráfico en px. Por defecto es un slot de 40px por barra (más el
   * eje si está visible), así la card crece con los datos en vez de dejar
   * espacio muerto.
   */
  height?: number;
  /** Color que usan las barras que no definen el suyo. */
  color?: string;
  /** Grosor de la barra como porcentaje del slot disponible. Por defecto "60%". */
  barHeight?: string;
  /** Formatea el valor en el tooltip, el eje x y la etiqueta dentro de la barra. */
  valueFormatter?: (value: number) => string;
  /** Muestra el valor formateado dentro de cada barra. Por defecto true. */
  showValueInBar?: boolean;
  /**
   * Muestra la escala de valores en el eje inferior. Apagala para ganar alto
   * cuando los valores ya están etiquetados dentro de las barras. Por defecto
   * true.
   */
  showAxisValues?: boolean;
}

const HorizontalBarChart = ({
  data,
  seriesName,
  title,
  description,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  height,
  color = DEFAULT_BAR_COLOR,
  barHeight = "60%",
  valueFormatter,
  showValueInBar = true,
  showAxisValues = true,
}: HorizontalBarChartProps) => {
  // Sin filas no hay categorías que dibujar, así que sostenemos la forma del
  // gráfico con slots vacíos; si vienen filas en cero se usan tal cual, porque
  // sus labels son reales.
  const rows = useMemo<HorizontalBarDatum[]>(
    () =>
      data.length > 0
        ? data
        : Array.from({ length: EMPTY_PLACEHOLDER_ROWS }, () => ({
            label: "",
            value: 0,
          })),
    [data],
  );

  const maxValue = Math.max(0, ...rows.map((d) => d.value));
  // No hay estado vacío a nivel gráfico: cada fila es cero o es dato. Esto es
  // solo el fallback de escala para cuando TODAS son cero y Apex no tiene de
  // dónde derivar un máximo.
  const hasNoScale = maxValue === 0;
  const zeroStub = (hasNoScale ? 1 : maxValue) * ZERO_BAR_FILL;

  // El ancho de una barra en cero es ficticio; el número que se imprime encima
  // se lee siempre del dato original, nunca del valor ploteado.
  const series = useMemo(
    () => [
      {
        name: seriesName ?? "",
        data: rows.map((d) => (d.value === 0 ? zeroStub : d.value)),
      },
    ],
    [rows, seriesName, zeroStub],
  );

  const chartHeight =
    height ?? rows.length * ROW_HEIGHT + (showAxisValues ? AXIS_HEIGHT : 0);

  const formatValue = useMemo(
    () => valueFormatter ?? ((value: number) => `${value}`),
    [valueFormatter],
  );

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "bar",
        fontFamily: "inherit",
        background: "transparent",
        toolbar: { show: false },
        // Apex reserva 15px extra alrededor del plot por defecto; sin esto la
        // card queda más alta que el resto de la fila del grid.
        parentHeightOffset: 0,
      },
      // `distributed` es lo que permite pintar cada barra por separado; con un
      // solo color en el array todas quedan iguales (serie única).
      colors: rows.map((d) =>
        d.value === 0 ? ZERO_BAR_COLOR : (d.color ?? color),
      ),
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          barHeight,
          borderRadius: 4,
          borderRadiusApplication: "end",
          dataLabels: { position: "center" },
          // El track de fondo marca el 100% del eje, así que cada barra se lee
          // como proporción y no solo como un largo suelto.
          colors: {
            backgroundBarColors: rows.map(() => TRACK_COLOR),
            backgroundBarRadius: 4,
          },
        },
      },
      dataLabels: {
        enabled: showValueInBar,
        formatter: (val, opts) =>
          formatValue(rows[opts?.dataPointIndex ?? -1]?.value ?? Number(val)),
        style: {
          fontSize: "12px",
          fontWeight: 600,
          // Con `distributed` Apex indexa este array por dataPointIndex, así
          // que cada barra puede llevar su propio color de texto.
          colors: rows.map((d) =>
            d.value === 0 ? ZERO_LABEL_COLOR : IN_BAR_LABEL_COLOR,
          ),
        },
        dropShadow: { enabled: false },
      },
      legend: { show: false },
      xaxis: {
        categories: rows.map((d) => d.label),
        max: hasNoScale ? 1 : undefined,
        labels: {
          show: showAxisValues,
          style: { colors: MUTED_COLOR, fontSize: "12px" },
          formatter: (val) => formatValue(Number(val)),
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: LABEL_COLOR, fontSize: "13px", fontWeight: 500 },
        },
      },
      grid: {
        borderColor: GRID_COLOR,
        strokeDashArray: 4,
        // Sin escala abajo las líneas verticales no referencian nada, así que
        // acompañan a las labels del eje.
        xaxis: { lines: { show: showAxisValues } },
        yaxis: { lines: { show: false } },
        // Apex reserva el alto del eje aunque sus labels estén ocultas: el
        // padding negativo es lo que recupera ese espacio.
        padding: showAxisValues
          ? { top: 0, right: 8, bottom: 0, left: 8 }
          : { top: -12, right: 8, bottom: -16, left: 8 },
      },
      states: { active: { filter: { type: "none" } } },
      tooltip: {
        theme: "light",
        y: {
          // El header del tooltip ya muestra la categoría. El título de la fila
          // repetiría el nombre de la serie, que además es el mismo para todas
          // las barras: lo vaciamos y queda solo el valor.
          title: { formatter: () => "" },
          formatter: (val, opts) =>
            formatValue(rows[opts?.dataPointIndex ?? -1]?.value ?? Number(val)),
        },
      },
    }),
    [
      barHeight,
      color,
      formatValue,
      hasNoScale,
      rows,
      showAxisValues,
      showValueInBar,
    ],
  );

  // `Card` trae overflow-hidden: sin pisarlo el tooltip se corta apenas se
  // sale de los límites de la card.
  return (
    <Card className={cn("w-full gap-0 overflow-visible", className)}>
      {(title || description) && (
        <CardHeader className={headerClassName}>
          {title && <CardTitle className={titleClassName}>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        <ReactApexChart
          type="bar"
          series={series}
          options={chartOptions}
          height={chartHeight}
        />
      </CardContent>
    </Card>
  );
};

export default HorizontalBarChart;
