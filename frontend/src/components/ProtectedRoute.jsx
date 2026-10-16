
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "token" || event.key === null) {
        setToken(localStorage.getItem("token"));
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
