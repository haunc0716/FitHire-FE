import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Download, Shield, User, CheckCircle2, XCircle, Loader2, Eye, RotateCcw, BadgeInfo } from 'lucide-react';
import { getAdminUserById, getAdminUsers, updateAdminUserStatus } from '../services/userApi';
import { useToast } from '../../../components/ui/ToastProvider';

const STATUS_OPTIONS = [
  { id: 'ACTIVE', label: 'Hoạt động' },
  { id: 'INACTIVE', label: 'Không hoạt động' },
  { id: 'SUSPENDED', label: 'Tạm khóa' },
  { id: 'LOCKED', label: 'Khóa' },
];

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  USER: 'Người dùng',
};

const CULTURE_BADGES = {
  CLAN: { label: 'Gia đình', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ADHOCRACY: { label: 'Sáng tạo', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  MARKET: { label: 'Thị trường', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  HIERARCHY: { label: 'Thứ bậc', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động',
  SUSPENDED: 'Tạm khóa',
  LOCKED: 'Khóa',
};

function getAvatarInitial(name) {
  return (name || 'U').trim().charAt(0).toUpperCase();
}

function resolveJoinDate(user) {
  return (
    user?.createdAt ||
    user?.createdDate ||
    user?.createdOn ||
    user?.joinedAt ||
    user?.registeredAt ||
    user?.registeredDate ||
    null
  );
}

function formatDateTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('vi-VN');
}

export default function UserManagementPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminUsers();
      const items = Array.isArray(data) ? data : data?.items || data?.content || [];
      setUsers(items);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Không thể tải người dùng',
        message: err?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() => users.filter((user) => (
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )), [users, searchTerm]);

  const openUserDetail = async (user) => {
    setSelectedUser({ ...user, __fallbackStatus: user.status || 'ACTIVE' });
    setDetailLoading(true);
    try {
      const detail = await getAdminUserById(user.id);
      setSelectedUser((prev) => ({ ...prev, ...(detail || {}) }));
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Không thể tải chi tiết người dùng',
        message: err?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleChangeStatus = async (status) => {
    if (!selectedUser?.id || selectedUser?.status === status || statusUpdating) return;
    setStatusUpdating(true);
    try {
      await updateAdminUserStatus(selectedUser.id, status);
      setSelectedUser((prev) => ({ ...prev, status }));
      setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, status } : user)));
      showToast({
        type: 'success',
        title: 'Cập nhật trạng thái thành công',
        message: `Người dùng đã chuyển sang ${status}.`
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Cập nhật trạng thái thất bại',
        message: err?.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản, vai trò và trạng thái người dùng trên nền tảng.</p>
        </div>
        <button className="px-4 py-2 flex items-center gap-2 bg-white border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Xuất CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm outline-none transition-all duration-200"
            />
          </div>
          <button onClick={fetchUsers} className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Làm mới
          </button>
          <button className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors">
            <Filter className="w-4 h-4" />
            Bộ lọc
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
                  <th className="px-6 py-4 font-bold">Người dùng</th>
                  <th className="px-6 py-4 font-bold">Vai trò</th>
                  <th className="px-6 py-4 font-bold">Văn hóa</th>
                  <th className="px-6 py-4 font-bold">Trạng thái</th>
                  <th className="px-6 py-4 font-bold">Ngày tham gia</th>
                  <th className="px-6 py-4 font-bold text-right">Thao tác</th>
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
                            getAvatarInitial(user.fullName)
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
                        {ROLE_LABELS[user.role] || 'Không rõ'}
                      </span>
                    </td>
                    <td className="px-6 py-4">                      {user.primaryCulture ? (
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${CULTURE_BADGES[user.primaryCulture]?.color || 'bg-stone-100 text-stone-700 border-stone-200'}`}>
                          {CULTURE_BADGES[user.primaryCulture]?.label || user.primaryCulture}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs italic">Chưa đánh giá</span>
                      )}
                    </td>
                    <td className="px-6 py-4">                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'ACTIVE' || !user.status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {(user.status === 'ACTIVE' || !user.status) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {STATUS_LABELS[user.status || 'ACTIVE'] || 'Không rõ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {formatDateTime(resolveJoinDate(user))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openUserDetail(user)} className="inline-flex items-center gap-2 px-3 py-2 text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                        <Eye className="w-4 h-4" />
                        Chi tiết
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
          <span>Hiển thị {filteredUsers.length} kết quả</span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors">Trước</button>
            <button className="px-4 py-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">Sau</button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-stone-900/60" onClick={() => setSelectedUser(null)} />
          <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900">Chi tiết người dùng</h3>
                <p className="text-sm text-stone-500">Xem thông tin và thay đổi trạng thái tài khoản.</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-stone-400 hover:text-stone-900">&times;</button>
            </div>

            <div className="grid gap-6 md:grid-cols-[220px_1fr] mt-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center text-2xl font-bold text-emerald-700">
                  {selectedUser.avatarUrl ? <img src={selectedUser.avatarUrl} alt={selectedUser.fullName} className="w-full h-full object-cover" /> : getAvatarInitial(selectedUser.fullName)}
                </div>
                <div className="text-center">
                  <div className="font-bold text-stone-900">{selectedUser.fullName || 'N/A'}</div>
                  <div className="text-sm text-stone-500 break-all">{selectedUser.email}</div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedUser.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    selectedUser.role === 'USER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-stone-100 text-stone-700 border-stone-200'
                  }`}>
                    {selectedUser.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                    {selectedUser.role === 'USER' && <User className="w-3 h-3" />}
                    {ROLE_LABELS[selectedUser.role] || 'Không rõ'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedUser.status === 'ACTIVE' || !selectedUser.status
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {(selectedUser.status === 'ACTIVE' || !selectedUser.status) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {STATUS_LABELS[selectedUser.status || 'ACTIVE'] || 'Không rõ'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {detailLoading ? (
                  <div className="flex items-center gap-2 text-stone-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải chi tiết...
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="rounded-2xl bg-stone-50 p-4 col-span-2">
                        <div className="text-stone-400">Văn hóa doanh nghiệp</div>
                        <div className="font-semibold text-stone-900">
                          {selectedUser.cultureType || selectedUser.culturalType || selectedUser.primaryCulture || selectedUser.culturalFitPrimary || 'Chưa có dữ liệu'}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <div className="text-stone-400">Ngày tham gia</div>
                        <div className="font-semibold text-stone-900">{formatDateTime(resolveJoinDate(selectedUser))}</div>
                      </div>
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <div className="text-stone-400">Đăng nhập gần nhất</div>
                        <div className="font-semibold text-stone-900">{formatDateTime(selectedUser.lastLoginAt)}</div>
                      </div>
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <div className="text-stone-400">Email</div>
                        <div className="font-semibold text-stone-900 break-all">{selectedUser.email || 'N/A'}</div>
                      </div>
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <div className="text-stone-400">Mã người dùng</div>
                        <div className="font-semibold text-stone-900">{selectedUser.id || 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-stone-700 mb-2">Cập nhật trạng thái</div>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleChangeStatus(option.id)}
                            disabled={statusUpdating || selectedUser.status === option.id}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                              selectedUser.status === option.id
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                            } disabled:opacity-60`}
                          >
                            {statusUpdating && selectedUser.status !== option.id ? <Loader2 className="inline h-4 w-4 animate-spin mr-2" /> : null}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
