"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mi App
        </Typography>
        <Box>
          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} href="/signin">Iniciar sesión</Button>
              <Button color="inherit" component={Link} href="/signup">Registrarse</Button>
            </>
          )}
          <Button color="inherit" component={Link} href="/dashboard">Dashboard</Button>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 