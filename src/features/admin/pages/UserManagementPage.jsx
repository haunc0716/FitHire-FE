import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Download, Shield, User, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getAdminUsers } from '../services/userApi';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform users, roles, and account statuses.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-white border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200"
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-sm font-medium">Đang tải danh sách người dùng...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50/50 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Joined Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0 overflow-hidden">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                          ) : (
                            (user.fullName || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{user.fullName || 'N/A'}</div>
                          <div className="text-stone-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'USER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                        {user.role === 'USER' && <User className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'ACTIVE' || !user.status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {(user.status === 'ACTIVE' || !user.status) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-stone-400 hover:text-stone-900 transition-colors p-1 rounded-lg hover:bg-stone-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-stone-500">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500 bg-stone-50/30">
          <span>Showing {filteredUsers.length} results</span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors">Prev</button>
            <button className="px-4 py-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
