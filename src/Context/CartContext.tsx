import React, { createContext, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";

type CartContextType = {
    addToCart: (productId:string) => Promise<void>,
}

export const CartContext = createContext<CartContextType | undefined>(undefined)
export default function CartContextProvider({children}:{children:React.ReactNode}) {
  const {t} = useTranslation()
  // const navigate = useNavigate() why can i use 

  async function addToCart(productId: string): Promise<void> {
    const userToken = localStorage.getItem("userToken") || "";
  
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        { headers: { token: userToken } }
      );
      sendAlert(`${t("addedtocart")}`);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  function sendAlert(message: string):void {
    const Toast = Swal.mixin({
      toast: true,
      position: `${document.body.dir === "ltr" ? "top-start" : "top-end"}`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: message,
    });
  }

  return (
    <CartContext.Provider value={{addToCart}}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(){
  const context = useContext(CartContext)
  if (!context)
    throw new Error("useCart must be used within a CartContextProvider");
  return context;
}
