import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Register from "./components/Register";
import Members from "./components/Members"; // Import Members component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/menu" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={isAuthenticated ? <Menu /> : <Navigate to="/" />} />
        <Route path="/menu/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/menu/calendar" element={isAuthenticated ? <Calendar /> : <Navigate to="/" />} />
        <Route path="/menu/members" element={isAuthenticated ? <Members /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
