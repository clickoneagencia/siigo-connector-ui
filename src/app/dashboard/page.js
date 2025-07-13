"use client";
import { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Card, CardContent, Grid, CircularProgress, Alert, IconButton, InputAdornment, Snackbar } from "@mui/material";
import { Visibility, VisibilityOff, ContentCopy, Check, Edit } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useAuth } from "../auth-context";

export default function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTokens, setShowTokens] = useState({});
  const [copiedToken, setCopiedToken] = useState({});
  const [editCompany, setEditCompany] = useState(null);
  const [editName, setEditName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [regenerating, setRegenerating] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleToggleToken = (companyId) => {
    setShowTokens((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  };

  const handleCopyToken = async (companyId, token) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken((prev) => ({ ...prev, [companyId]: true }));
      setTimeout(() => {
        setCopiedToken((prev) => ({ ...prev, [companyId]: false }));
      }, 1500);
    } catch (e) {}
  };

  const handleEditClick = (company) => {
    setEditCompany(company);
    setEditName(company.name);
  };

  const handleEditClose = () => {
    setEditCompany(null);
    setEditName("");
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleEditSave = () => {
    // Aquí puedes hacer la petición al backend para actualizar la empresa
    // Por ahora solo cierra el modal
    setEditCompany(null);
    setEditName("");
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError("");
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/companies`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("No se pudieron obtener las empresas");
        }
        const data = await res.json();
        setCompanies(data || []);
      } catch (err) {
        setError(err.message || "Error al obtener las empresas");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchCompanies();
    }
  }, [isAuthenticated]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={8} sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido al Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Esta es la vista principal del dashboard. Puedes personalizar este contenido.
          </Typography>
          <Box sx={{ mt: 4, textAlign: "left" }}>
            <Typography variant="h5" gutterBottom>
              Empresas
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Grid container spacing={2}>
                {companies.map((company) => (
                  <Grid item xs={12} sm={6} md={4} key={company.id}>
                    <Card elevation={4}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {company.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {company.id}
                        </Typography>
                        {company.key && (
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', flex: 1 }}>
                                Token: {showTokens[company.id]
                                  ? company.key.token
                                  : '•'.repeat(company.key.token.length)}
                              </Typography>
                              <IconButton size="small" onClick={() => handleToggleToken(company.id)} aria-label={showTokens[company.id] ? 'Ocultar token' : 'Mostrar token'}>
                                {showTokens[company.id] ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                              <IconButton size="small" onClick={() => handleCopyToken(company.id, company.key.token)} aria-label="Copiar token">
                                {copiedToken[company.id] ? <Check color="success" /> : <ContentCopy />}
                              </IconButton>
                              <IconButton size="small" onClick={() => handleEditClick(company)} aria-label="Editar empresa">
                                <Edit />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>
      {/* Modal de edición */}
      <Dialog open={!!editCompany} onClose={handleEditClose}>
        <DialogTitle>Editar empresa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la empresa"
            type="text"
            fullWidth
            value={editName}
            onChange={e => setEditName(e.target.value)}
            sx={{ mb: 2 }}
          />
          {editCompany?.key?.id && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Key ID:</strong> {editCompany.key.id}
            </Typography>
          )}
          <TextField
            margin="dense"
            label="Token"
            type="text"
            fullWidth
            value={editCompany?.key?.token || ''}
            InputProps={{ disabled: true }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onClick={async () => {
              if (editCompany) {
                setRegenerating(true);
                try {
                  const API_URL = process.env.NEXT_PUBLIC_API_URL;
                  const token = localStorage.getItem("token");
                  const res = await fetch(`${API_URL}/api/keys`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ company_id: editCompany.id })
                  });
                  if (!res.ok) throw new Error('No se pudo regenerar el token');
                  const data = await res.json();
                  setEditCompany({
                    ...editCompany,
                    key: {
                      ...editCompany.key,
                      token: data.token
                    }
                  });
                  setSnackbar({ open: true, message: 'Token regenerado correctamente', severity: 'success' });
                } catch (e) {
                  setSnackbar({ open: true, message: 'Error al regenerar el token', severity: 'error' });
                }
                setRegenerating(false);
              }
            }}
            disabled={regenerating}
          >
            {regenerating ? <CircularProgress size={20} sx={{ color: 'primary.main' }} /> : 'Regenerar token'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 