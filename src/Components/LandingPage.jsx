import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import Footer from "./Footer";
import bgImage from "../assets/bg-4.jpg";

const LandingPage = () => {
  const features = [
    "Smart task prioritization",
    "Team collaboration",
    "Real-time progress tracking",
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center mb-8 sm:mb-16">
          <div className="text-xl sm:text-2xl font-bold text-primary">
            TaskManager
          </div>
          <div className="flex space-x-4 mr-10 sm:mr-0">
            <Link
              className="text-muted-foreground hover:text-primary transition duration-300"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary transition duration-300"
              to="/register"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Organize Your Work and Life, Finally
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              TaskManager helps you manage your tasks, projects, and goals with
              ease. Boost your productivity and achieve more, every day.
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
              <div className="md:hidden w-full lg:w-1/2 mt-6 lg:mt-0">
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
                className="w-full sm:w-auto mb-16 sm:mb-0"
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
      <Footer />
    </div>
  );
};

export default LandingPage;
