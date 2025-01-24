/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mail, Loader, ArrowRight, LayoutDashboard } from "lucide-react";
import { useVerifyEmail, useResendVerification } from "../hooks/useQueries";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import EmailVerifyImg from "../assets/email-verification.png";


const EmailVerification = ({ notify }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const checkToken = localStorage.getItem("token");

  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await verifyEmail.mutateAsync(token);
          setSuccess(true);
          localStorage.removeItem("verificationEmail");
          let redirectProgress = 0;
          const interval = setInterval(() => {
            redirectProgress += 2;
            setProgress(redirectProgress);
            if (redirectProgress >= 100) {
              clearInterval(interval);
              navigate("/login");
            }
          }, 100);
          return () => clearInterval(interval);
        } catch (error) {
          setError(error.message);
          notify("Email verification failed", "error");
        }
      };
      verify();
    }
  }, [token, navigate, notify, verifyEmail]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    setSubmitLoader(true);
    try {
      await resendVerification.mutateAsync({ email: email });
      setCountdown(180);
      notify("Verification email sent successfully", "success");
    } catch (error) {
      setError(error.message);
      notify("Failed to send verification email", "error");
    } finally {
      setSubmitLoader(false);
    }
  };

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : success ? (
              <>
                <Alert>
                  <AlertDescription>
                    Your email has been successfully verified. You will be
                    redirected shortly...
                  </AlertDescription>
                </Alert>
                <Progress value={progress} className="w-full" />
                <Button asChild className="w-full">
                  {checkToken && isAuthenticated ? (
                    <Link to="/dashboard">
                      Dashboard <LayoutDashboard className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <Link to="/login">
                      Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Verify Your Email
              </CardTitle>
              <CardDescription>
                We&apos;ve sent a verification email to {email}. Please check
                your inbox and click the verification link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col items-center space-y-4">
                <Mail className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-center text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or
                  request a new verification email.
                </p>
                {countdown > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    You can request another verification email in{" "}
                    <span className="font-medium">
                      {Math.floor(countdown / 60)}:
                      {(countdown % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handleResendVerification}
                    disabled={resendVerification.isLoading || submitLoader}
                    className="w-full"
                  >
                    {submitLoader ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      "Resend Verification Email"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                {checkToken && isAuthenticated ? (
                  <Link to="/dashboard">Back to Dashboard</Link>
                ) : (
                  <Link to="/login">Back to Login</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="hidden md:block flex-1 my-auto">
        <img
          className="object-cover w-11/12 h-5/6 rounded-md"
          src={EmailVerifyImg}
          alt="Background"
        />
      </div>
    </div>
  );
};

export default EmailVerification;
