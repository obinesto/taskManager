/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogin, useRegister, useGoogleLogin } from "../hooks/useQueries";
import {
  Mail,
  Lock,
  User,
  Loader,
  TriangleAlert,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
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
import Footer from "./Footer";
import { Separator } from "./ui/separator";
import BgImage from "../assets/bg-4.jpg";

const AuthPage = ({ notify }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [submitLoader2, setSubmitLoader2] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();
  const googleLogin = useGoogleLogin();
  const location = useLocation();

  const {
    register: rhfRegister,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
    reset();
  }, [location, reset]);

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setApiError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (apiError) {
      clearError();
    }
  }, [apiError, clearError]);

  const onSubmit = async (data) => {
    setSubmitLoader(true);
    setApiError("");

    const mutationFn = isLogin ? login : register;
    const payload = isLogin
      ? { email: data.email, password: data.password }
      : data;

    try {
      await mutationFn.mutateAsync(payload);
      notify(
        isLogin ? "Login successful" : "Registration successful",
        "success"
      );
      if (!isLogin) {
        localStorage.setItem("verificationEmail", data.email);
      }
      navigate(isLogin ? "/dashboard" : "/verify");
    } catch (error) {
      console.error("Error:", error);
      setApiError(error.message);
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
      setApiError(error.message);
      notify("Google login failed", "error");
    } finally {
      setSubmitLoader2(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
    setApiError("Google login failed. Please try again.");
    notify("Google login failed", "error");
  };

  return submitLoader2 ? (
    <LoaderTwo />
  ) : (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 mb-0 md:mb-14">
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
              {apiError && (
                <Alert variant="destructive">
                  <AlertDescription className="flex items-center gap-4">
                    {
                      <TriangleAlert className="h-4 w-4 text-muted-foreground" />
                    }
                    {apiError}!
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="JohnDoe"
                        {...rhfRegister("username", {
                          required: "Username is required",
                        })}
                      />
                      <User className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-destructive">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      disabled={submitLoader}
                      placeholder="john@example.com"
                      {...rhfRegister("email", {
                        required: "Email is required",
                      })}
                    />
                    <Mail className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      disabled={submitLoader}
                      placeholder="Enter Password"
                      {...rhfRegister("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <Lock className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 rounded-full absolute right-10 top-1/2 transform -translate-y-1/2"
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                    >
                      {showPassword ? (
                        <EyeIcon className="text-muted-foreground" />
                      ) : (
                        <EyeOffIcon className="text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                  {!isLogin && (
                    <>
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          disabled={submitLoader}
                          placeholder="Confirm Password"
                          {...rhfRegister("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                        />
                        <Lock className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2" />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 rounded-full absolute right-10 top-1/2 transform -translate-y-1/2"
                          onClick={() => {
                            setShowPassword((prev) => !prev);
                          }}
                        >
                          {showPassword ? (
                            <EyeIcon
                              className="text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : (
                            <EyeOffIcon
                              className="text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {errors.confirmPassword.message}
                        </p>
                      )}
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
                      {isLogin
                        ? "login in progress..."
                        : "Account creation in progress..."}
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
                size="large"
                theme="filled_blue"
                width={330}
                shape="pill"
                type="standard"
                text={isLogin ? "signin_with" : "signup_with"}
              ></GoogleLogin>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    reset();
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div
        className={`hidden md:block flex-1 my-auto mb-0 ${
          isLogin ? "md:mb-24" : "md:mb-36"
        }`}
      >
        <img
          className="object-cover w-11/12 h-5/6 rounded-md"
          src={BgImage}
          alt="Background"
        />
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
