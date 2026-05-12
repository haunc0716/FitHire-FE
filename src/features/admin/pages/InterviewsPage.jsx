import React from 'react';
import { Video } from 'lucide-react';

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mock Interview Sessions</h1>
        <p className="text-sm text-gray-500 mt-1">Review AI interview recordings, transcripts, and feedback.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Video className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Video Storage & Transcripts</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The dashboard for managing mock interviews and AI evaluator logs will be available here soon.
        </p>
      </div>
    </div>
  );
}
