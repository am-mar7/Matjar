import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Cart from "./Components/Cart";
import UserContextProvider from "./Context/UserContext.tsx";
import Products from "./Components/Products.tsx";
import About from "./Components/About.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Components/Login.tsx";
import SignUp from "./Components/SignUp.tsx";
import Profile from "./Components/Profile.tsx";
import Favorites from "./Components/Favorites.tsx";
import ResetPassword from "./Components/ResetPassword.tsx";
import ResetPasswordForm from "./Components/ResetPasswordForm.tsx";
import ProductDetails from "./Components/ProductDetails.tsx";
import WishListContextProvider from "./Context/WishListContext.tsx";
import CartContextProvider from "./Context/CartContext.tsx";
import Orders from "./Components/Orders.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import NotFound from "./Components/NotFound.tsx";
import AdminProtectRoute from "./Components/Admin/AdminProtectRoute.tsx";
import Dashboard from "./Components/Admin/Dashboard.tsx";
import AdminLayout from "./Components/Admin/AdminLayout.tsx";
import AdminOrders from "./Components/Admin/AdminOrders.tsx";
import Users from "./Components/Admin/Users.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrderDetails from "./Components/Admin/OrderDetails.tsx";
import UserDetails from "./Components/Admin/UserDetails.tsx";

const route = createBrowserRouter(
  [
    {
      path: "",
      element: <Layout></Layout>,
      children: [
        { path: "", element: <Home /> },
        { path: "cart", element: <Cart /> },
        { path: "products", element: <Products /> },
        { path: "about", element: <About /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <SignUp /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              {" "}
              <Profile />{" "}
            </ProtectedRoute>
          ),
        },
        { path: "favorites", element: <Favorites /> },
        { path: "resetPassword", element: <ResetPassword /> },
        { path: "resetPasswordForm", element: <ResetPasswordForm /> },
        { path: "productdetails/:category/:id", element: <ProductDetails /> },
        { path: "allorders", element: <Orders /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/Admin",
      element: (
        <AdminProtectRoute>
          <AdminLayout />
        </AdminProtectRoute>
      ),
      children: [
        { path: "", element: <Dashboard /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "users", element: <Users /> },
        { path: "orderdetails", element: <OrderDetails /> },
        { path: "userdetails", element: <UserDetails /> },
      ],
    },
  ],
  { basename: "/Matjar" }
);
const query = new QueryClient()
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language || "en";
    document.body.dir = lng.startsWith("ar") ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <QueryClientProvider client={query}>
      <CartContextProvider>
        <WishListContextProvider>
          <UserContextProvider>
            <RouterProvider router={route} />
          </UserContextProvider>
        </WishListContextProvider>
      </CartContextProvider>
    </QueryClientProvider>
  );
}

export default App;
