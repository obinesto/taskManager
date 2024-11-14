import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Dashboard from './Components/Dashboard';
import TaskList from './Components/TaskList';
import Sidebar from './Components/Sidebar';
import LoginPage from './Components/Auth/LoginPage';
import RegisterPage from './Components/Auth/RegisterPage';
import TaskForm from './Components/TaskForm';
import TaskDetails from "./Components/TaskDetails";

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
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-task" element={<TaskForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
