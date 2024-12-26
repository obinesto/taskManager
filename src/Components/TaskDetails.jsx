import { useParams, useNavigate } from "react-router-dom";
import { useTasks, useUser, useUpdateTask } from "../hooks/useQueries";
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";
import bgImage from "../assets/bg-2.jpg";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: task, isLoading: taskLoading, error: taskError } = useTasks(id);
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const updateTaskMutation = useUpdateTask();

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        id,
        updatedTask: { status: newStatus },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (taskLoading || userLoading)
    return (
      <div className="flex flex-col justify-center items-center  min-h-screen bg-gray-100">
        <div className="spinner w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-[#764CE8] font-semibold text-3xl">Loading...</p>
      </div>
    );
  if (taskError || userError)
    return <p className="text-center">Error loading data.</p>;
  if (!task) return <p className="text-center">Task not found.</p>;

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
      <div className="md:ml-72 max-w-6xl mx-auto p-4 sm:p-6 bg-purple-900 rounded-lg shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#764CE8] mb-4">
          Task Details
        </h2>

        <div className="task-details-item mb-4">
          <strong className="block text-lg sm:text-xl text-[#111010]">
            Name:
          </strong>
          <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">
            {task.name}
          </span>
        </div>
        <div className="task-details-item mb-4">
          <strong className="block text-lg sm:text-xl text-[#111010]">
            Description:
          </strong>
          <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">
            {task.description}
          </span>
        </div>
        <div className="task-details-item mb-4">
          <strong className="block text-lg sm:text-xl text-[#111010]">
            Assigned To:
          </strong>
          <span className="text-[#C9C9C9] px-3 py-1 mt-1 rounded-md text-sm sm:text-base bg-[#764CE8]">
            {task.executedBySelf ? "Self" : task.assignedTo}
          </span>
        </div>
        <div className="task-details-item mb-6">
          <strong className="block text-lg sm:text-xl text-[#FEFEFE]">
            Status:
          </strong>
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
