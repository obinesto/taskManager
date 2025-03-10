/* eslint-disable react/prop-types */
import { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  CircleUser,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  Hourglass,
  X,
} from "lucide-react";
import { useUser, useTasks, useResendVerification } from "../hooks/useQueries";
import { Loader } from "./loaders/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const Dashboard = ({ notify }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const { data: user, isLoading: userLoading } = useUser();
  // console.log(user);
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const profilePicture = user?.profilePicture;
  const sendVerificationEmail = useResendVerification();
  const [showVerificationPopup, setShowVerificationPopup] = useState(true);

  useEffect(() => {
    if (user?.isVerified === true) {
      setShowVerificationPopup(false);
    }
  }, [user]);

  const taskStats = useMemo(() => {
    if (!tasks) return { inProgress: 0, completed: 0, pending: 0, rejected: 0 };
    return {
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
      pending: tasks.filter((task) => task.status === "Pending").length,
      rejected: tasks.filter((task) => task.status === "Rejected").length,
    };
  }, [tasks]);

  const userTaskStats = useMemo(() => {
    if (!user || !tasks)
      return {
        assignedByUser: {
          inProgress: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
        },
        assignedToUser: {
          inProgress: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
        },
        assignedToSelf: {
          inProgress: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
        },
      };

    const initialStats = {
      InProgress: 0,
      Completed: 0,
      Pending: 0,
      Rejected: 0,
    };

    const stats = {
      assignedByUser: { ...initialStats },
      assignedToUser: { ...initialStats },
      assignedToSelf: { ...initialStats },
    };

    tasks.forEach((task) => {
      if (task.assignedTo === user.email && task.assignedBy === user.email) {
        stats.assignedToSelf[task.status.replace(" ", "")]++;
      } else if (task.assignedBy === user.email) {
        stats.assignedByUser[task.status.replace(" ", "")]++;
      } else if (task.assignedTo === user.email) {
        stats.assignedToUser[task.status.replace(" ", "")]++;
      }
    });
    return stats;
  }, [user, tasks]);

  const pieChartData = useMemo(
    () => [
      {
        name: "In Progress",
        value: taskStats.inProgress,
        color: "hsl(var(--chart-1))",
      },
      {
        name: "Completed",
        value: taskStats.completed,
        color: "hsl(var(--chart-2))",
      },
      {
        name: "Pending",
        value: taskStats.pending,
        color: "hsl(var(--chart-3))",
      },
      {
        name: "Rejected",
        value: taskStats.rejected,
        color: "hsl(var(--chart-4))",
      },
    ],
    [taskStats]
  );

  const barChartData = useMemo(() => {
    if (!tasks) return [];
    const last6Months = [...Array(6)]
      .map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString("default", { month: "short" });
      })
      .reverse();

    return last6Months.map((month) => ({
      name: month,
      tasks: tasks.filter(
        (task) =>
          new Date(task.createdAt).toLocaleString("default", {
            month: "short",
          }) === month
      ).length,
    }));
  }, [tasks]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = useCallback(
    ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return percent > 0.05 ? (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      ) : null;
    },
    [RADIAN]
  );

  const getStatusIcon = (status) => {
    const icons = {
      inprogress: <Hourglass className="h-4 w-4" />,
      completed: <CheckCircle2 className="h-4 w-4" />,
      pending: <Clock className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };
    return (
      icons[status.toLowerCase().replace(" ", "")] || (
        <AlertCircle className="h-4 w-4" />
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      inprogress: "text-blue-500",
      completed: "text-green-500",
      pending: "text-yellow-500",
      rejected: "text-red-500",
    };
    return colors[status.toLowerCase().replace(" ", "")] || "text-gray-500";
  };

  if (userLoading || tasksLoading) {
    return <Loader />;
  }

  const handleSendVerification = async () => {
    if (user?.isVerified)
      return notify("Your email is already verified", "info");
    try {
      await sendVerificationEmail.mutateAsync({ email: user?.email });
      localStorage.setItem("verificationEmail", user?.email);
      notify("Verification email sent successfully", "success");
    } catch (error) {
      notify(error.message || "Failed to send verification email", "error");
    } finally {
      navigate("/verify");
    }
  };

  return (
    <div className="min-h-screen md:ml-72 mx-auto px-4 py-16 md:py-8 bg-background/50">
      {showVerificationPopup && (
        <div className="w-full md:w-4/6 fixed top-0.5 right-0 md:right-20 z-50 p-2 bg-background border-[0.5px] border-muted-foreground rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Your email is not yet verified. Click{" "}
              <button
                className="text-blue-500 hover:text-blue-700 underline"
                onClick={() => {
                  handleSendVerification();
                }}
              >
                here
              </button>{" "}
              to verify your email.
            </p>
            <button onClick={() => setShowVerificationPopup(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <Link to="/profile-settings">
            <div className="flex gap-2 md:justify-center items-center">
              <Avatar className="size-12 md:size-16">
                <AvatarImage src={profilePicture} alt={user?.username} />
                <AvatarFallback>
                  <CircleUser className="size-8 md:size-12" />
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground text-sm md:text-base">
                Hello,
                <br />
                {user?.username}
              </p>
            </div>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Button
          onClick={() => navigate("/add-task")}
          size="sm"
          className="mt-4 md:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.length || 0}</div>
            <p className="text-xs text-muted-foreground">across all users</p>
          </CardContent>
        </Card>
        {Object.entries(taskStats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </CardTitle>
              <div className={getStatusColor(key)}>{getStatusIcon(key)}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">
                {((value / (tasks?.length || 1)) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">User Task Overview</TabsTrigger>
          <TabsTrigger value="charts">Users Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Tasks Assigned By You</CardTitle>
                <CardDescription>
                  Overview of tasks you&apos;ve delegated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(userTaskStats.assignedByUser).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={getStatusColor(key)}>
                          {getStatusIcon(key)}
                        </div>
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      <Badge variant="secondary">{value}</Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Tasks Assigned To You</CardTitle>
                <CardDescription>
                  Tasks others have assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(userTaskStats.assignedToUser).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={getStatusColor(key)}>
                          {getStatusIcon(key)}
                        </div>
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      <Badge variant="secondary">{value}</Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Self-Assigned Tasks</CardTitle>
                <CardDescription>
                  Tasks you&apos;ve assigned to yourself
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(userTaskStats.assignedToSelf).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={getStatusColor(key)}>
                          {getStatusIcon(key)}
                        </div>
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      <Badge variant="secondary">{value}</Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>
                  Current status breakdown of all tasks by all users
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      innerRadius={60}
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
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {pieChartData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {entry.name} ({entry.value} tasks)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Creation Trend</CardTitle>
                <CardDescription>
                  Task volume of all users over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar
                      dataKey="tasks"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
