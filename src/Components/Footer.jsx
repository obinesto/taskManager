/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Footer() {
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
    <footer className="bg-muted py-2 sm:py-8 fixed bottom-0 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-muted-foreground mb-4 sm:mb-0 text-sm sm:text-base">
            © {new Date().getFullYear()} <NavLink to="/">TaskManager</NavLink>.
            All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
            <NavLink
              to="/privacy"
              className="text-sm sm:text-base mb-2 sm:mb-0"
            >
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" className="text-sm sm:text-base mb-2 sm:mb-0">
              Terms of Service
            </NavLink>
            <NavLink to="/contact" className="text-sm sm:text-base">
              Contact Us
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
