"use client";
import { Container, Typography, Paper, Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={8} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido al Dashboard
          </Typography>
          <Typography variant="body1">
            Esta es la vista principal del dashboard. Puedes personalizar este contenido.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
} 