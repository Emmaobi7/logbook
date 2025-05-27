import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import {
  Box, Typography, Card, CardContent, CardActions,
  Button, Grid, CircularProgress, Snackbar
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";


const SupervisorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { user } = useAuth();
  const supervisorEmail = user?.email;


  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`/admin/students?email=${supervisorEmail}`);
      setStudents(data.students || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load students.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (studentId) => {
    
    if (!window.confirm('Remove this student?')) return;

    try {
      await axios.delete(`/admin/rm-student/${studentId}?email=${supervisorEmail}`);
      setStudents(prev => prev.filter(s => s._id !== studentId));
      setSnackbar({ open: true, message: 'Student removed.', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to remove student.', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flex min-h-screen">
          <Sidebar />
    <div className='mt-10'>
    <Box p={4} >
      <Typography variant="h4" gutterBottom>
        Assigned Students
      </Typography>

      {students.length === 0 ? (
        <Typography>No students assigned.</Typography>
      ) : (
        <Grid container spacing={2}>
          {students.map(student => (
            <Grid item xs={12} md={6} lg={4} key={student._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{student.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {student.email}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemove(student.studentId)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </Box>
    </div>
    </div>
  );
};

export default SupervisorStudents;
