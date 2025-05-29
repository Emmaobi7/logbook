import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import Sidebar from "./Sidebar";
import axiosInstance from "../../utils/axiosInstance";

function ExportButton({ label, onClick, disabled, loading }) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled || loading}
      
      sx={{
      mt: 2,
      mb: 2,
      minWidth: 200,
      backgroundColor: '#de7225',
      '&:hover': {
        backgroundColor: '#c96120',
      },
    }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : label}
    </Button>
  );
}

function StudentSelector({ students, selectedStudent, onChange }) {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="student-select-label">Select Student</InputLabel>
      <Select
        labelId="student-select-label"
        value={selectedStudent}
        label="Select Student"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {students.map((student) => (
          <MenuItem key={student._id} value={student._id}>
            {student.fullName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function ExportLogs() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch supervised students on mount
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get("supervisor/student-logs"); // or whatever your actual logs endpoint is
      const logs = res.data;

      // Extract unique students from logs
      const uniqueStudentsMap = new Map();
      logs.forEach(log => {
        const student = log.user;
        if (student && !uniqueStudentsMap.has(student._id)) {
          uniqueStudentsMap.set(student._id, student);
        }
      });

      const uniqueStudents = Array.from(uniqueStudentsMap.values());
      setStudents(uniqueStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({ type: "error", text: "Failed to load students" });
    }
  };

  fetchStudents();
}, []);


  // Utility to download CSV content
  function downloadCSV(filename, csvText) {
    const blob = new Blob([csvText], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Export All Logs
  async function exportAllLogs() {
    setLoading(true);
    setMessage(null);
    try {
    const res = await axiosInstance.get("/supervisor/export/logs/all", {
      responseType: "blob", // important to handle file content
    });

    const disposition = res.headers["content-disposition"] || "";
    const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : "all-logs.csv";

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setMessage({ type: "success", text: "Export successful!" });
  } catch (e) {
    console.error(e);
    setMessage({ type: "error", text: "Failed to export logs" });
  }
    setLoading(false);
  }

  // Export Logs for Selected Student
  async function exportStudentLogs() {
    if (!selectedStudent) {
      setMessage({ type: "error", text: "Please select a student" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
    const res = await axiosInstance.get(`/supervisor/export/logs/student/${selectedStudent}`, {
      responseType: "blob",
    });

    const disposition = res.headers["content-disposition"] || "";
    const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : "student-logs.csv";

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setMessage({ type: "success", text: "Student log export successful!" });
  } catch (e) {
    console.error(e);
    setMessage({ type: "error", text: "Failed to export student logs" });
  }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
            <Sidebar />
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, p: 4, textAlign: "center" }}>
      <Typography variant="h5" mb={3}>
        Export Student Logs
      </Typography>

      <ExportButton label="Export All Logs" onClick={exportAllLogs} loading={loading} />

      <Typography variant="subtitle1" sx={{ my: 2 }}>
        OR
      </Typography>

      <StudentSelector
        students={students}
        selectedStudent={selectedStudent}
        onChange={setSelectedStudent}
      />

      <ExportButton
        label="Export Selected Student Logs"
        onClick={exportStudentLogs}
        disabled={!selectedStudent}
        loading={loading}
      />

      {message && (
        <Alert severity={message.type} sx={{ mt: 3 }}>
          {message.text}
        </Alert>
      )}
    </Box>
    </div>
  );
}
