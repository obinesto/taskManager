/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogin, useRegister, useGoogleLogin } from "../hooks/useQueries";
import { Mail, Lock, User, Loader, TriangleAlert } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import LoaderTwo from "./loaders/LoaderTwo";
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
import { Separator } from "./ui/separator";
import BgImage from "../assets/bg-4.jpg";

const AuthPage = ({ notify }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [submitLoader, setSubmitLoader] = useState(false);
  const [submitLoader2, setSubmitLoader2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();
  const googleLogin = useGoogleLogin();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    }
  }, [location]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
    }
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    setErrorMessage("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setSubmitLoader(false);
      return;
    }

    const mutationFn = isLogin ? login : register;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      await mutationFn.mutateAsync(payload);
      notify(
        isLogin ? "Login successful" : "Registration successful",
        "success"
      );
      if (!isLogin) {
        localStorage.setItem("verificationEmail", formData.email);
      }
      navigate(isLogin ? "/dashboard" : "/verify");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      notify(isLogin ? "Login failed" : "Registration failed", "error");
    } finally {
      setSubmitLoader(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setSubmitLoader2(true);
    try {
      await googleLogin.mutateAsync(credentialResponse);
      notify("Google login successful", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      notify("Google login failed", "error");
    } finally {
      setSubmitLoader2(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
    setErrorMessage("Google login failed. Please try again.");
    notify("Google login failed", "error");
  };

  return submitLoader2 ? (
    <LoaderTwo />
  ) : (
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
            <CardHeader className="space-y-1">
              <CardTitle>
                {isLogin ? "Sign in to your account" : "Create an account"}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Enter your email below to login to your account"
                  : "Enter your details below to create your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription className="flex items-center gap-4">
                    {
                      <TriangleAlert className="h-4 w-4 text-muted-foreground" />
                    }
                    {errorMessage}!
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required={!isLogin}
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="JohnDoe"
                      icon={<User className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <Link
                        to="/reset-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                  />
                  {!isLogin && (
                    <>
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          handleChange(e);
                          handlePasswordChange(e);
                        }}
                        placeholder="••••••••"
                        icon={
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        }
                      />
                    </>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    submitLoader || login.isLoading || register.isLoading
                  }
                >
                  {submitLoader ? (
                    <span className="flex items-center justify-center gap-2 text-xs md:text-base">
                    <Loader className="h-8 w-8 animate-spin" />
                    {isLogin? "login in progress..." : "Account creation in progress..."}
                  </span>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
                className="w-full"
              ></GoogleLogin>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-primary hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="hidden md:block flex-1 my-auto">
        <img
          className="object-cover w-11/12 h-5/6 rounded-md"
          src={BgImage}
          alt="Background"
        />
      </div>
    </div>
  );
};

export default AuthPage;
