/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser, useLogout } from "../hooks/useQueries";
import { useSelector } from "react-redux";
import { LogOut, LayoutDashboard, CheckSquare, User, Menu, BellPlus } from 'lucide-react';
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => new RegExp(`^${path.replace(":id", "[^/]+")}$`).test(location.pathname);
  const isAnyActive = (paths) => paths.some((path) => isActive(path));

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const logout = useLogout();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const NavItem = ({ href, icon: Icon, children, isActiveFunc = isActive }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              isActiveFunc(href) && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{children}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">TaskManager</span>
        </Link>
      </div>
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user ? `Welcome, ${user.username}` : "Welcome, Guest"}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <NavItem href="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </NavItem>
          <NavItem 
            href="/tasklist" 
            icon={CheckSquare}
            isActiveFunc={() => isAnyActive(["/tasklist", "/task/:id"])}
          >
            Task List
          </NavItem>
          <NavItem href="/notifications" icon={BellPlus}>
            Notifications
          </NavItem>
        </nav>
      </div>
      <div className="mt-auto p-4">
        {user && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
      <footer className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} TaskManager. All rights reserved.
      </footer>
    </div>
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-gray-100/40 lg:block dark:bg-gray-800/20">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;

