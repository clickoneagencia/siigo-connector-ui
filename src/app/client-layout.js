"use client";
import Navbar from "./navbar";
import Footer from "./footer";
import { AuthProvider, useAuth } from "./auth-context";

function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
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