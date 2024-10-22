// Friends List Component

// State:
// - friendsList

// Functions:
// - fetchFriendsList: GET request to retrieve friends
// - handleAddFriend: POST request to add a friend
// - handleRemoveFriend: DELETE request to remove a friend

function FriendsList() {
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
      fetchFriendsList();
    }, []);

    const fetchFriendsList = async () => {
      // GET request to fetch friends
    };

    const handleAddFriend = async (friendId) => {
      // POST request to add a friend
    };

    const handleRemoveFriend = async (friendId) => {
      // DELETE request to remove a friend
    };

    return (
      <div>
        <h2>Friends</h2>
        {/* Render friends list */}
      </div>
    );
  }

  export default FriendsList;
