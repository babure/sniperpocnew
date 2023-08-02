import { React, useState } from "react";
import "./styles.css";

import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { addSeconds, startOfDay } from "date-fns";

import ItopsPage from "./pages/ItopsPage";
import IncidentPage from "./pages/IncidentPage";
import MetricsPage from "./pages/MetricsPage";
import ObservabilityPage from "./pages/ObservabilityPage";
import PatternPage from "./pages/PatternPage";
import PrcaPage from "./pages/PrcaPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import TicketsPage from "./pages/TicketsPage";

export default function App() {
  const currentDate = new Date();
  const todayMidnight = startOfDay(currentDate);
  const defaultStartDate = localStorage.getItem("startDate")
    ? new Date(localStorage.getItem("startDate"))
    : todayMidnight;
  const defaultEndDate = localStorage.getItem("endDate")
    ? new Date(localStorage.getItem("endDate"))
    : addSeconds(currentDate, 1);
  const [startTime, setStartTime] = useState(defaultStartDate);
  const [endTime, setEndTime] = useState(defaultEndDate);
  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      setStartTime(value[0]);
      setEndTime(value[1]);
    }
  };
  return (
    <div className="App">
      <Router>
        <Navbar
          startTime={startTime}
          endTime={endTime}
          handleDateChange={handleDateChange}
        />
        <div className="container blur-content">
          <Routes>
            <Route
              index
              element={<ItopsPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/incidents"
              element={<IncidentPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/metrics"
              element={<MetricsPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/observability"
              element={
                <ObservabilityPage startTime={startTime} endTime={endTime} />
              }
            />
            <Route
              exact
              path="/pattern"
              element={<PatternPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/prca"
              element={<PrcaPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/profile"
              element={<ProfilePage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/reports"
              element={<ReportsPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/settings"
              element={<SettingsPage startTime={startTime} endTime={endTime} />}
            />
            <Route
              exact
              path="/tickets"
              element={<TicketsPage startTime={startTime} endTime={endTime} />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
