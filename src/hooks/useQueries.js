import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/taskService";
import { useDispatch, useSelector } from "react-redux";
import * as Sentry from "@sentry/react";
import {
  registerSuccess,
  loginSuccess,
  logoutSuccess,
} from "../redux/actions/authActions";
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  fetchUserNotificationRequest,
  fetchUserNotificationSuccess,
  fetchUserNotificationFailure,
} from "../redux/actions/taskActions";

// User login
export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loginData) => {
      try {
        Sentry.addBreadcrumb({
          category: "auth",
          message: "User login attempt",
          level: "info",
        });

        const { data } = await axios.post("/auth/login", loginData);
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;
          if (status === 400 || message.includes("Invalid email or password")) {
            throw new Error("Email does not exist. Kindly register");
          }
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
      dispatch(loginSuccess(data.token, data.user));
      localStorage.setItem("token", data.token);
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
        Sentry.addBreadcrumb({
          category: "auth",
          message: "User registration attempt",
          level: "info",
        });
        const { data } = await axios.post("/auth/register", registerData);
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data.message;
          if (status === 400 || message.includes("Email already exists")) {
            throw new Error(
              "This email is already registered. Please try a different email."
            );
          }
        } else if (error.request) {
          throw new Error(
            "Unable to connect to the server. Please try again later."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }
    },
    onSuccess: (data) => {
      dispatch(registerSuccess(data.token, data.user));
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      console.error("Error registering:", error.message);
    },
  });
};

// Google Sign-in
export const useGoogleLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentialResponse) => {
      try {
        Sentry.addBreadcrumb({
          category: "auth",
          message: "Google sign-in attempt",
          level: "info",
        });
        const { data } = await axios.post("/v1/google", {
          credential: credentialResponse.credential,
        });
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response?.status === 404) {
          console.error(
            "API endpoint not found. Please check your backend routes."
          );
          throw new Error(
            "Google login service is not available. Please try again later."
          );
        }
        if (error.response) {
          console.error("Google login error response:", error.response.data);
          throw new Error(error.response.data.message || "Google login failed");
        } else if (error.request) {
          console.error("Google login error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Google login error:", error.message);
          throw new Error("Error setting up the request");
        }
      }
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.token, data.user));
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error) => {
      console.error("Error logging in with Google:", error.message);
    },
  });
};

// Verify email with token
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async ({ token }) => {
      try {
        Sentry.addBreadcrumb({
          category: "auth",
          message: "Verify email attempt",
          level: "info",
        });
        const { data } = await axios.get(`/auth/verify/${token}`);
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          console.error(
            "Email verification error response:",
            error.response.data
          );
          throw new Error(
            error.response.data.message || "Email verification failed"
          );
        } else if (error.request) {
          console.error("Email verification error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Email verification error:", error.message);
          throw new Error("Error setting up the request");
        }
      }
    },
    onSuccess: () => {
      console.log("Email verified successfully");
    },
    onError: (error) => {
      console.error("Error verifying email:", error.message);
    },
  });
};

// Resend verification email
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      try {
        Sentry.addBreadcrumb({
          category: "auth",
          message: "Resend verification email attempt",
          level: "info",
        });
        const { data } = await axios.post("/auth/resend-verification", {
          email,
        });
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          console.error(
            "Resend verification error response:",
            error.response.data
          );
          throw new Error(
            error.response.data.message || "Failed to resend verification email"
          );
        } else if (error.request) {
          console.error("Resend verification error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Resend verification error:", error.message);
          throw new Error("Error setting up the request");
        }
      }
    },
    onSuccess: () => {
      console.log("Verification email resent successfully");
    },
    onError: (error) => {
      console.error("Error resending verification email:", error.message);
    },
  });
};

// Fetch the authenticated user
export const useUser = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      dispatch(fetchUserRequest());
      const token = localStorage.getItem("token") || authState.token;
      if (!token) {
        return null;
      }
      try {
        Sentry.addBreadcrumb({
          message: "Fetch user request",
          level: "info",
        });
        const { data } = await axios.get("/auth/me");
        dispatch(fetchUserSuccess(data));
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          if (
            error.response.message === "Unauthorized" ||
            error.response.message === "Invalid token"
          ) {
            dispatch(logoutSuccess());
          } else {
            console.error("Error response:", error.response.data);
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
        dispatch(fetchUserFailure(error.message || "Failed to fetch user"));
        return null;
      }
    },
    // retry: false,
    // refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 60 * 12, // Cache data for 12 hours to reduce the number of network requests and improve performance
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
        Sentry.addBreadcrumb({
          message: "Fetch users request",
          level: "info",
        });
        const { data } = await axios.get("/auth/users");
        dispatch(fetchUsersSuccess(data));
        return data;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching users:", error);
        dispatch(fetchUsersFailure(error.message || "Failed to fetch users"));
        throw error;
      }
    },
  });
};

