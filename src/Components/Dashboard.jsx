import { useMemo, useCallback, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaPlus } from "react-icons/fa";
import { useUser, useTasks } from "../hooks/useQueries";
import bgImage from "../assets/bg-2.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login");
  }
}, [isAuthenticated, navigate]);
 
  const { isLoading: userLoading } = useUser();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  
  const taskStats = useMemo(() => {
    if (!tasks) return { inProgress: 0, completed: 0, pending: 0, rejected: 0 };
    return {
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      rejected: tasks.filter((task) => task.status === "Rejected").length,
    };
  }, [tasks]);

  const dataOne = useMemo(
    () => [
      { name: "In Progress", value: taskStats.inProgress },
      { name: "Completed", value: taskStats.completed },
    ],
    [taskStats.inProgress, taskStats.completed]
  );

  const dataTwo = useMemo(
    () => [
      { name: "Pending", value: taskStats.pending },
      { name: "Rejected", value: taskStats.rejected },
    ],
    [taskStats.pending, taskStats.rejected]
  );

  const colorsOne = ["#2563eb", "#16a34a"];
  const colorsTwo = ["#ca8a04", "#dc2626"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    },
    [RADIAN]
  );

  return userLoading || tasksLoading ? (
    <div className="flex flex-col justify-center items-center  min-h-screen bg-gray-100">
      <div className="spinner w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="text-[#764CE8] font-semibold text-3xl">Loading...</p>
    </div>
  ) : (
    <div
      className="min-h-screen px-2 md:py-4 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto bg-[#FEFEFE] p-4 sm:p-6 rounded-lg shadow-lg border border-[#C2C1CC] opacity-95">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#764CE8] mb-4">
          Dashboard
        </h1>
        <p className="text-base sm:text-lg text-[#6A6A71] mb-6">
          Stay updated with your task progress and manage your work efficiently.
        </p>

        {/* Task Overview - Pie Chart */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#252525] mb-4">
            Task Overview
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <PieChart
              width={320}
              height={320}
              className="w-full bg-[#F8F8F9] rounded-lg border-2 border-[#764CE8] shadow-md"
            >
              <Pie
                data={dataOne}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dataOne.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorsOne[index % colorsOne.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            <PieChart
              width={320}
              height={320}
              className="w-full bg-[#F8F8F9] rounded-lg border-2 border-[#764CE8] shadow-md"
            >
              <Pie
                data={dataTwo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dataTwo.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorsTwo[index % colorsTwo.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg920:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300 bg-[#2563eb]">
            <h3 className="text-sm sm:text-lg font-semibold text-[#FEFEFE]">
              In Progress
            </h3>
            <p className="text-xl sm:text-2xl text-[#FEFEFE]">
              {taskStats.inProgress}
            </p>
          </div>
          <div className="bg-[#16a34a] p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-sm sm:text-lg font-semibold text-[#FEFEFE]">
              Completed
            </h3>
            <p className="text-xl sm:text-2xl text-[#FEFEFE]">
              {taskStats.completed}
            </p>
          </div>
          <div className="bg-[#ca8a04] p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-sm sm:text-lg font-semibold text-[#FEFEFE]">
              Pending
            </h3>
            <p className="text-xl sm:text-2xl text-[#FEFEFE]">
              {taskStats.pending}
            </p>
          </div>
          <div className="bg-[#dc2626] p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-sm sm:text-lg font-semibold text-[#F8F8F9]">
              Rejected
            </h3>
            <p className="text-xl sm:text-2xl text-[#F8F8F9]">
              {taskStats.rejected}
            </p>
          </div>
        </div>

        {/* Add New Task Button */}
        <Link to="/add-task">
          <button className="bg-[#764CE8] text-white py-2 px-4 sm:px-6 rounded-md hover:bg-[#6A6A71] flex items-center mx-auto lg920:mx-0 transition duration-300">
            <FaPlus className="mr-2" /> Add New Task
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
