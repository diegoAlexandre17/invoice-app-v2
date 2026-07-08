import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/shared/infrastructure/query/queryClient";
import Router from "./router/Router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={Router()} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
