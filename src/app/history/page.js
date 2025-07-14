"use client";
import { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../auth-context";
import DataTable from "../components/DataTable";

export default function History() {
  const [history, setHistory] = useState({ items: [], total: 0, page: 1, page_size: 10, total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      console.log('Fetching history with page:', currentPage, 'rowsPerPage:', rowsPerPage);
      setLoading(true);
      setError("");
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/history?page=${currentPage}&page_size=${rowsPerPage}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("No se pudo obtener el historial");
        }
        const data = await res.json();
        console.log('History API response:', data);
        setHistory(data || { items: [], total: 0, page: 1, page_size: 10, total_pages: 0 });
      } catch (err) {
        setError(err.message || "Error al obtener el historial");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated, currentPage, rowsPerPage]);

  const handlePageChange = (newPage) => {
    console.log('History page change to:', newPage);
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    console.log('History rows per page change to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={8} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Historial
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Vista del historial de productos y operaciones.
          </Typography>
          <Box sx={{ mt: 4, textAlign: "left" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <DataTable
                data={history.items}
                loading={loading}
                error={error}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                totalCount={history.total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 