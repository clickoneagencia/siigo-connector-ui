"use client";
import { 
  Box, 
  IconButton, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel
} from "@mui/material";
import { 
  FirstPage, 
  KeyboardArrowLeft, 
  KeyboardArrowRight, 
  LastPage 
} from "@mui/icons-material";

export default function CustomPagination({
  currentPage,
  totalPages,
  totalCount,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) {
  console.log('CustomPagination props:', { currentPage, totalPages, totalCount, rowsPerPage });
  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onRowsPerPageChange(newRowsPerPage);
  };

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalCount);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      p: 2,
      borderTop: 1,
      borderColor: 'divider'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Filas por página:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            displayEmpty
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {startItem}-{endItem} de {totalCount}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handleFirstPage}
          disabled={currentPage <= 1}
          aria-label="Primera página"
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          <KeyboardArrowLeft />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
          <Typography variant="body2">
            Página {currentPage} de {totalPages}
          </Typography>
        </Box>
        
        <IconButton
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPage}
          disabled={currentPage >= totalPages}
          aria-label="Última página"
        >
          <LastPage />
        </IconButton>
      </Box>
    </Box>
  );
} 