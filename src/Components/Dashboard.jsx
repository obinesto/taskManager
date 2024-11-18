import { useState, useEffect } from "react";
import axios from "./taskService";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    inProgress: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await axios.get("/tasks");
        const tasks = response.data;

        const stats = {
          inProgress: tasks.filter((task) => task.status === "In Progress")
            .length,
          completed: tasks.filter((task) => task.status === "Completed").length,
          pending: tasks.filter((task) => task.status === "Pending").length,
          rejected: tasks.filter((task) => task.status === "Rejected").length,
        };

        setTaskStats(stats);
      } catch (error) {
        console.error("Error fetching task stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  const data = [
    { name: "In Progress", value: taskStats.inProgress },
    { name: "Completed", value: taskStats.completed },
    { name: "Pending", value: taskStats.pending },
    { name: "Rejected", value: taskStats.rejected },
  ];

  const COLORS = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
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
  };

  if (loading)
    return (
      <p className="flex flex-col justify-center items-center text-indigo-600 font-semibold text-3xl">
        Loading...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-6">
          Stay updated with your task progress and manage your work efficiently.
        </p>

        {/* Task Overview - Pie Chart */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Task Overview
          </h2>
          <PieChart width={400} height={400} className="bg-indigo-600">
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip/>
          </PieChart>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-blue-600">In Progress</h3>
            <p className="text-2xl text-blue-600">{taskStats.inProgress}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-green-600">Completed</h3>
            <p className="text-2xl text-green-600">{taskStats.completed}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-yellow-600">Pending</h3>
            <p className="text-2xl text-yellow-600">{taskStats.pending}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-red-600">Rejected</h3>
            <p className="text-2xl text-red-600">{taskStats.rejected}</p>
          </div>
        </div>

        {/* Add New Task Button */}
        <Link to="/add-task">
          <button className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 flex items-center">
            <FaPlus className="mr-2" /> Add New Task
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
