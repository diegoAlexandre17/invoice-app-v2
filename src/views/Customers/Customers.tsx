import type { ColumnDef } from "@tanstack/react-table";
import type { ICustomers } from "./types";
import customers from "./customers.data";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { CardsSectionGraphs } from "./CardsSectionGraphs";

const Customers = () => {
  // const data = await getCustomers();

  const columns: ColumnDef<ICustomers>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "identification",
      header: "Identification",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
  ];

  return (
    <>
      <CardsSectionGraphs />
      <DataTable
        columns={columns}
        data={customers}
        actions={<Button>Add Customer</Button>}
      />
    </>
  );
};

export default Customers;
