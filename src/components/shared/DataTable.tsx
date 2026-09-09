import type { JSX } from "react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: JSX.Element;
  className?: string;
  isLoading?: boolean;
  /** Página actual (1-based). */
  page?: number;
  /** Cantidad total de páginas. */
  pageCount?: number;
  /** Se dispara al pedir otra página. */
  onPageChange?: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search = true,
  searchValue,
  onSearchChange,
  actions,
  className,
  isLoading = false,
  page = 1,
  pageCount = 1,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Paginación manual: los datos ya vienen paginados desde el server,
    // la tabla solo dibuja la página actual.
    manualPagination: true,
    pageCount,
  });

  const canPrev = page > 1;
  const canNext = page < pageCount;

  const handlePageChange = (nextPage: number) => {  //nextPage pagina donde se quiere ir
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return; //si es la primera, si es la ultima, o si es la page en la que estamos
    onPageChange?.(nextPage);
  };

  // Ventana de páginas a mostrar: la actual y una vecina de cada lado.
  // Evita renderizar 500 botones cuando hay muchas páginas.
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <Card className={cn("flex-1 gap-0 pt-0", className)}>
      <CardHeader className="px-4 py-3">
        <div className="@container">
          <div className="flex flex-col gap-2 @4xl:flex-row @4xl:items-center @4xl:justify-between">
            {search && (
              <div className="relative w-full @4xl:w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary" />
                <Input
                  placeholder={t("common.search")}
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            )}

            {actions && actions}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-0">
       
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton rows: mantienen el layout estable mientras carga,
                // en vez de un vacío o un spinner que hace saltar la tabla.
                Array.from({ length: 8 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        
      </CardContent>

      {pageCount >= 1 && (
        <CardFooter className="flex justify-end px-4 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={cn(
                    "cursor-pointer",
                    !canPrev && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>

              {pageNumbers.map((pageNumber, index) => {
                const prevPageNumber = pageNumbers[index - 1];
                const needsEllipsis =
                  prevPageNumber !== undefined &&
                  pageNumber - prevPageNumber > 1;

                return (
                  <div key={pageNumber} className="flex items-center">
                    {needsEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={pageNumber === page}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={cn(
                    "cursor-pointer",
                    !canNext && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
