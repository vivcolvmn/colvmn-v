// Event Detail Component

// Props:
// - eventId (ID of the event)

// State:
// - eventDetails (object containing event info)

// Functions:
// - fetchEventDetails: GET request to fetch detailed event info

function EventDetail({ eventId }) {
    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
      fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
      // GET request to retrieve event details using eventId
    };

    if (!eventDetails) return <div>Loading...</div>;

    return (
      <div>
        <h2>{eventDetails.artist}</h2>
        <p>Date: {eventDetails.date}</p>
        <p>Venue: {eventDetails.venue_name}</p>
        <p>Address: {eventDetails.venue_address}</p>
        <p>Time: {eventDetails.time}</p>
        <p>Cost: ${eventDetails.cost}</p>
      </div>
    );
  }

  export default EventDetail;
