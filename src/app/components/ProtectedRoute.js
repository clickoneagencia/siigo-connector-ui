"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../auth-context";
import { Box, CircularProgress, Alert } from "@mui/material";

const PUBLIC_ROUTES = ["/signin", "/signup"];

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute state:', { isLoading, isAuthenticated, pathname, hasRedirected });
    
    // Solo verificar si no está cargando y no es una ruta pública
    if (!isLoading && !PUBLIC_ROUTES.includes(pathname)) {
      // Verificar si hay token en localStorage
      const hasToken = localStorage.getItem("token");
      
      console.log('Token check:', { hasToken, isAuthenticated });
      
      if (!hasToken && !hasRedirected) {
        console.log('No token found, showing warning and redirecting');
        setShowWarning(true);
        setHasRedirected(true);
        // Mostrar warning por 2 segundos antes de redirigir
        setTimeout(() => {
          console.log('Redirecting to /signin');
          // Usar window.location para asegurar la redirección
          window.location.href = "/signin";
        }, 2000);
      }
    }
  }, [isLoading, isAuthenticated, pathname, hasRedirected]);

  // Si es una ruta pública, mostrar contenido directamente
  if (PUBLIC_ROUTES.includes(pathname)) {
    return children;
  }

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar warning si no está autenticado
  if (showWarning) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        flexDirection: "column",
        gap: 2
      }}>
        <Alert severity="warning" sx={{ maxWidth: 400 }}>
          No tienes acceso a esta página. Redirigiendo al inicio de sesión...
        </Alert>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return children;
} 