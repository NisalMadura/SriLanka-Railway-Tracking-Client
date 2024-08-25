import React from 'react';

function TrainCard({ train }) {
  return (
    <div className="train-card">
      <h2>{train.TrainName} (Trip No: {train.TripNo})</h2>
      <div className="details">
        <div><span className="label">Current Location:</span> <span className="value">{train.LocationName}</span></div>
        <div><span className="label">Departure Station:</span> <span className="value">{train.DepartureStation || 'N/A'}</span></div>
        <div><span className="label">Arrival Station:</span> <span className="value">{train.ArrivalStation || 'N/A'}</span></div>
        <div><span className="label">Next Arrival Station:</span> <span className="value">{train.NextArrivalStation || 'N/A'}</span></div>
        <div><span className="label">Time:</span> <span className="value">{train.Timestamp}</span></div>
        <div><span className="label">Duration:</span> <span className="value">{train.Duration}</span></div>
      </div>
    </div>
  );
}

export default TrainCard;
