import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles

export default function CalendarView() {
  const [date, setDate] = useState(new Date());

  // You can add logic here to highlight dates with logbook entries

  return (
    <div className="mt-8 px-4 overflow-x-hidden"> {/* ✅ Prevents horizontal scroll */}
      <div className="p-4 bg-white rounded shadow-md w-full max-w-full overflow-hidden">
        <h2 className="text-xl font-semibold mb-4 break-words">Logbook Submission Calendar</h2>
        <div className="w-full max-w-full">
          <Calendar
            onChange={setDate}
            value={date}
          />
        </div>
      </div>
  </div>

  );
}
