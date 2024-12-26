/* eslint-disable react/prop-types */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTasks, useUser, useUpdateTask } from "../hooks/useQueries";
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";
import bgImage from "../assets/bg-2.jpg";

const TaskDetails = ({notify}) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { id } = useParams();

  const { data: task, isLoading: taskLoading, error: taskError } = useTasks(id);
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const updateTaskMutation = useUpdateTask();

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        id,
        updatedTask: { status: newStatus }
      });
      notify(`Task ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      notify("Error updating task status", "error");
    }
  };

  if (taskLoading || userLoading)
    return (
      <div className="flex flex-col justify-center items-center  min-h-screen bg-gray-100">
        <div className="spinner w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-[#764CE8] font-semibold text-3xl">Loading...</p>
      </div>
    );
    if (userError || taskError) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center text-xl font-semibold text-slate-900">
              Oops! Something went wrong.
            </p>
            <p className="text-center text-slate-800 mt-4">
              Error loading data. Kindly refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    if (!task) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center items-center flex-col">
            <p className="text-center text-xl font-semibold text-slate-900">
              Task not found
            </p>
            <p className="text-center text-slate-800 mt-4">
              The task you&apos;re looking for could not be found or does not exist.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
    

  return (
    <div
      className="min-h-screen px-2 md:py-4 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="md:ml-72 max-w-6xl mx-auto p-4 sm:p-6 bg-purple-800 rounded-lg shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Task Details
        </h2>

        <div className="mb-6 flex items-center gap-2">
          <strong className="text-lg sm:text-xl text-black">Name:</strong>
          <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">
            {task.name}
          </span>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <strong className="text-lg sm:text-xl text-black">
            Description:
          </strong>
          <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8] capitalize">
            {task.description}
          </span>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <strong className="text-lg sm:text-xl text-black">
            Assigned To:
          </strong>
          <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8] capitalize">
            {task.executedBySelf ? "Self" : task.assignedTo}
          </span>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <strong className="text-lg sm:text-xl text-black">Status:</strong>
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
                  You can only monitor the progress of tasks assigned to other
                  users.
                  <br /> Task: {task.status}
                </p>
              )}
            </>
          )}

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-gray-900 text-[#FEFEFE] py-2 px-4 rounded-md hover:bg-[#1A1A1A] flex items-center justify-center mt-6 sm:mt-0"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
