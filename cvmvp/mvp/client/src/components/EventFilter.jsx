import React, { useState } from 'react';

const EventFilter = ({ onFilter }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    date: '',
    band: '',
    venue: '',
    liked: false,
  });

  const handleInputChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFilterData({ ...filterData, liked: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filterData);
  };

  return (
    <div>
      <button onClick={() => setShowFilter(!showFilter)}>
        {showFilter ? 'Hide Filter' : 'Filter Events'}
      </button>

      {showFilter && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="date" placeholder="Date" value={filterData.date} onChange={handleInputChange} />
          <input type="text" name="band" placeholder="Band" value={filterData.band} onChange={handleInputChange} />
          <input type="text" name="venue" placeholder="Venue" value={filterData.venue} onChange={handleInputChange} />
          <label className="inline-label">
            <span>Liked Events Only</span>
            <input type="checkbox" name="liked" checked={filterData.liked} onChange={handleCheckboxChange} />
          </label>
          <button type="submit">Search</button>
        </form>
      )}
    </div>
  );
};

export default EventFilter;
