import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Loader2, ListChecks, ArrowUpDown } from 'lucide-react';
import {
  createAdminAssessmentQuestion,
  deleteAdminAssessmentQuestion,
  getAdminAssessmentQuestions,
  updateAdminAssessmentQuestion,
} from '../services/assessmentQuestionApi';
import { useToast } from '../../../components/ui/ToastProvider';

const emptyOption = () => ({
  optionLabel: '',
  content: '',
  cultureType: 'CLAN',
  scoreValue: 1,
});

const emptyForm = {
  code: '',
  content: '',
  displayOrder: 0,
  active: true,
  options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
};

const CULTURE_LABELS = {
  CLAN: 'Clan',
  ADHOCRACY: 'Adhocracy',
  MARKET: 'Market',
  HIERARCHY: 'Hierarchy',
};

function normalizeQuestion(question) {
  return {
    questionId: question.questionId,
    code: question.code,
    content: question.content,
    displayOrder: question.displayOrder ?? 0,
    active: Boolean(question.active),
    options: Array.isArray(question.options) ? question.options : [],
    raw: question,
  };
}

export default function AssessmentQuestionManagementPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sortedItems = useMemo(() => [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)), [items]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAdminAssessmentQuestions();
      setItems(Array.isArray(data) ? data.map(normalizeQuestion) : []);
    } catch (error) {
      showToast({ type: 'error', title: 'Không tải được câu hỏi', message: error?.message || 'Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (question) => {
    setEditing(question);
    setForm({
      code: question.code,
      content: question.content,
      displayOrder: question.displayOrder,
      active: question.active,
      options: (question.options?.length ? question.options : [emptyOption(), emptyOption(), emptyOption(), emptyOption()]).map((option, index) => ({
        optionLabel: option.optionLabel ?? String.fromCharCode(65 + index),
        content: option.content ?? '',
        cultureType: option.cultureType ?? 'CLAN',
        scoreValue: option.scoreValue ?? 1,
      })),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim(),
        content: form.content.trim(),
        displayOrder: Number(form.displayOrder),
        active: Boolean(form.active),
        options: (form.options || [])
          .map((option, index) => ({
            optionLabel: (option.optionLabel || String.fromCharCode(65 + index)).trim(),
            content: option.content.trim(),
            cultureType: option.cultureType,
            scoreValue: Number(option.scoreValue),
          }))
          .filter((option) => option.content),
      };

      if (editing?.questionId) {
        await updateAdminAssessmentQuestion(editing.questionId, payload);
      } else {
        await createAdminAssessmentQuestion(payload);
      }
      await fetchItems();
      setModalOpen(false);
      showToast({ type: 'success', title: 'Đã lưu câu hỏi', message: 'Câu hỏi văn hóa đã được cập nhật.' });
    } catch (error) {
      showToast({ type: 'error', title: 'Không thể lưu', message: error?.message || 'Vui lòng thử lại sau.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (question) => {
    if (!question?.questionId) return;
    if (!window.confirm(`Bạn chắc chắn muốn xóa câu hỏi "${question.code}"?`)) return;
    try {
      await deleteAdminAssessmentQuestion(question.questionId);
      await fetchItems();
      showToast({ type: 'success', title: 'Đã xóa', message: 'Câu hỏi đã được xóa khỏi hệ thống.' });
    } catch (error) {
      showToast({ type: 'error', title: 'Xóa thất bại', message: error?.message || 'Vui lòng thử lại sau.' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Quản lý câu hỏi văn hóa</h1>
          <p className="text-stone-500 mt-1">Thêm, sửa, xóa câu hỏi và đáp án cho bài đánh giá văn hóa doanh nghiệp.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#00b14f] px-5 py-3 font-bold text-white shadow-lg shadow-emerald-100 hover:bg-[#009b45]"
        >
          <Plus className="h-5 w-5" />
          Thêm câu hỏi
        </button>
      </div>

      <div className="rounded-[28px] border border-stone-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/50 px-6 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
            <ListChecks className="h-4 w-4" />
            Danh sách câu hỏi
          </div>
          <button onClick={fetchItems} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            Đang tải câu hỏi...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-6 py-4 text-left">Mã</th>
                  <th className="px-6 py-4 text-left">Nội dung</th>
                  <th className="px-6 py-4 text-left">Thứ tự</th>
                  <th className="px-6 py-4 text-left">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedItems.map((question) => (
                  <tr key={question.questionId} className="hover:bg-stone-50/60">
                    <td className="px-6 py-4 font-bold text-stone-900">{question.code}</td>
                    <td className="px-6 py-4 text-stone-600 max-w-[520px]">
                      <div className="line-clamp-2">{question.content}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {question.options.slice(0, 4).map((option) => (
                          <span key={option.optionId} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            {option.optionLabel}: {option.cultureType}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{question.displayOrder}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${question.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {question.active ? 'Đang bật' : 'Đang tắt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openEdit(question)} className="rounded-xl border border-stone-200 p-2 text-stone-600 hover:bg-stone-50">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(question)} className="rounded-xl border border-red-100 p-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/60 px-8 py-5">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">{editing ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới'}</h2>
                  <p className="text-sm text-stone-500">Nhập đủ 4 đáp án cho bài test văn hóa.</p>
                </div>
                <button onClick={closeModal} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-700">Mã câu hỏi</label>
                    <input
                      value={form.code}
                      onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                      className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                      placeholder="VD: CULTURE_Q01"
                      disabled={!!editing}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-700">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
                      className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">Nội dung câu hỏi</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full rounded-[24px] border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                    placeholder="Nhập nội dung câu hỏi..."
                  />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-stone-700">Kích hoạt câu hỏi</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900">4 đáp án</h3>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, options: [...(prev.options || []), emptyOption()] }))}
                      className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      Thêm đáp án
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(form.options || []).map((option, index) => (
                      <div key={index} className="rounded-[24px] border border-stone-100 bg-stone-50/70 p-4">
                        <div className="grid gap-4 md:grid-cols-12">
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Nhãn</label>
                            <input
                              value={option.optionLabel}
                              onChange={(e) => setForm((prev) => {
                                const next = [...prev.options];
                                next[index] = { ...next[index], optionLabel: e.target.value };
                                return { ...prev, options: next };
                              })}
                              className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                              placeholder={String.fromCharCode(65 + index)}
                            />
                          </div>
                          <div className="md:col-span-5">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Nội dung đáp án</label>
                            <input
                              value={option.content}
                              onChange={(e) => setForm((prev) => {
                                const next = [...prev.options];
                                next[index] = { ...next[index], content: e.target.value };
                                return { ...prev, options: next };
                              })}
                              className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                              placeholder="Nội dung đáp án..."
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Culture type</label>
                            <select
                              value={option.cultureType}
                              onChange={(e) => setForm((prev) => {
                                const next = [...prev.options];
                                next[index] = { ...next[index], cultureType: e.target.value };
                                return { ...prev, options: next };
                              })}
                              className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                            >
                              {Object.entries(CULTURE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Điểm</label>
                            <input
                              type="number"
                              value={option.scoreValue}
                              onChange={(e) => setForm((prev) => {
                                const next = [...prev.options];
                                next[index] = { ...next[index], scoreValue: e.target.value };
                                return { ...prev, options: next };
                              })}
                              className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-stone-100 bg-stone-50/60 px-8 py-5">
                <button onClick={closeModal} className="rounded-2xl px-5 py-3 text-sm font-bold text-stone-500 hover:bg-stone-100">
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#00b14f] px-6 py-3 text-sm font-bold text-white hover:bg-[#009b45] disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Lưu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
