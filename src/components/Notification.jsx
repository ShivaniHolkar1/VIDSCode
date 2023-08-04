import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // Replace with your server URL

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    // Clean up the event listener on unmounting
    return () => {
      socket.off('newNotification');
    };
  }, []);

  return (
    <div>
      <h3>Notifications:</h3>
      {notifications.map((notification, index) => (
        <div key={index}>
          <p>{notification.message}</p>
          <pre>{JSON.stringify(notification.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;