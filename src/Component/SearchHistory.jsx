import React, { useState, useEffect } from 'react';
import { getVideosBySearchQuery } from '../../Api/fetch';  

export default function SearchHistory() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnails, setThumbnails] = useState([]);  

  useEffect(() => {
    const storedSearchHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );
    setSearchHistory(storedSearchHistory);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const updatedSearchHistory = [...searchHistory, searchTerm];
    localStorage.setItem("searchHistory", JSON.stringify(updatedSearchHistory));
    setSearchHistory(updatedSearchHistory);
    setSearchTerm(''); 
  };

  const handleSearchTermClick = async (clickedTerm) => {
    try {
    const results = await getVideosBySearchQuery(clickedTerm);
    if (results && results.items) {
      setThumbnails(results.items);
    }
  } catch (error) {
    console.error("Error fetching videos", error)
  }
  };

  return (
    <div>
      <h2>Search History</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchHistory.map((term, index) => (
          <li key={index} onClick={() => { console.log("Term clicked:", term); handleSearchTermClick(term); }}>
            {term.searchTerm}
          </li>
        ))}
      </ul>
      <div>
        {thumbnails.map((video, index) => (
          <div key={index}>
            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
            <p>{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
