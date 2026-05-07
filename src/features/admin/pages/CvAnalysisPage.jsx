import React from 'react';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';

export default function CvAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CV Analysis Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Track ongoing and past CV parsing jobs across the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">CV Analysis Module (Coming Soon)</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The comprehensive view for all CV parsing metrics, failure logs, and processing queue will be implemented in the next phase.
        </p>
      </div>
    </div>
  );
}
