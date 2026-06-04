import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { mockUsers } from '../../data/mockData';

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleOpen = (user?: any) => {
    setEditingUser(user || {
      id: '',
      email: '',
      password: '',
      role: 'teacher',
      name: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSave = () => {
    if (editingUser.id) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    } else {
      setUsers([...users, { ...editingUser, id: Date.now().toString() }]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = { admin: 'Administrador', teacher: 'Docente', parent: 'Padre/Tutor' };
    return labels[role as keyof typeof labels];
  };

  const getRoleColor = (role: string) => {
    const colors = { admin: 'error', teacher: 'primary', parent: 'success' };
    return colors[role as keyof typeof colors] as any;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Usuarios (RF02)</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Nuevo Usuario
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser?.id ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Nombre Completo"
            value={editingUser?.name || ''}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Correo Electrónico"
            type="email"
            value={editingUser?.email || ''}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            type="password"
            value={editingUser?.password || ''}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            select
            label="Rol"
            value={editingUser?.role || 'teacher'}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="teacher">Docente</MenuItem>
            <MenuItem value="parent">Padre/Tutor</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
