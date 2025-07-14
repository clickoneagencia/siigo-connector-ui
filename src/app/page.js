"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay token en localStorage
    const token = localStorage.getItem("token");
    
    if (token) {
      // Si hay token, redirigir al dashboard
      router.push('/dashboard');
    } else {
      // Si no hay token, redirigir al signin
      router.push('/signin');
    }
  }, [router]);

  // Mostrar loading mientras redirige
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>Redirigiendo...</p>
    </div>
  );
}
