import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Plus } from "lucide-react";
import { useTasks, useUsers, useUser } from "../hooks/useQueries";
import { Loader } from "./Loader";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TaskList = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    if (filter === "all") {
      setFilter("");
    }
  }, [filter]);

  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks(filter);
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();

  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const getUserNameByEmail = useMemo(() => {
    return (email) => {
      if (!users) return "Loading...";
      const foundUser = users.find((user) => user.email === email);
      return foundUser ? foundUser.username : email;
    };
  }, [users]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      const now = new Date();
      const diffInHours = Math.abs(now - date) / 36e5;

      if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        if (hours === 0) {
          const minutes = Math.floor((diffInHours * 60) % 60);
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      }

      if (diffInHours < 48) {
        return 'Yesterday';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const truncateDescription = (description, maxLength = 30) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };

  const filteredTasks = useMemo(() => {
    if (!tasks || !user) return [];
    
    // Filter tasks that are either assigned to or by the user
    let filtered = tasks.filter(task => 
      task.assignedTo === user.email || task.assignedBy === user.email
    );
    
    // Apply status filter if set
    if (filter) {
      filtered = filtered.filter(task => task.status === filter);
    }
    
    // Sort tasks by creation date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  }, [tasks, user, filter]);

  const currentTasks = useMemo(() => {
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    return filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  }, [filteredTasks, currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (userLoading || tasksLoading || usersLoading) {
    return <Loader />;
  }

  if (userError || usersError || tasksError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen md:ml-72 mx-auto px-4 py-16 md:py-8 bg-background">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-xl font-semibold">
              Oops! Something went wrong.
            </p>
            <p className="text-center text-muted-foreground mt-4">
              Error loading data. Kindly refresh the page or try again later.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 w-full"
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:ml-72 mx-auto px-4 py-16 md:py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Task List</CardTitle>
          {user && (
            <p className="text-muted-foreground">
              Welcome back, {user.username}!
            </p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Manage your tasks efficiently and stay organized.
          </p>
          
          <div className="flex justify-between items-center mb-6 gap-1 md:gap-0">
            <Button asChild>
              <Link to="/add-task">
                <Plus className="mr-2 h-4 w-4" /> Add New Task
              </Link>
            </Button>
            <Select onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time Created</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No tasks found</p>
                  </TableCell>
                </TableRow>
              ) : (
                currentTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="block truncate" title={task.description}>
                        {truncateDescription(task.description)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(task.createdAt)}</TableCell>
                    <TableCell>
                      {getUserNameByEmail(
                        task.assignedBy === task.assignedTo
                          ? "self"
                          : user.email === task.assignedTo
                          ? "you"
                          : task.assignedTo
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "success"
                            : task.status === "In Progress"
                            ? "warning"
                            : task.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/task/${task._id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {currentTasks.length > 0 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={"hidden sm:flex"}
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.ceil(filteredTasks.length / tasksPerPage) },
                  (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => paginate(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredTasks.length / tasksPerPage)
                    }
                    className={"hidden sm:flex"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskList;