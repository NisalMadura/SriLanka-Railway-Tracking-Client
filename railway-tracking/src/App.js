import React, { useEffect, useState } from 'react';
import { getTrains } from './api';
import socket from './socket';
import TrainCard from './components/TrainCard';
import SearchBar from './components/SearchBar';
import Clock from './components/Clock';
import Calendar from './components/Calendar';
import './styles.css';

function App() {
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  
  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      const data = await getTrains();
      setTrains(data);
      setFilteredTrains(data);
    };
    
    fetchData();

    // Set up real-time updates
    socket.on('trainUpdate', (data) => {
      setTrains((prevTrains) => {
        const updatedTrains = prevTrains.map((train) =>
          train.IOTid === data.IOTid ? { ...train, ...data } : train
        );
        return updatedTrains;
      });
    });

    return () => {
      socket.off('trainUpdate');
    };
  }, []);

  const handleSearch = (query) => {
    const filtered = trains.filter((train) =>
      train.TrainName.toLowerCase().includes(query.toLowerCase()) ||
      train.TripNo.toLowerCase().includes(query.toLowerCase())
      
    );
    setFilteredTrains(filtered);
  };

  return (
    <div className="App">
      <div className="navbar">
        <div className="logo">CeylonRailView</div>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="train-list">
        {filteredTrains.map((train) => (
          <TrainCard key={train.IOTid} train={train} />
        ))}
      </div>
      
    </div>
  );
}

export default App;
