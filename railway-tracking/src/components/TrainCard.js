import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import Clock from './Clock'; // Assume Clock and Calendar components are created
import Calendar from './Calendar';
import L from 'leaflet'; // Import Leaflet for custom icons

const SOCKET_URL = 'http://localhost:3003';
const socket = io(SOCKET_URL);

function TrainCard({ train }) {
  const [expanded, setExpanded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([train.Latitude, train.Longitude]);
  const [status, setStatus] = useState(train.EngineStatus); // Default status

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    socket.on('train-update', (data) => {
      if (data.IOTid === train.IOTid) {
        setCurrentLocation([data.Latitude, data.Longitude]);
        setStatus(data.EngineStatus.toLowerCase()); // Update status based on received data
      }
    });

    return () => {
      socket.off('train-update');
    };
  }, [train.IOTid]);

  // Determine which status indicator should be active based on the current status
  const statusIndicators = {
    running: { green: true, yellow: false, red: false },
    stopped: { green: false, yellow: true, red: false },
    delayed: { green: false, yellow: false, red: true },
  }[status] || { green: false, yellow: false, red: false };

  const trainIcon = new L.Icon({
    iconUrl: '/images/train.png', // Replace with path to your train icon
    iconSize: [25, 25], // Adjust size if needed
    iconAnchor: [12, 24], // Adjust anchor if needed
    popupAnchor: [0, -20], // Adjust popup anchor if needed
  });

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
            <MapContainer center={currentLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={currentLocation} icon={trainIcon}>
                <Popup>
                  {train.TrainName}<br />{train.LocationName}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
      <div className="status-indicators">
        <div className={`status-indicator green ${statusIndicators.green ? 'blinking' : ''}`} />
        <div className={`status-indicator yellow ${statusIndicators.yellow ? 'blinking' : ''}`} />
        <div className={`status-indicator red ${statusIndicators.red ? 'blinking' : ''}`} />
      </div>
    </div>
  );
}

export default TrainCard;
