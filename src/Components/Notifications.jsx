import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Info, XCircle } from 'lucide-react';
import { useFetchUserNotification, useUser, useMarkNotificationAsRead } from "../hooks/useQueries";
import { Loader } from "./loaders/Loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
import { useToast } from "../hooks/use-toast";
import { ToastAction } from './ui/toast';

const Notifications = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const { data: user, error: userError, isLoading: userLoading } = useUser();
  const { 
    data: notifications, 
    error: notificationError, 
    isLoading: notificationIsLoading 
  } = useFetchUserNotification(user?.email);
  const markAsReadMutation = useMarkNotificationAsRead();

  console.log(notifications);
  

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      console.error("No notification ID provided");
      return;
    }

    try {
      await markAsReadMutation.mutateAsync(notificationId);
      toast({
        title: "Success",
        description: "Notification marked as read",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  if (notificationIsLoading || userLoading) {
    return <Loader />;
  }

  if (notificationError || userError) {
    return (
      <div className="min-h-screen md:ml-72 mx-auto px-4 py-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {notificationError?.message || userError?.message || "Failed to load notifications"}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
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
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen md:ml-72 mx-auto px-4 py-16 md:py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            {notifications?.length > 0 && (
              <Badge variant="secondary">
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              </Badge>
            )}
          </div>
          <CardDescription>
            Stay updated with your latest notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!notifications?.length ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Info className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                You&apos;ll see your notifications here when you receive them
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card 
                    key={notification._id} 
                    className="relative hover:bg-accent transition-colors"
                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                    role="button"
                    tabIndex={0}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <Badge className="absolute top-2 right-2" variant="default">
                            New
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;