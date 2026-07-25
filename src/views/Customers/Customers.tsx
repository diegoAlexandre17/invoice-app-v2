import { ActionTable } from "@/components/shared/ActionTable";
import { DataTable } from "@/components/shared/DataTable";
import SweetModal from "@/components/shared/SweetAlert";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/features/customers/domain/entities/Customer";
import { useDeleteCustomer } from "@/features/customers/presentation/hooks/useDeleteCustomer";
import { useGetAllCustomers } from "@/features/customers/presentation/hooks/useGetAllCustomer";
import { useDebounce } from "@/hooks/useDebounce";
import { CardsSectionGraphs } from "@/views/customers/CardsSectionGraphs";
import CustomerModal from "@/views/customers/CustomerModal";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const Customers = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);

  const deleteCustomer = useDeleteCustomer();

  const { data, isLoading } = useGetAllCustomers({
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
  });

  const customers = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(total / PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: t("customers.customerName"),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: t("customers.phone"),
      cell: ({ row }) => {
        return <div>{row.getValue("phone") ?? "-"}</div>;
      },
    },
    {
      accessorKey: "identification",
      header: t("customers.identification"),
      cell: ({ row }) => <div>{row.getValue("identification") ?? "-"}</div>,
    },
    {
      accessorKey: "address",
      header: t("customers.address"),
      cell: ({ row }) => <div>{row.getValue("address") ?? "-"}</div>,
    },
    {
      accessorKey: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <>
          <ActionTable
            icon={<SquarePen />}
            onClick={() => handleEditCustomer(row.original)}
            tooltipText={t("common.edit")}
          />

          <ActionTable
            icon={<Trash2 />}
            onClick={() => handleDeleteCustomer(row.original.id)}
            tooltipText={t("common.delete")}
            loading={deleteCustomer.isPending}
          />
        </>
      ),
    },
  ];

  const handleOpenModal = (): void => {
    setIsOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsOpen(false);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsOpen(true);
  };

  const handleDeleteCustomer = (id: number) => {
    SweetModal(
      "warning",
      t("common.warning"),
      t("customers.deleteCustomerConfirm"),
      t("common.delete"),
      (result) => {
        if (result?.isConfirmed) {
          deleteCustomer.mutate(id, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["customers"] });
              toast.success(t("common.success"), {
                description: t("customers.deleteCustomerSuccess"),
              });
            },
          });
        }
      },
      { showCancelButton: true, cancelButtonText: t("common.cancel") },
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <CustomerModal
        isEditData={editingCustomer}
        isOpen={isOpen}
        onClose={handleCloseModal}
      />
      <CardsSectionGraphs />
      <DataTable
        columns={columns}
        data={customers}
        searchValue={search}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        actions={
          <Button onClick={handleOpenModal}>
            {t("customers.addCustomer")}
          </Button>
        }
      />
    </div>
  );
};

export default Customers;
