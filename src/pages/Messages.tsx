import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import { Send, Mail, MailOutline } from '@mui/icons-material';
import { mockMessages, mockUsers } from '../data/mockData';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [openCompose, setOpenCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    toId: '',
    subject: '',
    content: ''
  });

  const myMessages = messages.filter(m => m.toId === user?.id || m.fromId === user?.id);

  const handleSelectMessage = (message: any) => {
    setSelectedMessage(message);
    if (!message.read && message.toId === user?.id) {
      setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
    }
  };

  const handleSendMessage = () => {
    const message = {
      id: `m${Date.now()}`,
      fromId: user?.id || '',
      toId: newMessage.toId,
      subject: newMessage.subject,
      content: newMessage.content,
      date: new Date().toISOString(),
      read: false
    };
    setMessages([...messages, message]);
    setOpenCompose(false);
    setNewMessage({ toId: '', subject: '', content: '' });
  };

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser?.name || 'Desconocido';
  };

  const unreadCount = myMessages.filter(m => !m.read && m.toId === user?.id).length;

  const availableUsers = mockUsers.filter(u => u.id !== user?.id);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Mensajería Interna (RF08)</Typography>
          <Typography variant="body2" color="text.secondary">
            Canal privado entre actores del sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setOpenCompose(true)}
        >
          Nuevo Mensaje
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                Bandeja de Entrada
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
            </Box>
            <List>
              {myMessages.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No hay mensajes"
                    secondary="Comienza una conversación"
                  />
                </ListItem>
              ) : (
                myMessages.map((message) => (
                  <Box key={message.id}>
                    <ListItem
                      button
                      onClick={() => handleSelectMessage(message)}
                      selected={selectedMessage?.id === message.id}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {!message.read && message.toId === user?.id ? <Mail /> : <MailOutline />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={!message.read && message.toId === user?.id ? 'bold' : 'normal'}
                            >
                              {message.fromId === user?.id ? `Para: ${getUserName(message.toId)}` : `De: ${getUserName(message.fromId)}`}
                            </Typography>
                            {!message.read && message.toId === user?.id && (
                              <Chip label="Nuevo" color="primary" size="small" />
                            )}
                          </Box>
                        }
                        secondary={message.subject}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedMessage ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {selectedMessage.subject}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  De: {getUserName(selectedMessage.fromId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(selectedMessage.date).toLocaleString()}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedMessage.content}
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 5, textAlign: 'center' }}>
              <MailOutline sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Selecciona un mensaje para leer
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={openCompose} onClose={() => setOpenCompose(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Mensaje</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            select
            label="Destinatario"
            value={newMessage.toId}
            onChange={(e) => setNewMessage({ ...newMessage, toId: e.target.value })}
          >
            {availableUsers.map(u => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.role === 'admin' ? 'Administrador' : u.role === 'teacher' ? 'Docente' : 'Padre'})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            label="Asunto"
            value={newMessage.subject}
            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={6}
            label="Mensaje"
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompose(false)}>Cancelar</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            startIcon={<Send />}
            disabled={!newMessage.toId || !newMessage.subject || !newMessage.content}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
