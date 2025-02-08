/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import bgImage from "../assets/bg-4.jpg";

const LandingPage = () => {
  const features = [
    "Smart task prioritization",
    "Team collaboration",
    "Real-time progress tracking",
  ];

  const NavLink = ({ to, children, className }) => (
    <Link
      to={to}
      className={cn(
        "text-muted-foreground hover:text-primary transition duration-300",
        className
      )}
    >
      {children}
    </Link>
  );

  return (
      <div className="min-h-screen w-full bg-background text-foreground">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center mb-8 sm:mb-16">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              TaskManager
            </div>
            <div className="flex space-x-4">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Sign Up</NavLink>
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
                Organize Your Work and Life, Finally
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                TaskManager helps you manage your tasks, projects, and goals
                with ease. Boost your productivity and achieve more, every day.
              </p>
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="md:hidden w-full lg:w-1/2 mt-8 lg:mt-0">
                  <img
                    src={bgImage}
                    alt="TaskManager Dashboard"
                    className="rounded-lg shadow-xl w-full"
                  />
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/login">
                    Get Started <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link to="/demo">Watch Demo</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block w-full lg:w-1/2 mt-8 lg:mt-0">
              <img
                src={bgImage}
                alt="TaskManager Dashboard"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>

        <footer className="bg-muted mt-16 py-8 md:fixed md:bottom-0 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-muted-foreground mb-4 sm:mb-0 text-sm sm:text-base">
                © {new Date().getFullYear()} TaskManager. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
                <NavLink
                  to="/privacy"
                  className="text-sm sm:text-base mb-2 sm:mb-0"
                >
                  Privacy Policy
                </NavLink>
                <NavLink
                  to="/terms"
                  className="text-sm sm:text-base mb-2 sm:mb-0"
                >
                  Terms of Service
                </NavLink>
                <NavLink to="/contact" className="text-sm sm:text-base">
                  Contact Us
                </NavLink>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default LandingPage;
