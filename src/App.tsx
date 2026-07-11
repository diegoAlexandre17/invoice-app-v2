import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/shared/infrastructure/query/queryClient";
import Router from "./router/Router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={Router()} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
