/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "./redux/store";
import ErrorBoundary from "./Components/ErrorBoundary";
import { ThemeProvider } from "./Components/ThemeProvider";
import { ModeToggle } from "./Components/ToggleMode";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard";
import TaskList from "./Components/TaskList";
import TaskDetails from "./Components/TaskDetails";
import AuthPage from "./Components/AuthPage";
import EmailVerification from "./Components/EmailVerification";
import PasswordReset from "./Components/PasswordReset";
import TaskForm from "./Components/TaskForm";
import Notifications from "./Components/Notifications";
import ProfileSettings from "./Components/ProfileSettings";
import Demo from "./Components/Demo";
import NotFound from "./Components/NotFound";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "./Components/ui/toaster";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const App = ({ children }) => {
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
          "/dashboard",
          "/tasklist",
          "/task/:id",
          "/add-task",
          "/notifications",
          "/profile-settings",
        ].some((path) =>
          location.pathname.match(
            new RegExp(`^${path.replace((":id", ":token"), "[^/]+")}$`)
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
            <Route path="/dashboard" element={<Dashboard notify={notify} />} />
            <Route path="/tasklist" element={<TaskList />} />
            <Route path="/task/:id" element={<TaskDetails notify={notify} />} />
            <Route path="/login" element={<AuthPage notify={notify} />} />
            <Route path="/register" element={<AuthPage notify={notify} />} />
            <Route
              path="/verify"
              element={<EmailVerification notify={notify} />}
            />
            <Route
              path="/verify/:token"
              element={<EmailVerification notify={notify} />}
            />
            <Route
              path="/reset-password"
              element={<PasswordReset notify={notify} />}
            />
            <Route
              path="/reset-password/:token"
              element={<PasswordReset notify={notify} />}
            />
            <Route path="/add-task" element={<TaskForm notify={notify} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/profile-settings"
              element={<ProfileSettings notify={notify} />}
            />
            <Route path="/demo" element={<Demo />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <ModeToggle />
                <Layout />
                <Toaster />
                <ToastContainer />
                {children}
              </ThemeProvider>
            </Router>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
