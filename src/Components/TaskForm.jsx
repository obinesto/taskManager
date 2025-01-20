import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAddTask, useUser, useUsers } from "../hooks/useQueries";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";
import { Label } from "./ui/label";
import { ToastAction } from "./ui/toast";

const TaskForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
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
      toast({
        title: "Success",
        description: "Task created successfully!",
        variant: "default",
      });
      setTask({
        name: "",
        description: "",
        executedBySelf: true,
        assignedTo: "",
        assignedBy: "",
      });
      navigate("/tasklist");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      console.error("Error creating task:", error);
    }
  };

  if (userLoading || usersLoading) {
    return <Loader />;
  }

  if (userError || usersError) {
    return (
      <div className="flex items-center justify-center min-h-screen md:ml-72 mx-auto px-4 py-16 md:py-8 bg-background/50">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Error loading data. Please refresh the page or try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 mx-auto px-4 py-16 md:py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Task Name</Label>
              <Input
                id="name"
                type="text"
                value={task.name}
                onChange={(e) => setTask({ ...task, name: e.target.value })}
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                placeholder="Enter task description"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="executedBySelf"
                checked={task.executedBySelf}
                onCheckedChange={(checked) =>
                  setTask({ ...task, executedBySelf: checked })
                }
              />
              <Label
                htmlFor="executedBySelf"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Execute task by myself
              </Label>
            </div>

            {!task.executedBySelf && (
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select
                  value={task.assignedTo}
                  onValueChange={(value) =>
                    setTask({ ...task, assignedTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((u) => user && u.email !== user.email)
                      .map((u) => (
                        <SelectItem key={u._id} value={u.email}>
                          {u.username}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={addTaskMutation.isLoading}
            >
              {addTaskMutation.isLoading ? "Creating Task..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;