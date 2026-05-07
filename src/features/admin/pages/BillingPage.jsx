import React from 'react';
import { CreditCard, Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const transactions = [
  { id: 'TRX-9823', user: 'Sarah Jenkins', plan: 'Premium Pro', amount: '$29.00', date: 'Today, 2:30 PM', status: 'Completed' },
  { id: 'TRX-9822', user: 'David Kim', plan: 'Premium Basic', amount: '$15.00', date: 'Today, 10:15 AM', status: 'Completed' },
  { id: 'TRX-9821', user: 'Emma Wilson', plan: 'Premium Pro', amount: '$29.00', date: 'Yesterday', status: 'Failed' },
  { id: 'TRX-9820', user: 'TechCorp Inc.', plan: 'Enterprise', amount: '$299.00', date: 'Yesterday', status: 'Completed' },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor revenue, active subscriptions, and payment history.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-600">Monthly Revenue (MRR)</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">$24,500</span>
            <span className="flex items-center text-sm font-medium text-emerald-600 mb-1 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +15.3%
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-600">Active Subscribers</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">1,245</span>
            <span className="flex items-center text-sm font-medium text-emerald-600 mb-1 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-4 h-4 mr-0.5" /> +5.2%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-600">Failed Payments</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">12</span>
            <span className="text-sm font-medium text-gray-500 mb-1">
              this month
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{trx.id}</td>
                  <td className="px-6 py-4">{trx.user}</td>
                  <td className="px-6 py-4 text-gray-600">{trx.plan}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{trx.amount}</td>
                  <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                      trx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
