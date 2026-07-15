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
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <Card className={cn("flex-1", className)}>
      <CardHeader className="p-(--card-spacing)">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {search && (
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2 top-2 h-4 w-4 text-primary" />
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
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
