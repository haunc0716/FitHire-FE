import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Generate comprehensive PDF and CSV reports for platform performance.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Advanced Reporting Builder</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Custom report generation and automated email scheduling are currently under development.
        </p>
      </div>
    </div>
  );
}
