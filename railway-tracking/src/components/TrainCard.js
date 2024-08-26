import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function TrainCard({ train }) {
  const [expanded, setExpanded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([train.Latitude, train.Longitude]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Function to fetch updated train data
  const fetchTrainData = async () => {
    try {
      const response = await fetch(`http://localhost:3309/train-data/${train.IOTid}`); // Fetch the updated data for this train
      const updatedTrain = await response.json();
      setCurrentLocation([updatedTrain.Latitude, updatedTrain.Longitude]);
    } catch (error) {
      console.error('Error fetching train data:', error);
    }
  };

  useEffect(() => {
    fetchTrainData(); // Fetch initial data

    // Set up an interval to fetch data every second
    const interval = setInterval(() => {
      fetchTrainData();
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [train.IOTid]);

  return (
    <div className="train-card">
      <div className="train-header" onClick={toggleExpand}>
        <h2>{train.TrainName} - Train No: {train.TripNo}</h2>
        <span className="arrow-icon">{expanded ? '▼' : '▶'}</span>
      </div>
      <div className="details">
        <div><span className="label">Current Location:</span> <span className="value">{train.LocationName || 'Unknown location'}</span></div>
        <div><span className="label">Departure Station:</span> <span className="value">{train.DepartureStation || 'N/A'}</span></div>
        <div><span className="label">Arrival Station:</span> <span className="value">{train.ArrivalStation || 'N/A'}</span></div>
        <div><span className="label">Next Arrival Station:</span> <span className="value">{train.NextArrivalStation || 'N/A'}</span></div>
        <div><span className="label">Next Station Arrival Time:</span> <span className="value">{train.Timestamp}</span></div>
        <div><span className="label">Duration:</span> <span className="value">{train.Duration}</span></div>
      </div>
      {expanded && (
        <div className="expanded-details">
          <div><span className="label">Speed:</span> <span className="value">{train.Speed} km/h</span></div>
          <div><span className="label">Status:</span> <span className="value">{train.EngineStatus}</span></div>
          <div><span className="label">Departure Time:</span> <span className="value">{train.DepartureTime}</span></div>
          <div><span className="label">Arrival Time:</span> <span className="value">{train.ArrivalTime}</span></div>
          <div><span className="label">Train Type:</span> <span className="value">{train.TrainType || 'Passenger'}</span></div>
          <div className="map-container">
            <MapContainer center={currentLocation} zoom={13} scrollWheelZoom={false} style={{ height: '200px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={currentLocation}>
                <Popup>
                  {train.TrainName}<br />{train.LocationName}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainCard;
