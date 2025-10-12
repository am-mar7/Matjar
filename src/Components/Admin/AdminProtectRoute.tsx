import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function AdminProtectRoute({ children }: ProtectedRouteProps) {
  const role = localStorage.getItem('role')
  console.log(role);
    
if (role !== "admin" && role !== "user") {
  return <Navigate to="/login" replace />;
}

  if (role === "user") {
    return <Navigate to="/" replace />;
  }

  // only admin can pass
  return <>{children}</>;
}
