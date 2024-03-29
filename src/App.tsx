import Navbar from './components/navigations/Navbar';
import Footer from './components/navigations/Footer';
import HomePage from './pages/HomePage';

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
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
