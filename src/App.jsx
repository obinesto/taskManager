import { useMemo } from "react";
import {BrowserRouter as Router,Route,Routes,useLocation} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./redux/store";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard";
import TaskList from "./Components/TaskList";
import TaskDetails from "./Components/TaskDetails";
import AuthPage from "./Components/AuthPage";
import TaskForm from "./Components/TaskForm";
import NotFound from "./Components/NotFound";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const App = () => {
  const notify = (message, notificationType) =>
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
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
    const showSidebar = useMemo(
      () =>
        [
          "/login",
          "/register",
          "/dashboard",
          "/tasklist",
          "/task/:id",
          "/add-task",
        ].some((path) =>
          location.pathname.match(
            new RegExp(`^${path.replace(":id", "[^/]+")}$`)
          )
        ),
      [location.pathname]
    );
    return (
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="overflow-y-auto flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasklist" element={<TaskList />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/login" element={<AuthPage notify={notify} />} />
            <Route path="/register" element={<AuthPage notify={notify} />} />
            <Route path="/add-task" element={<TaskForm notify={notify} />} />
            <Route path="/*" element={<NotFound />}></Route>{" "}
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout />
          <ToastContainer />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
