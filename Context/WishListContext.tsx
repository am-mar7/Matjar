import React, { createContext, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

type WishListContextType = {
  addToWishList: (userToken: string, productId: string) => void;
  removefromWishList: (userToken: string, productId: string) => void;
};

export const WishListContext = createContext<WishListContextType | undefined>(undefined);

export default function WishListContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  function sendAlert(message: string) {
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

  function addToWishList(userToken: string, productId: string) {
    axios
      .post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token: userToken } }
      )
      .then(() => {
        sendAlert(t("addedtofav"));
      })
      .catch((response) => {
        console.error(response);
      });
  }

  function removefromWishList(userToken: string, productId: string) {
    axios
      .delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        headers: { token: userToken },
      })
      .then(() => {
        sendAlert(t("rmfromfav"));
      })
      .catch((response) => {
        console.error(response);
      });
  }

  return (
    <WishListContext.Provider value={{ addToWishList, removefromWishList }}>
      {children}
    </WishListContext.Provider>
  );
}

// hook for easier use:
export function useWishList() {
  const context = useContext(WishListContext);
  if (!context)
    throw new Error("useWishList must be used within a WishListContextProvider");
  return context;
}
