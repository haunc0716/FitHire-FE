import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Download, Shield, User, CheckCircle2, XCircle } from 'lucide-react';

const users = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Premium', status: 'Active', joined: 'Oct 12, 2023' },
  { id: 2, name: 'Michael Chen', email: 'michael.c@example.com', role: 'Free', status: 'Active', joined: 'Nov 05, 2023' },
  { id: 3, name: 'Emma Wilson', email: 'emma.w@example.com', role: 'Premium', status: 'Inactive', joined: 'Sep 21, 2023' },
  { id: 4, name: 'James Rodriguez', email: 'james.r@example.com', role: 'Admin', status: 'Active', joined: 'Jan 15, 2023' },
  { id: 5, name: 'Lisa Taylor', email: 'lisa.t@example.com', role: 'Free', status: 'Active', joined: 'Dec 02, 2023' },
  { id: 6, name: 'David Kim', email: 'david.k@example.com', role: 'Premium', status: 'Active', joined: 'Oct 28, 2023' },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform users, roles, and account statuses.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200"
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.role === 'Premium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                      {user.role === 'Premium' && <User className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Showing 1 to 6 of 12,345 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
