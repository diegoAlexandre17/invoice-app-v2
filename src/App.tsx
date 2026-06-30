import { RouterProvider } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import Router from "./router/Router";

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={Router()} />
    </TooltipProvider>
  );
}

export default App;
