import type { ColumnDef } from "@tanstack/react-table";
import type { ICustomers } from "./types";
import customers from "./customers.data";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { CardsSectionGraphs } from "./CardsSectionGraphs";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomerModal from "./CustomerModal";
import { ActionTable } from "@/components/shared/ActionTable";
import { FilePlus, SquarePen, Trash } from "lucide-react";

const Customers = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<ICustomers | null>(
    null,
  );

  const columns: ColumnDef<ICustomers>[] = [
    {
      accessorKey: "name",
      header: t("customers.customerName"),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: t("customers.phone"),
      cell: ({ row }) => <div>{row.getValue("phone") ?? "-"}</div>
    },
    {
      header: t("customers.identification"),
      cell: ({ row }) => <div>{row.getValue("identification") ?? "-"}</div>
    },
    {
      header: t("customers.address"),
      cell: ({ row }) => <div>{row.getValue("address") ?? "-"}</div>
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

  const handleEditCustomer = (customer: ICustomers) => {
    setEditingCustomer(customer);
    setIsOpen(true);
  };

  return (
    <>
      <CustomerModal
        isEdit={editingCustomer}
        isOpen={isOpen}
        onClose={handleCloseModal}
      />
      <CardsSectionGraphs />
      <DataTable
        columns={columns}
        data={customers}
        actions={
          <Button onClick={handleOpenModal}>
            {t("customers.addCustomer")}
          </Button>
        }
      />
    </>
  );
};

export default Customers;
