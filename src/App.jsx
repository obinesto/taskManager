import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import Dashboard from './Components/Dashboard/Dashboard';
import TaskList from './Components/TaskList/TaskList';
import Sidebar from './Components/Sidebar/Sidebar';
import LoginPage from './Components/Auth/LoginPage';
import RegisterPage from './Components/Auth/RegisterPage';
import TaskForm from './Components/TaskForm/TaskForm';

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
