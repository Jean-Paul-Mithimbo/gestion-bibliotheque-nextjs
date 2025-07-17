import { Loader2 } from 'lucide-react';

export const Loading = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};