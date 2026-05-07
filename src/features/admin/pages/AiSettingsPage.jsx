import React, { useState } from 'react';
import { Settings, BrainCircuit, Bot, Zap, Save } from 'lucide-react';

export default function AiSettingsPage() {
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure language models, prompts, and analysis parameters.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Model Configuration</h2>
                <p className="text-sm text-gray-500">Select the primary model used for CV parsing and analysis.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary AI Model</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200"
                >
                  <option value="gpt-4">GPT-4 (Most Accurate)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fastest)</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Temperature: {temperature}</span>
                  <span className="text-gray-400 text-xs font-normal">Higher = more creative, Lower = more precise</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">System Prompts</h2>
                <p className="text-sm text-gray-500">Define the core instructions for the AI agents.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CV Analyzer Prompt</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200 font-mono text-gray-600"
                  defaultValue="You are an expert technical recruiter..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mock Interviewer Prompt</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200 font-mono text-gray-600"
                  defaultValue="You are conducting a behavioral and technical interview..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
             <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">API Usage</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">OpenAI API Quota</span>
                  <span className="font-medium text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Anthropic API Quota</span>
                  <span className="font-medium text-gray-900">12%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-4">
                Billing cycle resets in 12 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
