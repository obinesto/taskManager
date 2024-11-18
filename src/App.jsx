import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Components/Utils/AuthContext';
import Sidebar from './Components/Sidebar';
import LandingPage from './Components/LandingPage';
import Dashboard from './Components/Dashboard';
import TaskList from './Components/TaskList';
import TaskDetails from './Components/TaskDetails';
import LoginPage from './Components/Auth/LoginPage';
import RegisterPage from './Components/Auth/RegisterPage';
import TaskForm from './Components/TaskForm';


const App = () => {
  return (
    <AuthProvider>
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 bg-white p-6 overflow-y-auto">
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
    </AuthProvider>
  );
};

export default App;
