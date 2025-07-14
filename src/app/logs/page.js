"use client";
import { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../auth-context";
import LogsTable from "../components/LogsTable";

const DEFAULT_ORDER_BY = "timestamp";
const DEFAULT_ORDER = "desc";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      console.log('Fetching logs with page:', currentPage, 'rowsPerPage:', rowsPerPage, 'orderBy:', orderBy, 'order:', order);
      setLoading(true);
      setError("");
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");
        const offset = (currentPage - 1) * rowsPerPage;
        const res = await fetch(`${API_URL}/api/logs?limit=${rowsPerPage}&offset=${offset}&order_by=${orderBy}&order=${order}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("No se pudieron obtener los logs");
        }
        const data = await res.json();
        console.log('Logs API response:', data);
        setLogs(data.logs || []);
        // Buscar el total en diferentes campos posibles de la API
        let newTotal = data.total || data.count || data.total_count || data.total_records || (data.logs ? data.logs.length : 0);
        // Asegurar que sea un número válido
        newTotal = typeof newTotal === 'number' && !isNaN(newTotal) ? newTotal : 0;
        console.log('Setting total to:', newTotal, 'from data:', data);
        setTotal(newTotal);
      } catch (err) {
        setError(err.message || "Error al obtener los logs");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated, currentPage, rowsPerPage, orderBy, order]);

  const handlePageChange = (newPage) => {
    console.log('Logs page change to:', newPage);
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    console.log('Logs rows per page change to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  if (!isAuthenticated) {
    return null;
  }

  console.log('LogsPage render props:', { currentPage, rowsPerPage, total, logsLength: logs.length });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={8} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Logs del sistema
          </Typography>
          {loading && logs.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <LogsTable
              data={logs}
              loading={loading}
              error={error}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              totalCount={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              orderBy={orderBy}
              order={order}
              onRequestSort={handleRequestSort}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
} 