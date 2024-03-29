import Navbar from './components/navigations/Navbar';
import Footer from './components/navigations/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <HomePage />
        <Footer />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <RegisterPage />
      </>
    )
  },
  {
    path: "/login",
    element: (
      <>
        <h1>login</h1>
      </>
    )
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
