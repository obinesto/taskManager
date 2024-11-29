import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
      position: "top-right",
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

  const Layout = () => {
    const location = useLocation();

    const showSidebar = [
      "/login",
      "/register",
      "/dashboard",
      "/tasklist",
      "/task/:id",
      "/add-task",
    ].some((path) =>
      location.pathname.match(new RegExp(`^${path.replace(":id", "[^/]+")}$`))
    );

    return (
      <div className="flex min-h-screen bg-[#252525]">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasklist" element={<TaskList />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/login" element={<AuthPage notify={notify} />} />
            <Route path="/register" element={<AuthPage notify={notify} />} />
            <Route path="/add-task" element={<TaskForm notify={notify} />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <Layout />
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
};

export default App;
