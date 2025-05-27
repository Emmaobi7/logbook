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
  FaUsers,
  FaUserEdit,
  FaBell,
  FaRegEnvelope,
  FaUserPlus,
  FaUserShield,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import Sidebar from "./SideBar";

const adminGuideItems = [
  {
    icon: <FaUsers size={20} />,
    text:
      "Your dashboard provides a real-time overview including total users, total students, and total supervisors.",
  },
  {
    icon: <FaUserEdit size={20} />,
    text:
      "On the 'Users' page, you can view all user accounts. You can update records, deactivate or activate accounts, delete users, change their roles, mark users as paid (for manual payments), and edit user details like name and email.",
  },
  {
    icon: <FaSearch size={20} />,
    text:
      "The 'Users' page also includes advanced filtering by role, payment status, and account status (active/inactive), as well as a search bar for looking up users by name or email.",
  },
  {
    icon: <FaBell size={20} />,
    text:
      "On the 'Send Notification' page, you can send messages based on four criteria: single user, multiple users, all students, or all preceptors.",
  },
  {
    icon: <FaRegEnvelope size={20} />,
    text:
      "When sending a notification, you can choose to also send it as an email by checking the 'Send as Email' option. If unchecked, only a dashboard notification will be sent.",
  },
  {
    icon: <FaBell size={20} />,
    text:
      "The 'Sent Notifications' page displays all notifications you’ve sent. Use the filters to narrow results. Note: notifications cannot be deleted, so please review before sending.",
  },
  {
    icon: <FaUserPlus size={20} />,
    text:
      "On the 'Add User' page, you can manually create new user accounts. Remember to securely save the user’s password and ensure the correct person receives it.",
  },
  {
    icon: <FaUserShield size={20} />,
    text:
      "The 'Assign Preceptor's page allows you to assign preceptors to students. Simply select a preceptor, choose the students to assign, and click the 'Assign' button.",
  },
  {
    icon: <FaInfoCircle size={20} />,
    text:
      "Need help? Ensure you’re checking logs, filters, and system messages carefully. Contact the development team if system-level issues arise.",
  },
];

const AdminGuide = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
          <Sidebar />
          <div className="md:ml-64 flex-1 p-4">
    <Slide in direction="up" timeout={500}>
      <Box p={3} maxWidth="800px" mx="auto" className='md:ml-64 p-4'>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Admin Guide
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="body1" mb={2}>
            This guide is tailored to help you, as an admin, manage users and operations within the app efficiently and responsibly.
          </Typography>

          <List>
            {adminGuideItems.map((item, index) => (
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
    </div>
  );
};

export default AdminGuide;
