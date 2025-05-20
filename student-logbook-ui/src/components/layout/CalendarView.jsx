import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles

export default function CalendarView() {
  const [date, setDate] = useState(new Date());

  // You can add logic here to highlight dates with logbook entries

  return (
    <div className="mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Logbook Submission Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        // Customize tileClassName to mark special dates if needed
      />
    </div>
  );
}
