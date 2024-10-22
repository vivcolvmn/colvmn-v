// Friend Request Component

// State:
// - friendRequests (array of friend request objects)

// Functions:
// - fetchFriendRequests: GET request to fetch pending friend requests
// - handleAccept: POST request to accept a friend request
// - handleReject: DELETE request to reject a friend request

function FriendRequests() {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
      fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
      // GET request to fetch friend requests
    };

    const handleAccept = async (requestId) => {
      // POST request to accept friend request
    };

    const handleReject = async (requestId) => {
      // DELETE request to reject friend request
    };

    return (
      <div>
        <h2>Pending Friend Requests</h2>
        {friendRequests.map((request) => (
          <div key={request.id}>
            <p>{request.senderName} wants to be friends!</p>
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </div>
        ))}
      </div>
    );
  }

  export default FriendRequests;
