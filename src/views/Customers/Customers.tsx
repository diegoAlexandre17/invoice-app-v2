import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ActionTable } from "@/components/shared/ActionTable";
import { FilePlus, SquarePen, Trash } from "lucide-react";
import type { Customer } from "@/features/customers/domain/entities/Customer";
import { useGetAllCustomers } from "@/features/customers/presentation/hooks/useGetAllCustomer";
import { CardsSectionGraphs } from "@/views/customers/CardsSectionGraphs";

const Customers = () => {
  const { t } = useTranslation();
  /* const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
    null,
  ); */

  const { data: customers = [], isLoading } = useGetAllCustomers();

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
        return <div>{row.getValue("phone") ?? "-"}</div>
      }
    },
    {
      accessorKey: "identification",
      header: t("customers.identification"),
      cell: ({ row }) => <div>{row.getValue("identification") ?? "-"}</div>
    },
    {
      accessorKey: "address",
      header: t("customers.address"),
      cell: ({ row }) => <div>{row.getValue("address") ?? "-"}</div>
    },
    /* {
      accessorKey: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <>
          <ActionTable
            icon={<SquarePen />}
            onClick={() => handleEditCustomer(row.original)}
            tooltipText={t("common.edit")}
          />
        </>
      ),
    }, */
  ];

  /* const handleOpenModal = (): void => {
    setIsOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsOpen(false);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsOpen(true);
  }; */

  return (
    <div className="flex flex-1 flex-col">
      {/* <CustomerModal
        isEdit={editingCustomer}
        isOpen={isOpen}
        onClose={handleCloseModal}
      /> */}
      <CardsSectionGraphs />
      <DataTable     
        columns={columns}
        data={customers}
        // isLoading={isLoading}
        /* actions={
          <Button onClick={handleOpenModal}>
            {t("customers.addCustomer")}
          </Button>
        } */
      />
    </div>
  );
};

export default Customers;
