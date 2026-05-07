import React, { useState } from 'react';
import { Package, Plus, MoreVertical, Check, Edit2, Trash2 } from 'lucide-react';

const initialPlans = [
  {
    id: 1,
    name: 'Free Tier',
    price: '$0',
    interval: 'forever',
    status: 'Active',
    features: ['Up to 3 CV Analyses/month', 'Basic Mock Interview (Text only)', 'Community Support'],
  },
  {
    id: 2,
    name: 'Premium Basic',
    price: '$15',
    interval: 'per month',
    status: 'Active',
    features: ['Up to 20 CV Analyses/month', '3 Video Mock Interviews', 'Standard Support', 'Basic Cultural Fit'],
  },
  {
    id: 3,
    name: 'Premium Pro',
    price: '$29',
    interval: 'per month',
    status: 'Active',
    features: ['Unlimited CV Analyses', 'Unlimited Video Interviews', 'Priority 24/7 Support', 'Advanced Analytics & Fit Score'],
    isPopular: true,
  },
];

export default function PlanManagementPage() {
  const [plans, setPlans] = useState(initialPlans);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, update, and manage pricing tiers and feature access.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden relative flex flex-col">
            {plan.isPopular && (
              <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 text-center w-full">
                Most Popular
              </div>
            )}
            
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                   <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500 mb-1">/{plan.interval}</span>
                </div>
              </div>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                {plan.status}
              </span>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Features included</p>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs text-gray-500">Last updated: 2 days ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
