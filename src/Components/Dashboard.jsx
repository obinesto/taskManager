import { useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Plus } from 'lucide-react';
import { useUser, useTasks } from "../hooks/useQueries";
import { Loader } from "./Loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

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

  const pieChartData = useMemo(
    () => [
      { name: "In Progress", value: taskStats.inProgress, color: "#2563eb" },
      { name: "Completed", value: taskStats.completed, color: "#16a34a" },
      { name: "Pending", value: taskStats.pending, color: "#ca8a04" },
      { name: "Rejected", value: taskStats.rejected, color: "#dc2626" },
    ],
    [taskStats]
  );

  const barChartData = useMemo(() => {
    if (!tasks) return [];
    const last6Months = [...Array(6)].map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    return last6Months.map(month => ({
      name: month,
      tasks: tasks.filter(task => new Date(task.createdAt).toLocaleString('default', { month: 'short' }) === month).length
    }));
  }, [tasks]);

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
          className="text-sm"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    },
    [RADIAN]
  );

  if (userLoading || tasksLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen md:ml-72 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Stay updated with your task progress and manage your work efficiently.
      </p>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {Object.entries(taskStats).map(([key, value]) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="charts">
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Overview of your tasks by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Creation Trend</CardTitle>
                <CardDescription>Number of tasks created in the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={() => navigate("/add-task")} className="w-full md:w-auto">
        <Plus className="mr-2 h-4 w-4" /> Add New Task
      </Button>
    </div>
  );
};

export default Dashboard;

