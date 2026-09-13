import DonutChart from "@/components/shared/charts/DonutChart";

// TODO(temporal): valores hardcodeados solo para previsualizar el chart.
// Reemplazar por datos reales vía un hook de feature (presentation/hooks).
const InvoiceCharts = () => {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DonutChart
        title="Invoice status"
        // description="Paid vs pending"
        data={[
          { label: "Paid", value: 83, color: "#22c55e" },
          { label: "Pending", value: 46, color: "#f59e0b" },
          { label: "Overdue", value: 12, color: "#ef4444" },
        ]}
      />
    </div>
  );
};

export default InvoiceCharts;
