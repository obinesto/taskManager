/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useResetPassword, useUpdatePassword } from "../hooks/useQueries";
import { Mail, Loader, Lock } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import PasswordResetbgImg from "../assets/reset-password-bg-(3).png";

const PasswordReset = ({ notify }) => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const resetPassword = useResetPassword();
  const updatePassword = useUpdatePassword();

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (errorMessage) {
      clearError();
    }
  }, [errorMessage, clearError]);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    setErrorMessage("");
    try {
      await resetPassword.mutateAsync({ email });
      setSuccess(true);
      notify("Password reset email sent", "success");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      notify("Failed to send reset email", "error");
    } finally {
      setSubmitLoader(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setSubmitLoader(true);
    setErrorMessage("");
    try {
      await updatePassword.mutateAsync({ token, password });
      setSuccess(true);
      notify("Password updated successfully", "success");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      notify("Failed to update password", "error");
    } finally {
      setSubmitLoader(false);
    }
  };

  const renderResetRequest = () => (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription>
          Forgot your password? <br />
          Enter your email address and we&apos;ll send you a link to help you reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {success ? (
          <Alert>
            <AlertDescription>
              If an account exists with this email, you will receive a password reset link shortly.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={resetPassword.isLoading || submitLoader}
            >
              {submitLoader ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </>
  );

  const renderPasswordUpdate = () => (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Update Password
        </CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {success ? (
          <Alert>
            <AlertDescription>
              Your password has been updated successfully. You can now login with your new password.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={updatePassword.isLoading || submitLoader}
            >
              {submitLoader ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="flex justify-center h-16 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-4xl md:6xl hover:text-gray-700">
              TaskManager
            </span>
          </Link>
        </div>
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <Card>
            {token ? renderPasswordUpdate() : renderResetRequest()}
            <CardFooter>
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="hidden md:block flex-1 my-auto">
        <img
          className="object-cover w-11/12 h-5/6 rounded-md"
          src={PasswordResetbgImg}
          alt="Background"
        />
      </div>
    </div>
  );
};

export default PasswordReset;