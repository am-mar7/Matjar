import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18next";
import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Cart from "./Components/Cart";
import UserContextProvider from '../Context/UserContext.tsx';
import Products from "./Components/Products.tsx";
import About from "./About.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Components/Login.tsx";
import SignUp from "./Components/SignUp.tsx";
import Profile from "./Components/Profile.tsx";
import Favorites from "./Components/Favorites.tsx";
import ResetPassword from "./Components/ResetPassword.tsx";
import ResetPasswordForm from "./Components/ResetPasswordForm.tsx";


const route = createBrowserRouter([
  {path:'' , element:<Layout></Layout> , children:[
    {path:'' , element : <Home/> },
    {path:'/cart' , element : <Cart/> },
    {path:'/products' , element : <Products/> },
    {path:'/about' , element : <About/> },
    {path:'/login' , element : <Login/> },
    {path:'/signup' , element : <SignUp/> },
    {path:'/profile' , element : <Profile/> },
    {path:'/favorites' , element : <Favorites/> },
    {path:'/resetPassword' , element : <ResetPassword/> },
    {path:'/resetPasswordForm' , element : <ResetPasswordForm/> },
  ]}
])

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language || "en";
    document.body.dir = lng.startsWith("ar") ? "rtl" : "ltr";
  }, [i18n.language]);



  return (
    <UserContextProvider>
      <RouterProvider router={route} />
    </UserContextProvider>

  );
}

export default App;
