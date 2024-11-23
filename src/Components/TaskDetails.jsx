import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./taskService";
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/tasks/${id}`);
        setTask(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task:", error);
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(`/tasks/${id}`, { status: newStatus });
      setTask(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!task) return <p className="text-center">Task not found.</p>;

  return (
    <div className="task-details-container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">
        Task Details
      </h2>

      <div className="task-details-item mb-4">
        <strong className="text-lg">Name:</strong> {task.name}
      </div>
      <div className="task-details-item mb-4">
        <strong className="text-lg">Description:</strong> {task.description}
      </div>
      <div className="task-details-item mb-4">
        <strong className="text-lg">Assigned To:</strong>{" "}
        {task.executedBySelf ? "Self" : task.assignedTo}
      </div>
      <div className="task-details-item mb-6">
        <strong className="text-lg">Status:</strong>
        <span
          className={`px-3 py-1 rounded-full text-white 
            ${
              task.status === "Completed"
                ? "bg-green-500"
                : task.status === "In Progress"
                ? "bg-yellow-500"
                : task.status === "Pending"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
        >
          {task.status}
        </span>
      </div>

      <div className="task-details-actions mb-6">
        {task.executedBySelf ? (
          // Actions for self-assigned tasks
          task.status === "In Progress" ? (
            <button
              onClick={() => handleUpdateStatus("Completed")}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
            >
              <FaCheck className="mr-2" /> Mark as Completed
            </button>
          ) : (
            <p className="text-gray-500">This task is already completed.</p>
          )
        ) : (
          // Actions for tasks assigned to others
          <>
            {task.assignedTo === user.email ? (
              <>
                {task.status === "Pending" && (
                  <div className="flex flex-row items-center justify-between">
                    <button
                      onClick={() => handleUpdateStatus("In Progress")}
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <FaCheck className="mr-2" /> Accept Task
                    </button>

                    <button
                      onClick={() => handleUpdateStatus("Rejected")}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center"
                    >
                      <FaTimes className="mr-2" /> Reject Task
                    </button>
                  </div>
                )}
                {task.status === "In Progress" && (
                  <button
                    onClick={() => handleUpdateStatus("Completed")}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FaCheck className="mr-2" /> Mark as Completed
                  </button>
                )}
                {task.status === "Rejected" && (
                  <p className="text-gray-500">This task was rejected.</p>
                )}
                {task.status === "Completed" && (
                  <p className="text-gray-500">This task is completed.</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">
                You are not assigned to this task.
              </p>
            )}
          </>
        )}

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center mt-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