// Password Reset Request
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      try {
        Sentry.addBreadcrumb({
          message: "Password reset request",
          level: "info",
        });
        const { data } = await axios.post("/auth/forgot-password", { email });
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          console.error("Password reset error response:", error.response.data);
          throw new Error(
            error.response.data.message || "Password reset request failed"
          );
        } else if (error.request) {
          console.error("Password reset error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Password reset error:", error.message);
          throw new Error("Error setting up the request");
        }
      }
    },
    onSuccess: () => {
      console.log("Password reset email sent successfully");
    },
    onError: (error) => {
      console.error("Error sending password reset email:", error.message);
    },
  });
};

// Update password with reset token
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({ token, password }) => {
      try {
        Sentry.addBreadcrumb({
          message: "Update password with reset token",
          level: "info",
        });
        const { data } = await axios.post(`/auth/reset-password/${token}`, {
          password,
        });
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          console.error("Password update error response:", error.response.data);
          throw new Error(
            error.response.data.message || "Failed to update password"
          );
        } else if (error.request) {
          console.error("Password update error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Password update error:", error.message);
          throw new Error("Error setting up the request");
        }
      }
    },
    onSuccess: () => {
      console.log("Password updated successfully");
    },
    onError: (error) => {
      console.error("Error updating password:", error.message);
    },
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData) => {
      try {
        Sentry.addBreadcrumb({
          message: "Update user profile",
          level: "info",
        });
        const { data } = await axios.put("/auth/update-profile", updatedData);
        return data;
      } catch (error) {
        Sentry.captureException(error);
        if (error.response) {
          console.error("Profile update error response:", error.response.data);
          throw new Error(
            error.response.data.message || "Failed to update profile"
          );
        } else if (error.request) {
          console.error("Profile update error request:", error.request);
          throw new Error("No response received from server");
        } else {
          console.error("Profile update error:", error.message);
          throw new Error("Error updating profile");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error.message);
    },
  });
};

// User logout
export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return async () => {
    const checkToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (checkToken) {
      try {
        dispatch(logoutSuccess());
        queryClient.clear();
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };
};

// Fetch tasks with optional filter
export const useTasks = (filterOrId = "") => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["tasks", filterOrId],
    queryFn: async () => {
      dispatch(fetchTasksRequest());
      try {
        Sentry.addBreadcrumb({
          category: "tasks",
          message: "Fetching tasks",
        });
        if (
          typeof filterOrId === "string" &&
          filterOrId.match(/^[0-9a-fA-F]{24}$/)
        ) {
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
        Sentry.captureException(error);
        console.error("Error fetching tasks:", error);
        dispatch(fetchTasksFailure(error.message || "Failed to fetch tasks"));
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
        Sentry.addBreadcrumb({
          category: "tasks",
          message: "Adding new task",
        });
        const { data } = await axios.post("/tasks", newTask);
        dispatch(fetchTasksSuccess([data]));
        return data;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error adding task:", error);
        dispatch(fetchTasksFailure(error.message || "Failed to add task"));
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks", data._id]);
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
        Sentry.addBreadcrumb({
          category: "tasks",
          message: "Updating existing task",
        });
        const { data } = await axios.patch(`/tasks/${id}`, updatedTask);
        dispatch(fetchTasksSuccess([data]));
        return data;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error updating task:", error);
        dispatch(fetchTasksFailure(error.message || "Failed to update task"));
        throw error;
      }
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries(["tasks", variables.id]);
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });
};

// fetch user notification
export const useFetchUserNotification = (userEmail) => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["notifications", userEmail],
    queryFn: async () => {
      dispatch(fetchUserNotificationRequest());
      try {
        Sentry.addBreadcrumb({
          category: "notifications",
          message: "Fetching user notifications",
        });
        const { data } = await axios.get(`/notifications/${userEmail}`);
        dispatch(fetchUserNotificationSuccess(data));
        return data;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching user notification:", error);
        dispatch(
          fetchUserNotificationFailure(
            error.message || "Failed to fetch user notification"
          )
        );
        throw error;
      }
    },
  });
};

// mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (notificationId) => {
      dispatch(fetchUserNotificationRequest());
      try {
        Sentry.addBreadcrumb({
          category: "notifications",
          message: "Marking notification as read",
        });
        const { data } = await axios.patch(`/notifications/${notificationId}`, {
          isRead: true,
        });
        dispatch(fetchUserNotificationSuccess(data));
        return data;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error marking notification as read:", error);
        dispatch(
          fetchUserNotificationFailure(
            error.message || "Failed to mark notification as read"
          )
        );
        throw error;
      }
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries(["notifications", variables.id]);
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
    },
  });
};
