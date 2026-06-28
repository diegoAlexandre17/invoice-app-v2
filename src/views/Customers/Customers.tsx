import type { ColumnDef } from "@tanstack/react-table";
import type { ICustomers } from "./types";
import customers from "./customers.data";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { CardsSectionGraphs } from "./CardsSectionGraphs";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomerModal from "./CustomerModal";

const Customers = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
      accessorKey: "phone",
      header: t("customers.phone"),
    },
    {
      accessorKey: "identification",
      header: t("customers.identification"),
    },
    {
      accessorKey: "address",
      header: t("customers.address"),
    },
  ];

  const handleOpenModal = (): void => {
    setIsOpen(true);
  };

   const handleCloseModal = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      <CustomerModal isEdit={isEdit} isOpen={isOpen} onClose={handleCloseModal} />
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
