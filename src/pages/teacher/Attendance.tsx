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
  Chip,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { CheckCircle, Cancel, Schedule, EventAvailable } from '@mui/icons-material';
import { mockAttendance, mockStudents, mockCourses } from '../../data/mockData';

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendance);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('c1');

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    const existing = attendanceRecords.find(
      a => a.studentId === studentId && a.courseId === selectedCourse && a.date === selectedDate
    );

    if (existing) {
      setAttendanceRecords(
        attendanceRecords.map(a =>
          a.id === existing.id ? { ...a, status } : a
        )
      );
    } else {
      setAttendanceRecords([
        ...attendanceRecords,
        {
          id: `a${Date.now()}`,
          studentId,
          courseId: selectedCourse,
          date: selectedDate,
          status,
          notes: ''
        }
      ]);
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = attendanceRecords.find(
      a => a.studentId === studentId && a.courseId === selectedCourse && a.date === selectedDate
    );
    return record?.status || null;
  };

  const getStatusColor = (status: string | null) => {
    const colors = {
      present: 'success',
      absent: 'error',
      late: 'warning',
      excused: 'info'
    };
    return status ? colors[status as keyof typeof colors] as any : 'default';
  };

  const getStatusLabel = (status: string | null) => {
    const labels = {
      present: 'Presente',
      absent: 'Ausente',
      late: 'Tardanza',
      excused: 'Justificado'
    };
    return status ? labels[status as keyof typeof labels] : 'Sin marcar';
  };

  const getStatusIcon = (status: string | null) => {
    const icons = {
      present: <CheckCircle />,
      absent: <Cancel />,
      late: <Schedule />,
      excused: <EventAvailable />
    };
    return status ? icons[status as keyof typeof icons] : null;
  };

  const course = mockCourses.find(c => c.id === selectedCourse);
  const studentsInCourse = mockStudents.filter(s => s.grade === course?.grade && s.section === course?.section);

  const attendanceStats = {
    present: attendanceRecords.filter(a => a.date === selectedDate && a.status === 'present').length,
    absent: attendanceRecords.filter(a => a.date === selectedDate && a.status === 'absent').length,
    late: attendanceRecords.filter(a => a.date === selectedDate && a.status === 'late').length,
    total: studentsInCourse.length
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Control de Asistencia (RF05)
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Notificación a padres | Compatible con dispositivos móviles
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="overline">
                    Presentes
                  </Typography>
                  <Typography variant="h4">{attendanceStats.present}</Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="overline">
                    Ausentes
                  </Typography>
                  <Typography variant="h4">{attendanceStats.absent}</Typography>
                </Box>
                <Cancel color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="overline">
                    Tardanzas
                  </Typography>
                  <Typography variant="h4">{attendanceStats.late}</Typography>
                </Box>
                <Schedule color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="overline">
                    Total
                  </Typography>
                  <Typography variant="h4">{attendanceStats.total}</Typography>
                </Box>
                <EventAvailable color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Curso"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {mockCourses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name} ({course.grade}° {course.section})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estudiante</TableCell>
              <TableCell>Grado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsInCourse.map((student) => {
              const status = getAttendanceStatus(student.id);
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {student.firstName} {student.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.grade}° {student.section}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(status)}
                      color={getStatusColor(status)}
                      size="small"
                      icon={getStatusIcon(status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant={status === 'present' ? 'contained' : 'outlined'}
                        color="success"
                        onClick={() => handleMarkAttendance(student.id, 'present')}
                      >
                        Presente
                      </Button>
                      <Button
                        size="small"
                        variant={status === 'absent' ? 'contained' : 'outlined'}
                        color="error"
                        onClick={() => handleMarkAttendance(student.id, 'absent')}
                      >
                        Ausente
                      </Button>
                      <Button
                        size="small"
                        variant={status === 'late' ? 'contained' : 'outlined'}
                        color="warning"
                        onClick={() => handleMarkAttendance(student.id, 'late')}
                      >
                        Tarde
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
