import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./Utils/taskService";
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";
import bgImage from "../assets/bg-2.jpg";

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
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xlmx-auto p-4 sm:p-6 bg-[#0d0d1d58] rounded-lg shadow-xl opacity-95 ">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#764CE8] mb-4">
          Task Details
        </h2>

        <div className="task-details-item mb-4">
      <strong className="block text-lg sm:text-xl text-[#111010]">Name:</strong>
      <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">{task.name}</span>
        </div>
        <div className="task-details-item mb-4">
      <strong className="block text-lg sm:text-xl text-[#111010]">Description:</strong>
      <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">{task.description}</span>
        </div>
        <div className="task-details-item mb-4">
      <strong className="block text-lg sm:text-xl text-[#111010]">Assigned To:</strong>
      <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">
            {task.executedBySelf ? "Self" : task.assignedTo}
          </span>
        </div>
        <div className="task-details-item mb-6">
      <strong className="block text-lg sm:text-xl text-[#FEFEFE]">Status:</strong>
          <span
            className={`inline-block px-3 py-1 mt-1 rounded-full text-sm sm:text-base text-white 
          ${
            task.status === "Completed"
              ? "bg-[#30A46C]"
              : task.status === "In Progress"
              ? "bg-[#D97706]"
              : task.status === "Pending"
              ? "bg-[#2563EB]"
              : "bg-[#E45858]"
          }`}
          >
            {task.status}
          </span>
        </div>

        <div className="task-details-actions space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          {task.executedBySelf ? (
            task.status === "In Progress" ? (
              <button
                onClick={() => handleUpdateStatus("Completed")}
                className="w-full sm:w-auto bg-[#30A46C] text-white py-2 px-4 rounded-md hover:bg-[#25805B] flex items-center justify-center"
              >
                <FaCheck className="mr-2" /> Mark as Completed
              </button>
            ) : (
          <p className="text-[#C9C9C9]">This task is already completed.</p>
            )
          ) : (
            <>
              {task.assignedTo === user.email ? (
                <>
                  {task.status === "Pending" && (
                    <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                      <button
                        onClick={() => handleUpdateStatus("In Progress")}
                        className="w-full sm:w-auto bg-[#764CE8] text-white py-2 px-4 rounded-md hover:bg-[#6A6A71] flex items-center justify-center"
                      >
                        <FaCheck className="mr-2" /> Accept Task
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("Rejected")}
                        className="w-full sm:w-auto bg-[#E45858] text-white py-2 px-4 rounded-md hover:bg-[#CC3E3E] flex items-center justify-center"
                      >
                        <FaTimes className="mr-2" /> Reject Task
                      </button>
                    </div>
                  )}
                  {task.status === "In Progress" && (
                    <button
                      onClick={() => handleUpdateStatus("Completed")}
                      className="w-full sm:w-auto bg-[#30A46C] text-white py-2 px-4 rounded-md hover:bg-[#25805B] flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" /> Mark as Completed
                    </button>
                  )}
                  {task.status === "Rejected" && (
                <p className="text-[#C9C9C9]">This task was rejected.</p>
                  )}
                  {task.status === "Completed" && (
                <p className="text-[#C9C9C9]">This task is completed.</p>
                  )}
                </>
              ) : (
            <p className="text-[#C9C9C9]">
              You can only monitor the progress of tasks assigned to other users.
                  <br /> Task: {task.status}
                </p>
              )}
            </>
          )}

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-[#252525] text-[#FEFEFE] py-2 px-4 rounded-md hover:bg-[#1A1A1A] flex items-center justify-center mt-6 sm:mt-0"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
