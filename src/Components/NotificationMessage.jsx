import { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`/notifications/${userEmail}`)
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching notifications:', error));
  }, [userEmail]);

  return (
    <div>
      <h3>Inbox</h3>
      {notifications.map((notification) => (
        <div key={notification._id}>
          <p>{notification.message}</p>
          <small>{new Date(notification.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
