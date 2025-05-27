import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  MdInfo,
  MdBook,
  MdPayment,
  MdChecklist,
  MdEdit,
  MdSupervisorAccount,
  MdPerson,
  MdNotifications,
  MdHelp
} from "react-icons/md";
import Sidebar from '../../components/layout/Sidebar';

const sections = [
  {
    icon: <MdInfo size={24} color="#1976d2" />,
    title: "Getting Started",
    content: `When you log in for the first time, your dashboard will appear empty. This is normal — it simply means you haven’t submitted any log entries yet.`,
  },
  {
    icon: <MdBook size={24} color="#1976d2" />,
    title: "Accessing Your Logbook",
    content: `
    • Go to "My Logbook" to begin submitting your logs.\n
    • A one-time payment is required to access this page.\n
    • If you haven't paid, you'll be redirected to the payment page.\n
    • If you’ve paid manually or have issues, contact the admin with proof. Access will be granted after confirmation.`,
  },
  {
    icon: <MdChecklist size={24} color="#1976d2" />,
    title: "Submitting Log Entries",
    content: `
    • Fill out both required fields on the logbook page.\n
    • If logs don’t appear after submitting, refresh or revisit the page.\n
    • Only one log is allowed per day.`,
  },
  {
    icon: <MdEdit size={24} color="#1976d2" />,
    title: "Understanding Your Dashboard",
    content: `
    • Logs can be: Pending (awaiting supervisor review), Approved, or Rejected.\n
    • If rejected, the log can be edited (same date).\n
    • Preceptors may leave comments for feedback.`,
  },
  {
    icon: <MdSupervisorAccount size={24} color="#1976d2" />,
    title: "Getting a Preceptor",
    content: `
    • Navigate to the “Preceptor” page.\n
    • Enter your preceptor’s full name and email.\n
    • Click “Invite” — if successful, your preceptor will be assigned.`,
  },
  {
    icon: <MdPerson size={24} color="#1976d2" />,
    title: "Completing Your Profile",
    content: `Go to your “Profile” page to upload a photo and complete your personal information.`,
  },
  {
    icon: <MdNotifications size={24} color="#1976d2" />,
    title: "Viewing Notifications",
    content: `All admin notifications are available in the “Notifications” page.`,
  },
  {
    icon: <MdHelp size={24} color="#1976d2" />,
    title: "Need Help?",
    content: `If you experience any issues, please contact the admin for assistance.`,
  },
];

const StudentGuide = () => {
  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar />
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        🎓 Student Guide
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Learn how to use the platform effectively as a student. This guide covers everything from logging activities to connecting with a supervisor.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {sections.map((section, index) => (
        <Accordion key={index} TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {section.icon}
              <Typography sx={{ fontWeight: 500 }}>{section.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {section.content.split("\n").map((line, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                {line.trim()}
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
    </div>
  );
};

export default StudentGuide;
