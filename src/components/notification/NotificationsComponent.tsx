import { fetchNotifications } from "@/utils/fetchNotifications";
import { useEffect, useState } from "react";

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications("admin");
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              <strong>{notification.type}</strong>: {notification.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsComponent;
