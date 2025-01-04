export const Loader = () => {
  return (
    <div className="flex justify-center items-center m-0 min-h-screen">
      <span className="block"></span>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
      <style>{`
        .loader {
          filter: url("#goo");
        }

        .loader:after {
          content: "";
          width: 2.5em;
          height: 2.5em;
          background: #aa33ff;
          border-radius: 50%;
          position: absolute;
          transform: scale(0.5);
          animation: grow 1.5s cubic-bezier(.14, 0.05, 0.55, 0.5) infinite alternate;
        }

        .loader span {
          width: 1.25em;
          height: 1.25em;
          background: #a733bb;
          border-radius: 50%;
          margin-right: 1.25em;
          position: relative;
          transform: translateX(4.5em);
          animation: move 3s ease-in-out infinite;
        }

        .loader span:before {
          content: "";
          width: 1.25em;
          height: 1.25em;
          background: #a733bb;
          border-radius: 50%;
          position: absolute;
          left: 2em;
          transform: translateX(0em);
          animation: shrink 1.5s ease-in-out infinite;
        }

        .loader span:after {
          content: "";
          width: 1.25em;
          height: 1.25em;
          background: #aa33ff;
          border-radius: 50%;
          position: absolute;
          right: 2em;
          transform: translateX(0em);
          animation: shrink 1.5s ease-in-out infinite;
        }

        @keyframes grow {
          to {
            transform: scale(0.7);
          }
        }

        @keyframes move {
          0%, 100% {
            transform: translateX(4.5em);
          }
          50% {
            transform: translateX(-4.5em);
          }
        }

        @keyframes shrink {
          50% {
            transform: scale(0.5);
          }
        }
      `}</style>
    </div>
  );
};

