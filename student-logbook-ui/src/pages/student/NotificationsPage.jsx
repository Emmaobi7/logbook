import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { MdNotifications } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from '../../components/layout/Sidebar';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/admin/my");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
     <div className="flex min-h-screen">
          <Sidebar />
    <div className="flex-1 p-6 mt-16 md:ml-6 bg-gray-100 dark:bg-gray-500 text-dark-800 dark:text-white">
      <div className="flex items-center gap-3 mb-6">
        <MdNotifications className="text-2xl text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-semibold">My Notifications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <CircularProgress />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          You don’t have any notifications yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className="shadow-md bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
            >
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  {notification.title}
                </Typography>
                <Typography variant="body2" className="mt-1 text-gray-100 dark:text-gray-500 whitespace-pre-line">
                  {notification.message}
                </Typography>
                <Typography variant="caption" className="block mt-2 text-sm text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default NotificationsPage;
