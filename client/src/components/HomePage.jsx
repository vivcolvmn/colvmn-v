// Home Page Component

// State:
// - userEvents, friendEvents

// Functions:
// - fetchUserEvents: GET request to fetch user's liked/created events
// - fetchFriendEvents: GET request to fetch friends' events

function HomePage() {
    const [userEvents, setUserEvents] = useState([]);
    const [friendEvents, setFriendEvents] = useState([]);

    useEffect(() => {
      fetchUserEvents();
      fetchFriendEvents();
    }, []);

    const fetchUserEvents = async () => {
      // GET request to api/user for user events
    };

    const fetchFriendEvents = async () => {
      // GET request to api/user/friends for friend's events
    };

    return (
      <div>
        <h1>Home</h1>
        <div>
          {/* Render user and friend events */}
        </div>
      </div>
    );
  }

  export default HomePage;
