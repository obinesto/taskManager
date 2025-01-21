import { cn } from "../../lib/utils";

const LoaderTwo = () => {
  const dots = Array.from({ length: 16 });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <style>
        {`
          @keyframes scaleDot {
            40% {
              transform: scale(1.3) translate(-2px, -2px);
            }
            80%, 100% {
              transform: scale(1);
            }
          }

          .loader-grid {
            width: 60px;
            height: 60px;
            position: relative;
            transform: rotate(45deg);
            display: flex;
            flex-wrap: wrap;
          }

          .loader-dot {
            width: 6px;
            height: 6px;
            background-color: hsl(var(--foreground));
            border-radius: 100%;
            margin-bottom: 12px;
            animation: scaleDot 2s ease infinite;
          }

          .loader-dot:not(:nth-child(4n)) {
            margin-right: 12px;
          }

          .loader-dot:nth-child(4n+2) {
            animation-delay: 0.1s;
          }

          .loader-dot:nth-child(4n+3) {
            animation-delay: 0.2s;
          }

          .loader-dot:nth-child(4n+4) {
            animation-delay: 0.3s;
          }
        `}
      </style>
      <div className="loader-grid" aria-label="Loading">
        {dots.map((_, index) => (
          <div
            key={index}
            className={cn(
              "loader-dot",
              "dark:bg-white bg-black"
            )}
          />
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground animate-pulse">
        Please wait while we log you in...
      </p>
    </div>
  );
};

export default LoaderTwo;