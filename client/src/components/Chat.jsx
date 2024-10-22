// Chat Component

// State:
// - messages (array of chat messages between users)
// - newMessage (current message user is typing)

// Functions:
// - fetchChatHistory: GET request to fetch chat history between users
// - sendMessage: POST request to send a new message using Socket.IO

function Chat({ senderId, receiverId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
      fetchChatHistory();
      // Set up real-time message listening via Socket.IO
      const socket = io.connect();
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => socket.disconnect();
    }, [senderId, receiverId]);

    const fetchChatHistory = async () => {
      // GET request to fetch previous chat history
    };

    const sendMessage = async () => {
      if (newMessage.trim()) {
        // POST message to server via Socket.IO
        const socket = io.connect();
        socket.emit('sendMessage', { senderId, receiverId, message: newMessage });
        setMessages((prevMessages) => [...prevMessages, { senderId, message: newMessage }]);
        setNewMessage(''); // Clear input field
      }
    };

    return (
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.senderId === senderId ? 'You' : 'Friend'}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    );
  }

  export default Chat;
