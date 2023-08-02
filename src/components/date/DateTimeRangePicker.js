import { DateRangePicker } from "rsuite";
import React, { useEffect } from "react";

import "./DateTimeRangePicker.css";

export default function DateTimeRangePicker({
  startTime,
  endTime,
  handleDateChange,
}) {
  const { afterToday } = DateRangePicker;

  useEffect(() => {
    localStorage.setItem("startDate", startTime.toISOString());
    localStorage.setItem("endDate", endTime.toISOString());
  }, [startTime, endTime]);

  return (
    <div className="date-range-picker-container">
      <DateRangePicker
        format="dd-MM-yyyy HH:mm"
        value={[startTime, endTime]}
        shouldDisableDate={afterToday()}
        onChange={handleDateChange}
        cleanable={false}
        placement="leftStart"
      />
    </div>
  );
}
