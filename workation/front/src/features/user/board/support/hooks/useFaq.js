import { useEffect, useState } from 'react';
import { getFaqList, createFaq, updateFaq, deleteFaq } from '../api/supportApi';

const TEMP_MEMBER_ID = 1;
const PAGE_SIZE = 10;

export function useFaq() {
  const [faqList, setFaqList] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getFaqList()
      .then(setFaqList)
      .catch((err) => console.error('FAQ 목록 조회 실패', err));
  }, []);

  const totalPages = Math.max(1, Math.ceil(faqList.length / PAGE_SIZE));
  const pagedList = faqList.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  function handlePageChange(page) {
    setCurrentPage(page);
    setOpenId(null);
  }

  function openWrite() {
    setEditTarget(null);
    setFormQ('');
    setFormA('');
    setShowForm(true);
  }

  function openEdit(faq) {
    setEditTarget(faq);
    setFormQ(faq.question);
    setFormA(faq.answer);
    setShowForm(true);
  }

  async function handleFormSubmit() {
    if (!formQ.trim()) return alert('질문을 입력해주세요.');
    if (!formA.trim()) return alert('답변을 입력해주세요.');

    try {
      setSubmitting(true);
      if (editTarget) {
        await updateFaq(editTarget.id, { question: formQ, answer: formA });
        setFaqList((prev) =>
          prev.map((f) =>
            f.id === editTarget.id
              ? { ...f, question: formQ, answer: formA }
              : f
          )
        );
      } else {
        await createFaq({ memberId: TEMP_MEMBER_ID, question: formQ, answer: formA });
        const updated = await getFaqList();
        setFaqList(updated);
        const newTotal = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
        setCurrentPage(newTotal - 1);
      }
      setShowForm(false);
    } catch (err) {
      console.error('FAQ 저장 실패', err);
      alert('저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteFaq(deleteId);
      const updated = faqList.filter((f) => f.id !== deleteId);
      setFaqList(updated);
      if (openId === deleteId) setOpenId(null);
      setDeleteId(null);
      const newTotal = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
      if (currentPage >= newTotal) setCurrentPage(newTotal - 1);
    } catch (err) {
      console.error('FAQ 삭제 실패', err);
      alert('삭제에 실패했습니다.');
    }
  }

  return {
    pagedList,
    openId, setOpenId,
    currentPage,
    totalPages,
    showForm, setShowForm,
    editTarget,
    formQ, setFormQ,
    formA, setFormA,
    deleteId, setDeleteId,
    submitting,
    handlePageChange,
    openWrite,
    openEdit,
    handleFormSubmit,
    handleDelete,
  };
}
