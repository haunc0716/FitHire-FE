import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, X, Search, MessageSquareText, Clock, CheckCircle2, Archive,
  Tag, MessageCircle, Send, Trash2, Eye
} from 'lucide-react';
import {
  answerAdminQuestion,
  deleteAdminQuestion,
  getAdminQuestionById,
  getAdminQuestions,
  updateAdminQuestionStatus,
} from '../services/questionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const STATUS_STYLES = {
  PENDING: { label: 'Chờ trả lời', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'border-amber-200' },
  ANSWERED: { label: 'Đã trả lời', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'border-emerald-200' },
  CLOSED: { label: 'Đã đóng', bg: 'bg-stone-100', text: 'text-stone-600', ring: 'border-stone-200' },
};

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return value; }
}

export default function QuestionManagementPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewing, setViewing] = useState(null);
  const [viewingLoading, setViewingLoading] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchItems = async (kw = keyword) => {
    setLoading(true);
    try { const data = await getAdminQuestions(kw); setItems(Array.isArray(data) ? data : []); }
    catch (error) { showToast({ type: 'error', title: 'Không tải được danh sách', message: error?.message || 'Vui lòng thử lại sau.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);
  const handleSearch = (e) => { e?.preventDefault?.(); fetchItems(keyword); };

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((q) => q.status === 'PENDING').length,
    answered: items.filter((q) => q.status === 'ANSWERED').length,
    closed: items.filter((q) => q.status === 'CLOSED').length,
  }), [items]);

  const filteredItems = useMemo(() => filterStatus === 'ALL' ? items : items.filter((q) => q.status === filterStatus), [items, filterStatus]);

  const openView = async (q) => {
    setViewing(q); setViewingLoading(true); setAnswerText('');
    try { const detail = await getAdminQuestionById(q.questionId); setViewing(detail); }
    catch (error) { showToast({ type: 'error', title: 'Không tải được', message: error?.message }); }
    finally { setViewingLoading(false); }
  };
  const closeView = () => { setViewing(null); setAnswerText(''); };

  const handleAnswer = async () => {
    if (!viewing || !answerText.trim()) { showToast({ type: 'warning', title: 'Thiếu nội dung', message: 'Vui lòng nhập câu trả lời.' }); return; }
    setSending(true);
    try {
      await answerAdminQuestion(viewing.questionId, { content: answerText.trim() });
      const detail = await getAdminQuestionById(viewing.questionId); setViewing(detail); setAnswerText('');
      await fetchItems();
      showToast({ type: 'success', title: 'Đã gửi trả lời', message: 'Câu trả lời đã được gửi tới người dùng.' });
    } catch (error) { showToast({ type: 'error', title: 'Gửi thất bại', message: error?.message || 'Vui lòng thử lại sau.' }); }
    finally { setSending(false); }
  };

  const handleStatusChange = async (q, newStatus) => {
    try {
      await updateAdminQuestionStatus(q.questionId, newStatus);
      await fetchItems();
      if (viewing?.questionId === q.questionId) { const detail = await getAdminQuestionById(q.questionId); setViewing(detail); }
      showToast({ type: 'success', title: 'Đã cập nhật', message: `Đã chuyển trạng thái sang ${STATUS_STYLES[newStatus]?.label || newStatus}.` });
    } catch (error) { showToast({ type: 'error', title: 'Cập nhật thất bại', message: error?.message }); }
  };

  const handleDelete = async (q) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa câu hỏi "${q.title}" cùng các câu trả lời?`)) return;
    try {
      await deleteAdminQuestion(q.questionId);
      if (viewing?.questionId === q.questionId) closeView();
      await fetchItems();
      showToast({ type: 'success', title: 'Đã xóa', message: 'Câu hỏi đã được xóa.' });
    } catch (error) { showToast({ type: 'error', title: 'Xóa thất bại', message: error?.message }); }
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Quản lý hỏi đáp</h1>
        <p className="text-stone-500 mt-1">Xem, trả lời và quản lý các câu hỏi của người dùng.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-700"><MessageSquareText className="h-5 w-5" /></div><div><p className="text-sm text-stone-500">Tổng</p><p className="text-2xl font-bold text-stone-900">{stats.total}</p></div></div></div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Clock className="h-5 w-5" /></div><div><p className="text-sm text-amber-700">Chờ trả lời</p><p className="text-2xl font-bold text-amber-700">{stats.pending}</p></div></div></div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-sm text-emerald-700">Đã trả lời</p><p className="text-2xl font-bold text-emerald-700">{stats.answered}</p></div></div></div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-200 text-stone-700"><Archive className="h-5 w-5" /></div><div><p className="text-sm text-stone-600">Đã đóng</p><p className="text-2xl font-bold text-stone-700">{stats.closed}</p></div></div></div>
      </div>

      <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm theo tiêu đề hoặc nội dung..." className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-600 outline-none focus:border-emerald-500">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ trả lời</option>
            <option value="ANSWERED">Đã trả lời</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
          <button type="submit" className="rounded-xl bg-[#00b14f] px-5 py-3 text-sm font-bold text-white hover:bg-[#009b45]">Tìm kiếm</button>
        </form>
      </div>

      <div className="rounded-[28px] border border-stone-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 gap-3"><Loader2 className="h-5 w-5 animate-spin text-emerald-500" /> Đang tải...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <MessageSquareText className="h-10 w-10 mx-auto mb-3 text-stone-300" />
            <p className="font-semibold text-stone-700">Không có câu hỏi nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
                <tr><th className="px-6 py-4 text-left">Người hỏi</th><th className="px-6 py-4 text-left">Tiêu đề</th><th className="px-6 py-4 text-left">Danh mục</th><th className="px-6 py-4 text-left">Trạng thái</th><th className="px-6 py-4 text-left">Ngày gửi</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredItems.map((q) => {
                  const status = STATUS_STYLES[q.status] ?? STATUS_STYLES.PENDING;
                  return (
                    <tr key={q.questionId} className="hover:bg-stone-50/60">
                      <td className="px-6 py-4"><div className="font-semibold text-stone-900">{q.user?.fullName || 'N/A'}</div><div className="text-xs text-stone-500">{q.user?.email}</div></td>
                      <td className="px-6 py-4 max-w-[360px]">
                        <div className="font-semibold text-stone-900 line-clamp-1">{q.title}</div>
                        <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">{q.content}</div>
                        {(q.answers?.length ?? 0) > 0 && <div className="text-[11px] font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {q.answers.length} câu trả lời</div>}
                      </td>
                      <td className="px-6 py-4">{q.category ? <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600"><Tag className="h-3 w-3" /> {q.category}</span> : <span className="text-xs text-stone-400">-</span>}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${status.bg} ${status.text} ${status.ring}`}>{status.label}</span></td>
                      <td className="px-6 py-4 text-xs text-stone-500">{formatDate(q.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => openView(q)} className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Xem</button>
                          <button onClick={() => handleDelete(q)} className="rounded-xl border border-red-100 p-2 text-red-600 hover:bg-red-50" title="Xóa"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeView} className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/60 px-7 py-5">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Chi tiết câu hỏi</h2>
                  <p className="text-sm text-stone-500 mt-0.5">Từ {viewing.user?.fullName} • {viewing.user?.email}</p>
                </div>
                <button onClick={closeView} className="rounded-full p-2 text-stone-400 hover:bg-stone-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-7 overflow-y-auto space-y-5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).bg} ${(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).text} ${(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).ring}`}>{(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).label}</span>
                  {viewing.category && <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600"><Tag className="h-3 w-3" /> {viewing.category}</span>}
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{viewing.title}</h3>
                <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-5"><p className="text-sm text-stone-700 whitespace-pre-wrap">{viewing.content}</p></div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">Câu trả lời ({viewing.answers?.length || 0})</h4>
                  {viewingLoading ? <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> Đang tải...</div>
                  : (viewing.answers?.length ?? 0) === 0 ? <div className="rounded-2xl border border-dashed border-stone-200 p-6 text-center text-sm text-stone-500">Chưa có câu trả lời nào.</div>
                  : <div className="space-y-3">{viewing.answers.map((a) => (<div key={a.answerId} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5"><div className="flex items-center gap-2 mb-2 text-xs text-stone-500"><span className="font-bold text-emerald-700">{a.admin?.fullName || 'Admin'}</span><span>•</span><span>{formatDate(a.createdAt)}</span></div><p className="text-sm text-stone-700 whitespace-pre-wrap">{a.content}</p></div>))}</div>}
                </div>
              </div>
              <div className="border-t border-stone-100 bg-stone-50/60 p-7 space-y-3">
                <label className="block text-sm font-bold text-stone-700">Trả lời câu hỏi</label>
                <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows={4} placeholder="Nhập câu trả lời của bạn..." className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-500">Đổi trạng thái:</span>
                    <button onClick={() => handleStatusChange(viewing, 'CLOSED')} className="rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-100">Đóng</button>
                    <button onClick={() => handleStatusChange(viewing, 'PENDING')} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100">Chờ</button>
                  </div>
                  <button onClick={handleAnswer} disabled={sending} className="inline-flex items-center gap-2 rounded-2xl bg-[#00b14f] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#009b45] disabled:opacity-60">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Gửi trả lời
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
