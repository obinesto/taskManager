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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
    Sentry.captureException(error);
  }

  handleReload = () => {
    window.location.reload();
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
            <h2 className="text-2xl font-bold text-red-500 dark:text-red-400">
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
                    <AlertDialogDescription>
                      Please describe what happened before the error occurred.
                      <br />
                      You can also send an email to{" "}
                      <span className="font-semibold">
                        obicyprian180@gmail.com
                      </span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
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

export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: (
    <p className="flex flex-col items-center justify-center font-semibold text-lg">
      Something went wrong! <br /> Kindly refresh the page
    </p>
  ),
});
