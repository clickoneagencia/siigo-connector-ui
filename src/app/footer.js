"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: "center", bgcolor: "background.paper", mt: 4 }}>
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Mi App. Todos los derechos reservados.
      </Typography>
    </Box>
  );
} 