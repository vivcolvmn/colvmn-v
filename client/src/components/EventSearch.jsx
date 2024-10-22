// Search Events Component

// State:
// - searchTerm, searchResults

// Functions:
// - handleSearch: GET request to Seatgeek API for event search

function SearchEvents() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
      // GET request to search events
    };

    return (
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {/* Render search results */}
      </div>
    );
  }

  export default SearchEvents;
