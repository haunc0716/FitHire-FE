import React from 'react';
import { UserCircle, Shield, Key } from 'lucide-react';

export default function AdminProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details and security preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
            A
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Super Admin</h2>
            <p className="text-gray-500">admin@fithire.com</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-gray-400" />
              Personal Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" defaultValue="Super Admin" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue="admin@fithire.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              Security
            </h3>
            <div>
              <button className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                <Key className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
