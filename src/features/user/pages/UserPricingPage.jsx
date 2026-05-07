import React from 'react';
import PricingCards from '../../pricing/components/PricingCards';
import ComparisonTable from '../../pricing/components/ComparisonTable';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function UserPricingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-10 bg-emerald-600/40"></div>
          <span className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-800">
            Upgrade Your Career
          </span>
          <div className="h-px w-10 bg-emerald-600/40"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Flexible Plans for Every Stage</h1>
        <p className="text-gray-500 max-w-2xl mx-auto italic leading-relaxed">Choose a plan that fits your current job search needs. Upgrade or downgrade anytime.</p>
      </div>

      {/* Pricing Cards */}
      <PricingCards />

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-gray-100">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-gray-900">Secure Payments</h4>
               <p className="text-xs text-gray-500">Industry standard encryption.</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
               <Sparkles className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-gray-900">AI Guarantee</h4>
               <p className="text-xs text-gray-500">Powered by latest GPT-4 models.</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
               <Zap className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold text-gray-900">Instant Access</h4>
               <p className="text-xs text-gray-500">Features unlocked immediately.</p>
            </div>
         </div>
      </div>

      {/* Detailed Comparison */}
      <div className="space-y-8">
         <h2 className="text-2xl font-bold text-gray-900 text-center">Compare All Features</h2>
         <ComparisonTable />
      </div>
    </div>
  );
}
