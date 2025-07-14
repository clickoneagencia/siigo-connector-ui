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
  IconButton,
  Tooltip
} from "@mui/material";
import CustomPagination from "./CustomPagination";
import { 
  Visibility, 
  Edit, 
  Delete, 
  Add,
  CheckCircle,
  Error,
  Warning,
  Info
} from "@mui/icons-material";

const getOperationTypeIcon = (operationType) => {
  switch (operationType?.toUpperCase()) {
    case 'CREATE':
      return <Add color="success" />;
    case 'UPDATE':
      return <Edit color="warning" />;
    case 'DELETE':
      return <Delete color="error" />;
    default:
      return <Info color="info" />;
  }
};

const getOperationTypeColor = (operationType) => {
  switch (operationType?.toUpperCase()) {
    case 'CREATE':
      return 'success';
    case 'UPDATE':
      return 'warning';
    case 'DELETE':
      return 'error';
    default:
      return 'default';
  }
};

const getResponseColor = (response) => {
  switch (response?.toLowerCase()) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

const getResponseIcon = (response) => {
  switch (response?.toLowerCase()) {
    case 'success':
      return <CheckCircle fontSize="small" />;
    case 'error':
      return <Error fontSize="small" />;
    case 'warning':
      return <Warning fontSize="small" />;
    default:
      return <Info fontSize="small" />;
  }
};

export default function DataTable({ 
  data, 
  loading, 
  error, 
  page, 
  rowsPerPage, 
  totalCount, 
  onPageChange, 
  onRowsPerPageChange 
}) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Cargando datos...
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
          No hay datos disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Fecha
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                SKU
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Nombre
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Referencia
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Precio
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Cantidad
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Operación
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Respuesta
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                Mensaje
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow 
                key={item.id} 
                hover
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    #{item.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {item.date ? new Date(item.date).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.sku || 'N/A'} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 150, wordBreak: 'break-word' }}>
                    {item.name || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.reference || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {item.price ? `$${parseFloat(item.price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}` : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.stock_quantity || 'N/A'} 
                    size="small" 
                    color={item.stock_quantity > 0 ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getOperationTypeIcon(item.operation_type)}
                    <Chip 
                      label={item.operation_type || 'N/A'} 
                      size="small" 
                      color={getOperationTypeColor(item.operation_type)}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getResponseIcon(item.response)}
                    <Chip 
                      label={item.response || 'N/A'} 
                      size="small" 
                      color={getResponseColor(item.response)}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={item.message || 'Sin mensaje'} placement="top">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.message || 'Sin mensaje'}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalCount > 0 && (
        <CustomPagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / rowsPerPage)}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
} 