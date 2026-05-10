import { LoadingSpinner } from "../LoadingSpinner";

export const PageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">{text}</p>
    </div>
  );
};
