/* eslint-disable react/prop-types */
import { Component } from "react";
import * as Sentry from "@sentry/react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { X } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, copySuccess: false };
    this.notificationTimeout = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
    Sentry.captureException(error);
  }

  componentWillUnmount() {
    clearTimeout(this.notificationTimeout);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleNotification = () => {
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 3000);
  };

  handleCopyEmail = () => {
    navigator.clipboard.writeText("obicyprian180@gmail.com");
    this.setState({ copySuccess: true }, this.handleNotification);
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Oops! Something went wrong.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              An unexpected error occurred. Please try again.
            </p>

            <div className="flex justify-center mt-4 space-x-4">
              <Button variant="outline" onClick={this.handleReload}>
                Reload App
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Report Issue</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report an Issue</AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col items-center text-center">
                      Please describe what happened before the error occurred.
                      <br />
                      You can send an email to{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        obicyprian180@gmail.com.
                      </span>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={this.handleCopyEmail}
                      >
                        copy email
                      </Button>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {this.state.copySuccess && (
                    <Alert className="w-32 p-2 m-auto">
                      <AlertDescription>Email copied!</AlertDescription>
                      <button
                        className="absolute top-1/4  right-0"
                        onClick={() => {
                          this.setState({ copySuccess: false });
                        }}
                      >
                        <X className="size-4" />
                      </button>
                    </Alert>
                  )}
                  <AlertDialogCancel className="absolute top-1 right-1">
                    <X />
                  </AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

const FallbackComponent = () => (
  <p className="flex flex-col items-center justify-center font-semibold text-lg">
    Something went wrong! <br /> Kindly refresh the page
  </p>
);

const ErrorBoundaryWithSentry = Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: <FallbackComponent />,
});

export default ErrorBoundaryWithSentry;
