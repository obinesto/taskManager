/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAddTask, useUser, useUsers } from "../hooks/useQueries";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader";
import BgImage from "../assets/bg-4.jpg";

const TaskForm = ({ notify }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [task, setTask] = useState({
    name: "",
    description: "",
    executedBySelf: true,
    assignedTo: "",
    assignedBy: "",
  });

  const addTaskMutation = useAddTask();
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();

  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (checkToken) {
      return
    } else {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    if (user && task.executedBySelf) {
      setTask((prevTask) => ({
        ...prevTask,
        assignedTo: user.email,
        assignedBy: user.email,
      }));
    }
  }, [task.executedBySelf, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTaskMutation.mutateAsync(task);
      notify("Task created successfully", "success");
      setTask({
        name: "",
        description: "",
        executedBySelf: true,
        assignedTo: "",
        assignedBy: "",
      });
      navigate("/tasklist");
    } catch (error) {
      notify("Error creating task", "error");
      console.error("Error creating task:", error);
    }
  };

  if (userLoading || usersLoading) {
    return <Loader />;
  }
  if (userError || usersError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center items-center flex-col">
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


  return (
    <div
      className="min-h-screen p-6 shadow-lg rounded-lg opacity-95 px-2 md:py-4 py-10"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form onSubmit={handleSubmit} className="md:ml-72">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#764CE8] md:text-3xl">
          Create Task
        </h2>
        {addTaskMutation.error && (
          <p className="text-[#E45858] text-sm mb-4">
            {addTaskMutation.error.message}
          </p>
        )}

        <input
          type="text"
          name="name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Task Name"
          required
          className="w-full p-3 mb-4 border border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#764CE8] placeholder-[#8888A6] md:p-4"
        />

        <textarea
          name="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
          className="w-full p-3 mb-4 border border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#764CE8] placeholder-[#8888A6] md:p-4"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="executedBySelf"
            checked={task.executedBySelf}
            onChange={(e) =>
              setTask({ ...task, executedBySelf: e.target.checked })
            }
            className="mr-2 h-4 w-4 text-[#764CE8] bg-[#2B2B3D] border border-[#4A4A63] focus:ring-[#764CE8]"
          />
          <label className="text-sm text-[#2B2B3D] md:text-base">
            Executed by Self
          </label>
        </div>

        {!task.executedBySelf && (
          <select
            className="w-full p-3 mb-4 border border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#764CE8] placeholder-[#8888A6] md:p-4"
            value={task.assignedTo}
            onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            required
          >
            <option value="" disabled>
              Select a User
            </option>
            {users
              .filter((u) => user && u.email !== user.email)
              .map((u) => (
                <option key={u._id} value={u.email}>
                  {u.username}
                </option>
              ))}
          </select>
        )}

        <button
          type="submit"
          disabled={addTaskMutation.isLoading}
          className={`w-full p-3 text-white rounded-lg mt-4 transition-colors duration-200 ${
            addTaskMutation.isLoading
              ? "bg-[#4A4A63] cursor-not-allowed"
              : "bg-[#30A46C] hover:bg-[#25805B] focus:outline-none focus:ring-2 focus:ring-[#30A46C]"
          } md:p-4`}
        >
          {addTaskMutation.isLoading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
