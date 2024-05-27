import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/register_pages/RegisterPage';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import { Footer, Navbar } from './components/parts/navigationMenus';
import DashboardPage from './pages/DashboardPage';
import { ThemeProvider } from './components/theme-provider';

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
  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <DashboardPage />
        <Footer />
      </>
    ),
  },
]);

function App() {

  return (
    <ThemeProvider defaultTheme="system" storageKey='ui-theme'>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
