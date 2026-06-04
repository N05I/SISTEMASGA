import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { PictureAsPdf, TableChart, Assessment, Download } from '@mui/icons-material';
import { mockStudents, mockGrades, mockAttendance } from '../../data/mockData';

export default function Reports() {
  const handleGenerateReport = (reportType: string) => {
    alert(`Generando reporte: ${reportType}\n\nEn producción, este reporte se exportaría a PDF o Excel.`);
  };

  const stats = {
    totalStudents: mockStudents.length,
    activeStudents: mockStudents.filter(s => s.status === 'active').length,
    averageGrade: (mockGrades.reduce((acc, g) => acc + g.score, 0) / mockGrades.length).toFixed(2),
    attendanceRate: ((mockAttendance.filter(a => a.status === 'present').length / mockAttendance.length) * 100).toFixed(1)
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generación de Reportes (RF06)
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Exportación PDF/Excel | Exactitud 100%
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="overline">
                Total Estudiantes
              </Typography>
              <Typography variant="h3">{stats.totalStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="overline">
                Estudiantes Activos
              </Typography>
              <Typography variant="h3">{stats.activeStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="overline">
                Promedio General
              </Typography>
              <Typography variant="h3">{stats.averageGrade}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="overline">
                Asistencia
              </Typography>
              <Typography variant="h3">{stats.attendanceRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reportes Académicos
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PictureAsPdf color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Reporte de Calificaciones"
                  secondary="Calificaciones por estudiante y curso"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('Calificaciones')}
                >
                  PDF
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <TableChart color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Reporte de Asistencia"
                  secondary="Registro de asistencia por período"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('Asistencia')}
                >
                  Excel
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Assessment color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Estadísticas del Bimestre"
                  secondary="Análisis completo del período académico"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('Estadísticas Bimestre')}
                >
                  PDF
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reportes Administrativos
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PictureAsPdf color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Listado de Estudiantes"
                  secondary="Nómina completa de estudiantes matriculados"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('Listado Estudiantes')}
                >
                  PDF
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <TableChart color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Reporte de Matrículas"
                  secondary="Matrículas procesadas por período"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('Matrículas')}
                >
                  Excel
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Assessment color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Reporte de Usuarios"
                  secondary="Lista de usuarios del sistema por rol"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('Usuarios')}
                >
                  PDF
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
