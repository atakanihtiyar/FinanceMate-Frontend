import { NavigationWrapper } from './components/navigations/navigationUtils';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: NavigationWrapper(<HomePage />),
  },
  {
    path: "/register",
    element: NavigationWrapper(<RegisterPage />),
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
