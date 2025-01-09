import { LoaderPinwheel } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background md:ml-56">
      <LoaderPinwheel className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
};

