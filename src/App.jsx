import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Components/Utils/AuthContext";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard";
import TaskList from "./Components/TaskList";
import TaskDetails from "./Components/TaskDetails";
import AuthPage from "./Components/Auth/AuthPage";
import TaskForm from "./Components/TaskForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const notify = (message, notificationType) =>
    toast(message, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      type: notificationType,
      style: {
        fontFamily: "'Poppins', sans-serif",
        borderRadius: "8px",
      },
    });
  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 bg-white p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasklist" element={<TaskList />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route
                path="/login"
                element={
                  <AuthPage
                    notify={(message, notificationType) =>
                      notify(message, notificationType)
                    }
                  />
                }
              />
              <Route
                path="/register"
                element={
                  <AuthPage
                    notify={(message, notificationType) =>
                      notify(message, notificationType)
                    }
                  />
                }
              />
              <Route
                path="/add-task"
                element={
                  <TaskForm
                    notify={(message, notificationType) =>
                      notify(message, notificationType)
                    }
                  />
                }
              />
            </Routes>
          </div>
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
