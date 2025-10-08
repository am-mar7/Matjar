import axios from 'axios';
import  { useEffect, useState } from 'react'

export default function Favorites() {

  const [fav, setfav] = useState([])
  
  function checkUserToken() {
    // if not loggind
    if (!localStorage.getItem("userToken")) {
      return false;
    }
    return true;
  }
  function getFav(){
    if (!checkUserToken()) return;
    const userToken = localStorage.getItem("userToken") || "";
    axios.get('https://ecommerce.routemisr.com/api/v1/wishlist' , { headers: { token: userToken } })
    .then(({data}) =>{
        console.log(data);   
        setfav(data.data)
    })
    .catch((response) =>{
        console.log(response);        
    })
  }
  useEffect(() =>{
    getFav()
  } , [])
  return (
    <>
    </>
  )
}
