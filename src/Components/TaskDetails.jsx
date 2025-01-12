import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTasks, useUser, useUpdateTask } from "../hooks/useQueries";
import { Loader } from "./Loader";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useToast } from "../hooks/use-toast";

const TaskDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

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
      toast({
        title: "Status Updated",
        description: `Task ${newStatus} successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  if (taskLoading || userLoading) {
    return <Loader />;
  }

  if (userError || taskError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background/50">
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

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background/50">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Task Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The task you&apos;re looking for could not be found or does not exist.
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "warning";
      case "Pending":
        return "default";
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background/50 mx-auto px-4 py-16 md:py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Task Details</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-1">
              <h3 className="font-medium">Name</h3>
              <p className="text-sm text-muted-foreground">{task.name}</p>
            </div>
            <Separator />
            
            <div className="grid gap-1">
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
            <Separator />
            
            <div className="grid gap-1">
              <h3 className="font-medium">Assigned To</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {task.executedBySelf ? "Self" : task.assignedTo}
              </p>
            </div>
            <Separator />
            
            <div className="grid gap-1">
              <h3 className="font-medium">Status</h3>
              <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            {task.executedBySelf ? (
              task.status === "In Progress" ? (
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => handleUpdateStatus("Completed")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This task is already completed.
                </p>
              )
            ) : (
              <>
                {task.assignedTo === user.email ? (
                  <>
                    {task.status === "Pending" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          className="w-full sm:w-auto"
                          onClick={() => handleUpdateStatus("In Progress")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Accept Task
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full sm:w-auto"
                          onClick={() => handleUpdateStatus("Rejected")}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject Task
                        </Button>
                      </div>
                    )}
                    {task.status === "In Progress" && (
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() => handleUpdateStatus("Completed")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                      </Button>
                    )}
                    {task.status === "Rejected" && (
                      <p className="text-sm text-muted-foreground">
                        This task was rejected.
                      </p>
                    )}
                    {task.status === "Completed" && (
                      <p className="text-sm text-muted-foreground">
                        This task is completed.
                      </p>
                    )}
                  </>
                ) : (
                  <Card className="bg-secondary">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">
                        You can only monitor the progress of tasks assigned to other users.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetails;