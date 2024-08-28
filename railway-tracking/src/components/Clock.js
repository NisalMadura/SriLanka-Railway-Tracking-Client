import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const options = { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = time.toLocaleTimeString('en-US', options);

  return (
    <div className="clock">
      <h3>Sri Lankan Time</h3>
      <p>{timeString}</p>
    </div>
  );
}

export default Clock;
