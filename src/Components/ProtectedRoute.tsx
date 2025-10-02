import React from 'react'
type ProtectedRouteProps = {
    chlidren : React.ReactNode
}
export default function ProtectedRoute({chlidren}:ProtectedRouteProps) {
  return (
    {chlidren}
  )
}
