import { LoaderPinwheel } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background md:ml-56">
      <LoaderPinwheel className="w-12 h-12 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        Please wait while we load the content...
      </p>
    </div>
  );
};
