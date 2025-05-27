import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slide,
} from "@mui/material";
import {
  FaClipboardList,
  FaUserCheck,
  FaFileExport,
  FaRegBell,
  FaFilter,
  FaUserEdit,
  FaInfoCircle,
  FaTasks,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

const items = [
  {
    icon: <FaTasks size={20} />,
    text:
      "Your dashboard provides a quick overview — number of students assigned to you, pending logs, approved logs, and rejected logs. These stats update dynamically as you interact with logs.",
  },
  {
    icon: <FaClipboardList size={20} />,
    text:
      "Your primary role is to review student log entries. You can approve, reject, and optionally leave a comment on each entry.",
  },
  {
    icon: <FaUserCheck size={20} />,
    text:
      "When a student invites you as a preceptor, the system automatically grants you access. You’ll receive an email with a secure link to view that student’s logs. You can also log into your dashboard to manage all logs.",
  },
  {
    icon: <FaClipboardList size={20} />,
    text:
      "On the 'Student Logs' page, you can view all logs submitted by your assigned students. Use this page to approve, reject, or leave a comment.",
  },
  {
    icon: <FaFilter size={20} />,
    text:
      "You can filter logs by status or student to streamline your workflow on the 'Student Logs' page.",
  },
  {
    icon: <FaClipboardList size={20} />,
    text:
      "To submit a review: mark the log as 'approved' or 'rejected', optionally leave a comment, then click 'Save'. Logs left as 'pending' will not be submitted.",
  },
  {
    icon: <FaFileExport size={20} />,
    text:
      "Visit the 'Export Logs' page to download student logs. You can export logs for an individual student or for all your assigned students. The exported file will be in CSV format.",
  },
  {
    icon: <FaUserEdit size={20} />,
    text: "Update your personal details via the Profile page.",
  },
  {
    icon: <FaRegBell size={20} />,
    text:
      "Stay informed through your Notifications page. Any important messages or alerts from the admin will appear there.",
  },
  {
    icon: <FaInfoCircle size={20} />,
    text:
      "Note: for integrity, once a student log is approved, it can no longer be editted by the preceptor",
  },
  {
    icon: <FaInfoCircle size={20} />,
    text:
      "Need help or experiencing issues? Please reach out to the admin directly for support.",
  },
];

const SupervisorGuide = () => {
  return (
    <div className="flex min-h-screen">
          <Sidebar />
    <Slide in direction="up" timeout={500}>
      <Box p={3} maxWidth="800px" mx="auto">
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Preceptor Guide
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="body1" mb={2}>
            Welcome! This page is designed to help you understand how to use the platform effectively as a preceptor.
          </Typography>

          <List>
            {items.map((item, index) => (
              <ListItem key={index} sx={{ alignItems: "flex-start" }}>
                <ListItemIcon sx={{ mt: "5px", color: "primary.main" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Slide>
    </div>
  );
};

export default SupervisorGuide;
