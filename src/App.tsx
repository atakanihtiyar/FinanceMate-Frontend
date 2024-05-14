import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/register_pages/RegisterPage';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import { Footer, Navbar } from './components/parts/navigationMenus';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: (
      <>
        <Navbar />
        <RegisterPage />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <LoginPage />
        <Footer />
      </>
    ),
  },
]);

function App() {

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
