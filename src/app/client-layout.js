"use client";
import Navbar from "./navbar";
import Footer from "./footer";
import { AuthProvider, useAuth } from "./auth-context";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <ProtectedRoute>
        {isAuthenticated && <Navbar />}
        {children}
      </ProtectedRoute>
      <Footer />
    </>
  );
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
} 