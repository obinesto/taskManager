/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "./redux/store";
import { ThemeProvider } from "./Components/ThemeProvider";
import { ModeToggle } from "./Components/ToggleMode";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard";
import TaskList from "./Components/TaskList";
import TaskDetails from "./Components/TaskDetails";
import AuthPage from "./Components/AuthPage";
import PasswordReset from "./Components/PasswordReset";
import TaskForm from "./Components/TaskForm";
import Notifications from "./Components/Notifications";
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
        ["/dashboard", "/tasklist", "/task/:id", "/add-task", "/notifications"].some((path) =>
          location.pathname.match(new RegExp(`^${path.replace(":id", "[^/]+")}$`))
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
            <Route path="/task/:id" element={<TaskDetails notify={notify} />} />
            <Route path="/login" element={<AuthPage notify={notify} />} />
            <Route path="/register" element={<AuthPage notify={notify} />} />
            <Route path="/reset-password" element={<PasswordReset notify={notify} />} />
            <Route path="/add-task" element={<TaskForm notify={notify} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
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
  );
};

export default App;