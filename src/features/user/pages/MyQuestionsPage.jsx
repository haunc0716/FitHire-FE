import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, Save, Loader2, MessageSquareText,
  HelpCircle, Clock, CheckCircle2, Tag, Search, ChevronRight, MessageCircle, Send
} from 'lucide-react';
import {
  createMyQuestion,
  deleteMyQuestion,
  getMyQuestionById,
  getMyQuestions,
  updateMyQuestion,
} from '../services/questionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const STATUS_STYLES = {
  PENDING: { label: 'Chờ trả lời', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'border-amber-200' },
  ANSWERED: { label: 'Đã trả lời', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'border-emerald-200' },
  CLOSED: { label: 'Đã đóng', bg: 'bg-stone-100', text: 'text-stone-600', ring: 'border-stone-200' },
};

const CATEGORY_OPTIONS = [
  { value: '', label: 'Chung' },
  { value: 'Tài khoản', label: 'Tài khoản' },
  { value: 'Gói dịch vụ', label: 'Gói dịch vụ' },
  { value: 'Thanh toán', label: 'Thanh toán' },
  { value: 'Tính năng', label: 'Tính năng' },
  { value: 'Khác', label: 'Khác' },
];

const emptyForm = { title: '', content: '', category: '' };

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return value;
  }
}

