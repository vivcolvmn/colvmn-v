// Notifications Component

// State:
// - notifications (array of notification objects)
// - unseenCount (number of unseen notifications)

// Functions:
// - fetchNotifications: GET request to retrieve new notifications
// - clearNotifications: Marks notifications as read

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);

    useEffect(() => {
      fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
      // GET request to fetch new notifications
      // Set unseen notifications count
    };

    const clearNotifications = () => {
      // Mark notifications as seen/read
      setUnseenCount(0);
    };

    return (
      <div>
        <div onClick={clearNotifications}>
          <span>🔔 Notifications ({unseenCount})</span>
        </div>
        <div>
          {/* Render notifications */}
          {notifications.map((notif) => (
            <div key={notif.id}>
              <p>{notif.message}</p>
              <small>{notif.timestamp}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default Notifications;
