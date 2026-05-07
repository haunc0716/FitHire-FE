import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function CulturalFitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cultural Fit Results</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze personality matching and team fit scores.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Behavioral Analysis Engine</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Metrics for cultural fit assessments and value alignment will be integrated in the upcoming update.
        </p>
      </div>
    </div>
  );
}
