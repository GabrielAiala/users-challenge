import { createBrowserRouter } from "react-router-dom";

import Home from "./Home";
import NewUser from "./NewUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "novo",
    element: <NewUser />,
  },
  {
    path: "editar/:id",
    element: <NewUser />,
  }
]);

export default router;