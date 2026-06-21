import { RouterProvider } from "react-router";
import Router from "./router/Router";

function App() {
  return <RouterProvider router={Router()} />;
}

export default App;
