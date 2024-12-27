import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/taskService";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logoutSuccess } from "../redux/actions/authActions";
import { fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure, fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure} from "../redux/actions/taskActions";

// Fetch the authenticated user
export const useUser = () => {
  const authState = useSelector((state) => state.auth);
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("tm-cd-token") || authState.token;
      if (!token) return null;

      try {
        const { data } = await axios.get("/auth/me");
        return data;
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};


// Fetch tasks with optional filter
export const useTasks = (filterOrId = "") => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["tasks", filterOrId],
    queryFn: async () => {
      dispatch(fetchTasksRequest());
      try {
        if (typeof filterOrId === 'string' && filterOrId.match(/^[0-9a-fA-F]{24}$/)) {
          // If filterOrId is a valid MongoDB ObjectId, fetch a single task
          const { data } = await axios.get(`/tasks/${filterOrId}`);
          dispatch(fetchTasksSuccess([data])); // Wrap in array to match existing action
          return data;
        } else {
          // Otherwise, fetch tasks with optional filter
          const { data } = await axios.get("/tasks", {
            params: filterOrId ? { status: filterOrId } : {},
          });
          dispatch(fetchTasksSuccess(data));
          return data;
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        dispatch(fetchTasksFailure(error.message || "Failed to fetch tasks"));
        throw error;
      }
    },
  });
};

// Fetch all users
export const useUsers = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      dispatch(fetchUsersRequest());
      try {
        const { data } = await axios.get("/auth/users");
        dispatch(fetchUsersSuccess(data));
        return data;
      } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(fetchUsersFailure(error.message || "Failed to fetch users"));
        throw error;
      }
    },
  });
};

// Add a new task
export const useAddTask = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (newTask) => {
      dispatch(fetchTasksRequest());
      try {
        const { data } = await axios.post("/tasks", newTask);
        dispatch(fetchTasksSuccess([data])); // Wrap in array to match existing action
        return data;
      } catch (error) {
        console.error("Error adding task:", error);
        dispatch(fetchTasksFailure(error.message || "Failed to add task"));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Error adding task:", error);
    },
  });
};

// Update an existing task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ id, updatedTask }) => {
      dispatch(fetchTasksRequest());
      try {
        const { data } = await axios.patch(`/tasks/${id}`, updatedTask);
        dispatch(fetchTasksSuccess([data])); // Wrap in array to match existing action
        return data;
      } catch (error) {
        console.error("Error updating task:", error);
        dispatch(fetchTasksFailure(error.message || "Failed to update task"));
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tasks", variables.id]);
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });
};

// User login
export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData) => {
      try {
        const { data } = await axios.post("/auth/login", loginData);
        return data;
      } catch (error) {
        if (error.response) {
          console.error("Login error response:", error.response.data);
          throw new Error(error.response.data.message || "Login failed");
        } else if (error.request) {
          console.error("Login error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Login error:", error.message);
          throw new Error("Error setting up the request");
        }
      }
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.token));
      localStorage.setItem("tm-cd-token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error) => {
      console.error("Error logging in:", error.message);
    },
  });
};

// User registration
export const useRegister = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registerData) => {
      try {
        const { data } = await axios.post("/auth/register", registerData);
        return data;
      } catch (error) {
        console.error("Error registering:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.token));
      localStorage.setItem("tm-cd-token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error) => {
      console.error("Error registering:", error.message);
    },
  });
};

// User logout
export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return async () => {
    const checkToken =
      typeof window !== "undefined" ? localStorage.getItem("tm-cd-token") : null;
    if (checkToken) {
      try {
        dispatch(logoutSuccess());
        queryClient.clear();
        localStorage.removeItem("tm-cd-token");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };
};
