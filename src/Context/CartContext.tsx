import React, { createContext, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";

type CartContextType = {
  addToCart: (productId: string) => Promise<void>;
  getLoggedUserCart: () => Promise<any>;
  updateCartItemCount: (productId: string, count: number) => Promise<any>;
  removeItemFromCart: (productId: string) => Promise<any>;
  createCheckoutSession:(id: string, shippingAddress: { details: string; phone: string; city: string })=> Promise<any>;
  createCashOrder : (id: string, shippingAddress: { details: string; phone: string; city: string })=> Promise<any>;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
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
      console.log("add to cart res", data);
    } catch (error) {
      console.error(error);
    }
  }
  // helper
  function sendAlert(message: string): void {
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
  async function getLoggedUserCart(): Promise<any> {
    const userToken = localStorage.getItem("userToken") || "";
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token: userToken } }
      );
      console.log("get cart res", data.data);
      return data.data;
    } catch (error) {
      console.error(error);
    }
  }
  async function updateCartItemCount(    
    productId: string,
    count: number
  ): Promise<any> {
    const userToken = localStorage.getItem("userToken") || "";
    try {
      const data = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        { headers: { token: userToken } }
      );
      console.log("update cart res", data?.data?.data);
      return data?.data?.data;
    } catch (error) {
      console.error(error);
    }
  }
  async function removeItemFromCart(productId: string) {
    const userToken = localStorage.getItem("userToken") || "";
    try {
      const data = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { headers: { token: userToken } }
      );
      console.log("rm item res", data?.data?.data);
      return data?.data?.data;
    } catch (error) {
      console.error(error);
    }
  }
  async function createCheckoutSession(

    id: string,
    shippingAddress: { details: string; phone: string; city: string }
  ): Promise<any> {
    const userToken = localStorage.getItem("userToken") || "";
    try {
      const base = window.location.origin
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${id}?url=${base}/Matjar`,
        { shippingAddress },
        { headers: { token: userToken } }
      );
  
      console.log("checkout session data", data);
      return data;
    } catch (error) {
      console.error("checkout session error", error);
      throw error; 
    }
  }  
  async function createCashOrder(
    id: string,
    shippingAddress: { details: string; phone: string; city: string }
  ): Promise<any> {
    const userToken = localStorage.getItem("userToken") || "";
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${id}`,
        { shippingAddress },
        { headers: { token: userToken } }
      );
  
      console.log("checkout session data", data);
      
      if (data?.status === "success") {
        sendAlert(t('orderPlaced'))
      return data;
    }
    } catch (error) {
      console.error("checkout session error", error);
      throw error; 
    }
  }  

  return (
    <CartContext.Provider
      value={{
        addToCart,
        getLoggedUserCart,
        removeItemFromCart,
        updateCartItemCount,
        createCheckoutSession,
        createCashOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartContextProvider");
  return context;
}