export default function MyQuestionsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [keyword, setKeyword] = useState('');
  const [viewing, setViewing] = useState(null);
  const [viewingLoading, setViewingLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getMyQuestions();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast({ type: 'error', title: 'Không tải được danh sách', message: error?.message || 'Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => {
    if (!keyword.trim()) return items;
    const k = keyword.toLowerCase();
    return items.filter((q) =>
      (q.title || '').toLowerCase().includes(k) ||
      (q.content || '').toLowerCase().includes(k) ||
      (q.category || '').toLowerCase().includes(k)
    );
  }, [items, keyword]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((q) => q.status === 'PENDING').length,
    answered: items.filter((q) => q.status === 'ANSWERED').length,
  }), [items]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (q) => {
    if (q.status !== 'PENDING') {
      showToast({ type: 'warning', title: 'Không thể sửa', message: 'Câu hỏi đã được trả lời nên không chỉnh sửa được.' });
      return;
    }
    setEditing(q);
    setForm({ title: q.title || '', content: q.content || '', category: q.category || '' });
    setModalOpen(true);
  };
  const closeModal = () => { if (!saving) setModalOpen(false); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showToast({ type: 'warning', title: 'Thiếu thông tin', message: 'Vui lòng nhập tiêu đề và nội dung câu hỏi.' });
      return;
    }
    setSaving(true);
    try {
      const payload = { title: form.title.trim(), content: form.content.trim(), category: form.category || null };
      if (editing?.questionId) await updateMyQuestion(editing.questionId, payload);
      else await createMyQuestion(payload);
      await fetchItems();
      setModalOpen(false);
      showToast({ type: 'success', title: 'Đã lưu', message: 'Câu hỏi của bạn đã được gửi tới admin.' });
    } catch (error) {
      showToast({ type: 'error', title: 'Không thể lưu', message: error?.message || 'Vui lòng thử lại sau.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (q) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa câu hỏi "${q.title}"?`)) return;
    try {
      await deleteMyQuestion(q.questionId);
      await fetchItems();
      showToast({ type: 'success', title: 'Đã xóa', message: 'Câu hỏi đã được xóa.' });
    } catch (error) {
      showToast({ type: 'error', title: 'Xóa thất bại', message: error?.message || 'Vui lòng thử lại sau.' });
    }
  };

  const openView = async (q) => {
    setViewing(q);
    setViewingLoading(true);
    try {
      const detail = await getMyQuestionById(q.questionId);
      setViewing(detail);
    } catch (error) {
      showToast({ type: 'error', title: 'Không tải được', message: error?.message });
    } finally { setViewingLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Hỏi đáp với Admin</h1>
            <p className="text-stone-500 mt-1">Gửi câu hỏi của bạn cho đội ngũ quản trị. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-2xl bg-[#00b14f] px-5 py-3 font-bold text-white shadow-lg shadow-emerald-100 hover:bg-[#009b45]">
            <Plus className="h-5 w-5" /> Đặt câu hỏi mới
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-700"><MessageSquareText className="h-5 w-5" /></div>
              <div><p className="text-sm text-stone-500">Tổng câu hỏi</p><p className="text-2xl font-bold text-stone-900">{stats.total}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Clock className="h-5 w-5" /></div>
              <div><p className="text-sm text-amber-700">Đang chờ</p><p className="text-2xl font-bold text-amber-700">{stats.pending}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div>
              <div><p className="text-sm text-emerald-700">Đã trả lời</p><p className="text-2xl font-bold text-emerald-700">{stats.answered}</p></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm theo tiêu đề, nội dung, danh mục..." className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white" />
          </div>
        </div>

        <div className="rounded-3xl border border-stone-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-stone-500 gap-3"><Loader2 className="h-5 w-5 animate-spin text-emerald-500" /> Đang tải câu hỏi...</div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-stone-500">
              <HelpCircle className="h-10 w-10 mx-auto mb-3 text-stone-300" />
              <p className="font-semibold text-stone-700">Chưa có câu hỏi nào</p>
              <p className="text-sm mt-1">Bấm "Đặt câu hỏi mới" để gửi thắc mắc tới admin.</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {filteredItems.map((q) => {
                const status = STATUS_STYLES[q.status] ?? STATUS_STYLES.PENDING;
                const hasAnswers = (q.answers?.length ?? 0) > 0;
                return (
                  <li key={q.questionId} className="p-5 hover:bg-stone-50/60 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.bg} ${status.text} ${status.ring}`}>{status.label}</span>
                          {q.category && <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600"><Tag className="h-3 w-3" /> {q.category}</span>}
                          {hasAnswers && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><MessageCircle className="h-3 w-3" /> {q.answers.length} câu trả lời</span>}
                          <span className="text-[11px] text-stone-400">{formatDate(q.createdAt)}</span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 mb-1 line-clamp-2">{q.title}</h3>
                        <p className="text-sm text-stone-600 line-clamp-2">{q.content}</p>
                      </div>
                      <div className="flex md:flex-col items-center gap-2 shrink-0">
                        <button onClick={() => openView(q)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100">Xem <ChevronRight className="h-4 w-4" /></button>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(q)} disabled={q.status !== 'PENDING'} className="rounded-xl border border-stone-200 p-2 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed" title="Sửa"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(q)} className="rounded-xl border border-red-100 p-2 text-red-600 hover:bg-red-50" title="Xóa"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/60 px-7 py-5">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">{editing ? 'Chỉnh sửa câu hỏi' : 'Đặt câu hỏi mới'}</h2>
                  <p className="text-sm text-stone-500 mt-0.5">{editing ? 'Cập nhật nội dung và gửi lại cho admin.' : 'Mô tả chi tiết để admin có thể hỗ trợ bạn tốt nhất.'}</p>
                </div>
                <button onClick={closeModal} className="rounded-full p-2 text-stone-400 hover:bg-stone-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">Danh mục</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500">
                    {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">Tiêu đề <span className="text-red-500">*</span></label>
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} maxLength={255} placeholder="Tóm tắt vấn đề của bạn..." className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">Nội dung <span className="text-red-500">*</span></label>
                  <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={6} placeholder="Mô tả chi tiết câu hỏi của bạn..." className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-stone-100 bg-stone-50/60 px-7 py-4">
                <button onClick={closeModal} className="rounded-2xl px-5 py-3 text-sm font-bold text-stone-500 hover:bg-stone-100">Hủy</button>
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-[#00b14f] px-6 py-3 text-sm font-bold text-white hover:bg-[#009b45] disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {editing ? 'Cập nhật' : 'Gửi câu hỏi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewing(null)} className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/60 px-7 py-5">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Chi tiết câu hỏi</h2>
                  <p className="text-sm text-stone-500 mt-0.5">Gửi lúc {formatDate(viewing.createdAt)}</p>
                </div>
                <button onClick={() => setViewing(null)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-7 overflow-y-auto space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).bg} ${(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).text} ${(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).ring}`}>
                    {(STATUS_STYLES[viewing.status] ?? STATUS_STYLES.PENDING).label}
                  </span>
                  {viewing.category && <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600"><Tag className="h-3 w-3" /> {viewing.category}</span>}
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{viewing.title}</h3>
                <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-5">
                  <p className="text-sm text-stone-700 whitespace-pre-wrap">{viewing.content}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">Câu trả lời ({viewing.answers?.length || 0})</h4>
                  {viewingLoading ? (
                    <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> Đang tải...</div>
                  ) : (viewing.answers?.length ?? 0) === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stone-200 p-6 text-center text-sm text-stone-500">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                      Câu hỏi của bạn đang chờ admin phản hồi.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {viewing.answers.map((a) => (
                        <div key={a.answerId} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                          <div className="flex items-center gap-2 mb-2 text-xs text-stone-500">
                            <span className="font-bold text-emerald-700">{a.admin?.fullName || 'Admin'}</span>
                            <span>•</span>
                            <span>{formatDate(a.createdAt)}</span>
                          </div>
                          <p className="text-sm text-stone-700 whitespace-pre-wrap">{a.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { STATUS_STYLES, CATEGORY_OPTIONS, formatDate, emptyForm };
