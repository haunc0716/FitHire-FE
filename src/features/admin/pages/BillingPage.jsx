import React, { useState } from 'react';
import { CreditCard, Download, ArrowUpRight, CheckCircle2, XCircle, Loader2, MoreVertical, Check, X } from 'lucide-react';
import { markPaymentSuccess, markPaymentFailed } from '../services/paymentApi';

const initialTransactions = [
  { id: 'TRX-9823', user: 'Sarah Jenkins', plan: 'Premium Pro', amount: '$29.00', date: 'Today, 2:30 PM', status: 'COMPLETED' },
  { id: 'TRX-9822', user: 'David Kim', plan: 'Premium Basic', amount: '$15.00', date: 'Today, 10:15 AM', status: 'PENDING' },
  { id: 'TRX-9821', user: 'Emma Wilson', plan: 'Premium Pro', amount: '$29.00', date: 'Yesterday', status: 'FAILED' },
  { id: 'TRX-9820', user: 'TechCorp Inc.', plan: 'Enterprise', amount: '$299.00', date: 'Yesterday', status: 'COMPLETED' },
];

export default function BillingPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleUpdateStatus = async (paymentId, success) => {
    setUpdatingId(paymentId);
    setMessage({ text: '', type: '' });
    try {
      if (success) {
        await markPaymentSuccess(paymentId);
        setTransactions(prev => prev.map(t => t.id === paymentId ? { ...t, status: 'COMPLETED' } : t));
        setMessage({ text: `Đã xác nhận thanh toán ${paymentId} thành công.`, type: 'success' });
      } else {
        await markPaymentFailed(paymentId);
        setTransactions(prev => prev.map(t => t.id === paymentId ? { ...t, status: 'FAILED' } : t));
        setMessage({ text: `Đã đánh dấu thanh toán ${paymentId} thất bại.`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: err?.message || 'Thao tác thất bại.', type: 'error' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Subscription & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor revenue, active subscriptions, and payment history.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-[#00b14f] text-white text-sm font-bold rounded-xl hover:bg-[#009b45] transition-colors shadow-sm shadow-emerald-100">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-600 text-sm">Monthly Revenue (MRR)</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-stone-900">$24,500</span>
            <span className="flex items-center text-xs font-bold text-emerald-600 mb-1 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +15.3%
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-600 text-sm">Active Subscribers</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-stone-900">1,245</span>
            <span className="flex items-center text-xs font-bold text-emerald-600 mb-1 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +5.2%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-600 text-sm">Failed Payments</h3>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-stone-900">12</span>
            <span className="text-xs font-medium text-stone-400 mb-1">
              this month
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 border-b border-stone-100 bg-stone-50/30">
          <h2 className="text-base font-bold text-stone-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-stone-500 uppercase bg-stone-50/50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 font-bold">Transaction ID</th>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Plan</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-stone-900">{trx.id}</td>
                  <td className="px-6 py-4 text-stone-600 font-medium">{trx.user}</td>
                  <td className="px-6 py-4 text-stone-500">{trx.plan}</td>
                  <td className="px-6 py-4 font-bold text-stone-900">{trx.amount}</td>
                  <td className="px-6 py-4 text-stone-400 text-xs">{trx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider ${
                      trx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      trx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {trx.status === 'PENDING' ? (
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleUpdateStatus(trx.id, true)}
                          disabled={updatingId === trx.id}
                          title="Approve"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100"
                        >
                          {updatingId === trx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(trx.id, false)}
                          disabled={updatingId === trx.id}
                          title="Reject"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
                        >
                          {updatingId === trx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                        </button>
                      </div>
                    ) : (
                      <button className="text-stone-300 hover:text-stone-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    )}
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
