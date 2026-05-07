import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function ComingSoonPage({ title }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
        <Construction className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title} is Coming Soon</h1>
      <p className="text-gray-500 max-w-md mb-8">
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back
      </button>
    </div>
  );
}
