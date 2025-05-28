import React, { useState, useEffect } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import axiosInstance from '../../utils/axiosInstance';
import Sidebar from "./SideBar";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material';

const AssignStudents = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosInstance.get('/admin/users', { params: { role: 'supervisor' } }),
      axiosInstance.get('/admin/users', { params: { role: 'student' } }),
    ])
      .then(([supRes, stuRes]) => {
        setSupervisors(supRes.data.users || []);
        setStudents(stuRes.data.users || []);
      })
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');
    if (!selectedSupervisor) {
      setError('Please select a supervisor');
      return;
    }
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post('/admin/supervisor/invite', {
        supervisorId: selectedSupervisor,
        studentIds: selectedStudents,
      });
      setSuccessMsg('Students assigned successfully!');
      setSelectedStudents([]);
      setSelectedSupervisor('');
      alert('student(s) assigned successully')
    } catch {
        alert('Error assigning students, try again later')
      setError('Failed to assign students');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box className="flex justify-center items-center min-h-[200px]">
        <CircularProgress />
      </Box>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-md mt-16 p-6"
    >
      <Typography variant="h5" className="mb-6 flex items-center gap-2">
        <AiOutlineUserAdd size={28} /> Assign Students to Preceptor
      </Typography>

      {error && (
        <Typography color="error" className="mb-4">
          {error}
        </Typography>
      )}
      {successMsg && (
        <Typography color="primary" className="mb-4">
          {successMsg}
        </Typography>
      )}

      <FormControl fullWidth className="mb-6">
        <InputLabel id="supervisor-label">Preceptor</InputLabel>
        <Select
          labelId="supervisor-label"
          value={selectedSupervisor}
          onChange={(e) => setSelectedSupervisor(e.target.value)}
          input={<OutlinedInput label="Supervisor" />}
          required
        >
          {supervisors.map((sup) => (
            <MenuItem key={sup._id} value={sup._id}>
              {sup.fullName} ({sup.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="mb-6">
        <InputLabel id="students-label">Students</InputLabel>
        <Select
          labelId="students-label"
          multiple
          value={selectedStudents}
          onChange={(e) => setSelectedStudents(e.target.value)}
          input={<OutlinedInput label="Students" />}
          renderValue={(selected) => (
            <Box className="flex flex-wrap gap-1">
              {selected.map((id) => {
                const student = students.find((s) => s._id === id);
                return (
                  <Chip
                    key={id}
                    label={student ? student.fullName : id}
                    size="small"
                    color="primary"
                  />
                );
              })}
            </Box>
          )}
          required
        >
          {students.map((stu) => (
            <MenuItem key={stu._id} value={stu._id}>
              {stu.fullName} ({stu.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
         sx={{
    mt: 2,
    backgroundColor: '#de7225',
    '&:hover': {
      backgroundColor: '#c96120',
    },
  }}
        fullWidth
        disabled={submitting}
      >
        {submitting ? 'Assigning...' : 'Assign Students'}
      </Button>
    </Box>
    </div>
  );
};

export default AssignStudents;
