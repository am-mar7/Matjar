import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18next";
import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Cart from "./Components/Cart";

const route = createBrowserRouter([
  {path:'' , element:<Layout></Layout> , children:[
    {path:'' , element : <Home/> },
    {path:'/cart' , element : <Cart/> },
  ]}
])

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language || "en";
    document.body.dir = lng.startsWith("ar") ? "rtl" : "ltr";
  }, [i18n.language]);

  // const changeLanguage = (lng: string) => {
  //   i18n.changeLanguage(lng);
  // };

  return (
    <RouterProvider router={route} />
  );
}

export default App;
