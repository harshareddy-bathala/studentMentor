import React from 'react';

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
    <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-slate-400 text-sm">{message}</p>
  </div>
);

export default FullScreenLoader;
