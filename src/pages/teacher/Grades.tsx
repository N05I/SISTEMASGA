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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { mockGrades, mockStudents, mockCourses } from '../../data/mockData';

export default function Grades() {
  const [grades, setGrades] = useState(mockGrades);
  const [open, setOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);

  const handleOpen = (grade?: any) => {
    setEditingGrade(grade || {
      id: '',
      studentId: '',
      courseId: '',
      period: 'Bimestre 1',
      score: 0,
      comments: '',
      date: new Date().toISOString().split('T')[0]
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGrade(null);
  };

  const handleSave = () => {
    if (editingGrade.id) {
      setGrades(grades.map(g => g.id === editingGrade.id ? editingGrade : g));
    } else {
      setGrades([...grades, { ...editingGrade, id: `g${Date.now()}` }]);
    }
    handleClose();
  };

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'N/A';
  };

  const getCourseName = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course?.name || 'N/A';
  };

  const getScoreColor = (score: number) => {
    if (score >= 18) return 'success';
    if (score >= 14) return 'primary';
    if (score >= 11) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Registro de Calificaciones (RF04)</Typography>
          <Typography variant="body2" color="text.secondary">
            Validación de rango (0-20) | Historial completo
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Nueva Calificación
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Comentarios</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>{getStudentName(grade.studentId)}</TableCell>
                <TableCell>{getCourseName(grade.courseId)}</TableCell>
                <TableCell>{grade.period}</TableCell>
                <TableCell>
                  <Chip
                    label={grade.score}
                    color={getScoreColor(grade.score)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                <TableCell>{grade.comments || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(grade)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGrade?.id ? 'Editar Calificación' : 'Nueva Calificación'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            select
            label="Estudiante"
            value={editingGrade?.studentId || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, studentId: e.target.value })}
          >
            {mockStudents.map(student => (
              <MenuItem key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.grade}° {student.section})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            select
            label="Curso"
            value={editingGrade?.courseId || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, courseId: e.target.value })}
          >
            {mockCourses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            select
            label="Período"
            value={editingGrade?.period || 'Bimestre 1'}
            onChange={(e) => setEditingGrade({ ...editingGrade, period: e.target.value })}
          >
            <MenuItem value="Bimestre 1">Bimestre 1</MenuItem>
            <MenuItem value="Bimestre 2">Bimestre 2</MenuItem>
            <MenuItem value="Bimestre 3">Bimestre 3</MenuItem>
            <MenuItem value="Bimestre 4">Bimestre 4</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            label="Nota (0-20)"
            type="number"
            inputProps={{ min: 0, max: 20 }}
            value={editingGrade?.score || 0}
            onChange={(e) => {
              const score = Math.min(20, Math.max(0, Number(e.target.value)));
              setEditingGrade({ ...editingGrade, score });
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editingGrade?.date || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, date: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={3}
            label="Comentarios"
            value={editingGrade?.comments || ''}
            onChange={(e) => setEditingGrade({ ...editingGrade, comments: e.target.value })}
          />
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
