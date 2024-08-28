import React from 'react';
import { Calendar } from 'antd';
import 'antd/dist/reset.css'; 

function AppCalendar() {
  return (
    <div className="small-calendar-container">
      <Calendar fullscreen={false} />
    </div>
  );
}

export default AppCalendar;
