import React from 'react'
import Login from './Login';
type ProtectedRouteProps = {
    children : React.ReactNode
}

export default function ProtectedRoute({children}:ProtectedRouteProps) {

  if(! localStorage.getItem('userToken')){
    return <Login></Login>
  }    
    
  return (
    <>{children}</>
  )
}
