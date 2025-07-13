"use client";
import { useEffect, useState } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Box, TableSortLabel, Chip } from "@mui/material";
import { useAuth } from "../auth-context";

const PAGE_SIZE = 20;
const DEFAULT_ORDER_BY = "timestamp";
const DEFAULT_ORDER = "desc";

function getLevelColor(level) {
  switch (level) {
    case "ERROR":
      return "error";
    case "WARNING":
      return "warning";
    case "INFO":
      return "info";
    case "DEBUG":
      return "default";
    case "SUCCESS":
      return "success";
    default:
      return "default";
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/logs?limit=${PAGE_SIZE}&offset=${offset}&order_by=${orderBy}&order=${order}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("No se pudieron obtener los logs");
        }
        const data = await res.json();
        setLogs(prev => offset === 0 ? (data.logs || []) : [...prev, ...(data.logs || [])]);
        setTotal(typeof data.total === 'number' ? data.total : 0);
      } catch (err) {
        setError(err.message || "Error al obtener los logs");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchLogs();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, offset, orderBy, order]);

  const handleLoadMore = () => {
    setOffset(prev => prev + PAGE_SIZE);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setOffset(0);
  };

  if (!isAuthenticated) {
    return null;
  }

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
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "id"}
                          direction={orderBy === "id" ? order : "asc"}
                          onClick={() => handleRequestSort("id")}
                        >
                          ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "timestamp"}
                          direction={orderBy === "timestamp" ? order : "asc"}
                          onClick={() => handleRequestSort("timestamp")}
                        >
                          Timestamp
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "level"}
                          direction={orderBy === "level" ? order : "asc"}
                          onClick={() => handleRequestSort("level")}
                        >
                          Nivel
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "logger_name"}
                          direction={orderBy === "logger_name" ? order : "asc"}
                          onClick={() => handleRequestSort("logger_name")}
                        >
                          Logger
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "message"}
                          direction={orderBy === "message" ? order : "asc"}
                          onClick={() => handleRequestSort("message")}
                        >
                          Mensaje
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Módulo</TableCell>
                      <TableCell>Función</TableCell>
                      <TableCell>Línea</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Chip label={log.level} color={getLevelColor(log.level)} size="small" />
                        </TableCell>
                        <TableCell>{log.logger_name}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell>{log.function}</TableCell>
                        <TableCell>{log.line_number}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {!loading && logs.length < total && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <button onClick={handleLoadMore} style={{ padding: '8px 24px', fontSize: 16, borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>
                    Cargar más
                  </button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 