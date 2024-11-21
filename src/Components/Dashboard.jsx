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
  const [user, setUser] = useState(null); // Store logged-in user details
  const [tasks, setTasks] = useState([]);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me"); // Endpoint to get logged-in user details
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // This runs once when the component mounts

    // Fetch tasks when the user is fetched and the filter changes
    useEffect(() => {
      if (user) {
        const fetchTasks = async () => {
          setLoading(true); // Set loading to true before making the request
          try {
            const response = await axios.get("/tasks");
            const filteredTasks = response.data.filter(
              (task) =>
                task.assignedTo === user?.email || task.assignedBy === user?.email
            );
            setTasks(filteredTasks);
          } catch (error) {
            console.error("Error fetching tasks:", error);
          } finally {
            setLoading(false); // Set loading to false once the request is complete
          }
        };
  
        fetchTasks();
      }
    }, [user]); // This runs when user changes

    useEffect(() => {
      const fetchTaskStats = () => {
        const stats = {
          inProgress: tasks.filter((task) => task.status === "In Progress").length,
          completed: tasks.filter((task) => task.status === "Completed").length,
          pending: tasks.filter((task) => task.status === "Pending").length,
          rejected: tasks.filter((task) => task.status === "Rejected").length,
        };
        setTaskStats(stats);
      };
    
      fetchTaskStats();
    }, [tasks]); // Runs whenever 'tasks' changes
    

  const dataOne = [
    { name: "In Progress", value: taskStats.inProgress },
    { name: "Completed", value: taskStats.completed },
  ];

  const dataTwo = [
    { name: "Pending", value: taskStats.pending },
    { name: "Rejected", value: taskStats.rejected },
  ];

  const colorsOne = ["#2563eb", "#16a34a"];
  const colorsTwo = ["#ca8a04", "#dc2626"];

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

  return loading ? (
    <p className="flex flex-col justify-center items-center text-indigo-600 font-semibold text-3xl">
      Loading...
    </p>
  ) : (
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
          <div className="flex flex-col md:flex-row items-center mb-4 justify-between">
            <PieChart
              width={400}
              height={400}
              className="bg-slate-50 rounded-lg border-2 border-indigo-600 shadow-md"
            >
              <Pie
                data={dataOne}
                cx={200}
                cy={200}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
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
              width={400}
              height={400}
              className="bg-slate-50 rounded-lg border-2 border-indigo-600 shadow-md"
            >
              <Pie
                data={dataTwo}
                cx={200}
                cy={200}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
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
