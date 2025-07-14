"use client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box,
  Chip,
  TableSortLabel
} from "@mui/material";
import CustomPagination from "./CustomPagination";
import { 
  Error,
  Warning,
  Info,
  CheckCircle,
  BugReport
} from "@mui/icons-material";

const getLevelColor = (level) => {
  switch (level?.toUpperCase()) {
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
};

const getLevelIcon = (level) => {
  switch (level?.toUpperCase()) {
    case "ERROR":
      return <Error fontSize="small" />;
    case "WARNING":
      return <Warning fontSize="small" />;
    case "INFO":
      return <Info fontSize="small" />;
    case "DEBUG":
      return <BugReport fontSize="small" />;
    case "SUCCESS":
      return <CheckCircle fontSize="small" />;
    default:
      return <Info fontSize="small" />;
  }
};

export default function LogsTable({ 
  data, 
  loading, 
  error, 
  page, 
  rowsPerPage, 
  totalCount, 
  onPageChange, 
  onRowsPerPageChange,
  orderBy,
  order,
  onRequestSort
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  console.log('LogsTable props:', { page, rowsPerPage, totalCount, totalPages, calculation: `${totalCount} / ${rowsPerPage} = ${totalCount / rowsPerPage}` });
  const handleRequestSort = (property) => {
    onRequestSort(property);
  };

  if (loading && data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Cargando logs...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No hay logs disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                  sx={{ color: 'white' }}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                <TableSortLabel
                  active={orderBy === "timestamp"}
                  direction={orderBy === "timestamp" ? order : "asc"}
                  onClick={() => handleRequestSort("timestamp")}
                  sx={{ color: 'white' }}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                <TableSortLabel
                  active={orderBy === "level"}
                  direction={orderBy === "level" ? order : "asc"}
                  onClick={() => handleRequestSort("level")}
                  sx={{ color: 'white' }}
                >
                  Nivel
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                <TableSortLabel
                  active={orderBy === "logger_name"}
                  direction={orderBy === "logger_name" ? order : "asc"}
                  onClick={() => handleRequestSort("logger_name")}
                  sx={{ color: 'white' }}
                >
                  Logger
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                <TableSortLabel
                  active={orderBy === "message"}
                  direction={orderBy === "message" ? order : "asc"}
                  onClick={() => handleRequestSort("message")}
                  sx={{ color: 'white' }}
                >
                  Mensaje
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Módulo
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Función
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Línea
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((log) => (
              <TableRow 
                key={log.id} 
                hover
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    #{log.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getLevelIcon(log.level)}
                    <Chip 
                      label={log.level || 'N/A'} 
                      size="small" 
                      color={getLevelColor(log.level)}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={log.logger_name || 'N/A'} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 300, 
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {log.message || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {log.module || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {log.function || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {log.line_number || 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalCount > 0 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
} 