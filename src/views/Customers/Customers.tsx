import type { ColumnDef } from "@tanstack/react-table";
import type { ICustomers } from "./types";
import customers from "./customers.data";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";

/* async function getCustomers(): Promise<Customers[]> {
  return customers;
} */

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
    <div>
      <DataTable
        columns={columns}
        data={customers}
        actions={<Button>Add Customer</Button>}
      />
    </div>
  );
};

export default Customers;
