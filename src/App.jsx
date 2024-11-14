import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import Dashboard from './Components/Dashboard/Dashboard';
import TaskList from './Components/TaskList/TaskList';
import Sidebar from './Components/Sidebar/Sidebar';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasklist" element={<TaskList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
