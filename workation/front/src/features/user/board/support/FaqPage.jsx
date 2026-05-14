import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFaqList, createFaq, updateFaq, deleteFaq } from '../api/Supportapi';

const TEMP_MEMBER_ID = 1;
const PAGE_SIZE = 10;

export default function FaqPage() {
  const [faqList, setFaqList] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-based

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 목록 전체 조회 (FAQ는 전체를 받아 프론트에서 페이징)
  useEffect(() => {
    getFaqList()
      .then(setFaqList)
      .catch((err) => console.error('FAQ 목록 조회 실패', err));
  }, []);

  // 현재 페이지에 보여줄 항목
  const totalPages = Math.max(1, Math.ceil(faqList.length / PAGE_SIZE));
  const pagedList = faqList.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  // 페이지 변경 시 열려있는 항목 닫기
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
        await createFaq({
          memberId: TEMP_MEMBER_ID,
          question: formQ,
          answer: formA,
        });
        const updated = await getFaqList();
        setFaqList(updated);
        // 등록 후 마지막 페이지로 이동
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
      // 삭제 후 현재 페이지가 범위를 벗어나면 앞 페이지로
      const newTotal = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
      if (currentPage >= newTotal) setCurrentPage(newTotal - 1);
    } catch (err) {
      console.error('FAQ 삭제 실패', err);
      alert('삭제에 실패했습니다.');
    }
  }

  return (
    <Wrapper>
      <TopRow>
        <WriteButton onClick={openWrite}>✏️ 글쓰기</WriteButton>
      </TopRow>

      <Board>
        {pagedList.map((faq) => (
          <Item key={faq.id}>
            <QuestionRow>
              <QuestionText
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <QBadge>Q</QBadge>
                {faq.question}
                <Arrow $open={openId === faq.id}>▾</Arrow>
              </QuestionText>
              <ItemButtons>
                <ItemEditBtn onClick={() => openEdit(faq)}>수정</ItemEditBtn>
                <ItemDeleteBtn onClick={() => setDeleteId(faq.id)}>
                  삭제
                </ItemDeleteBtn>
              </ItemButtons>
            </QuestionRow>

            {openId === faq.id && (
              <Answer>
                <ABadge>A</ABadge>
                <AnswerText>{faq.answer}</AnswerText>
              </Answer>
            )}
          </Item>
        ))}
        {faqList.length === 0 && <Empty>등록된 FAQ가 없습니다.</Empty>}
      </Board>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ‹
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageBtn
              key={i}
              $active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageBtn>
          ))}
          <PageBtn
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            ›
          </PageBtn>
        </Pagination>
      )}

      {/* 글쓰기/수정 모달 */}
      {showForm && (
        <Overlay>
          <FormModal>
            <FormTitle>{editTarget ? 'FAQ 수정' : 'FAQ 등록'}</FormTitle>
            <FormGroup>
              <FormLabel>질문</FormLabel>
              <FormInput
                placeholder="질문을 입력하세요"
                value={formQ}
                onChange={(e) => setFormQ(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>답변</FormLabel>
              <FormTextArea
                placeholder="답변을 입력하세요"
                value={formA}
                onChange={(e) => setFormA(e.target.value)}
              />
            </FormGroup>
            <FormButtons>
              <ModalCancel onClick={() => setShowForm(false)}>취소</ModalCancel>
              <ModalConfirm onClick={handleFormSubmit} disabled={submitting}>
                {submitting ? '저장 중...' : editTarget ? '저장' : '등록'}
              </ModalConfirm>
            </FormButtons>
          </FormModal>
        </Overlay>
      )}

      {/* 삭제 확인 모달 */}
      {deleteId && (
        <Overlay>
          <Modal>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <FormButtons>
              <ModalCancel onClick={() => setDeleteId(null)}>취소</ModalCancel>
              <ModalDelete onClick={handleDelete}>삭제</ModalDelete>
            </FormButtons>
          </Modal>
        </Overlay>
      )}
    </Wrapper>
  );
}

/* ── Styled Components ── */
const Wrapper = styled.div``;
const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;
const WriteButton = styled.button`
  padding: 9px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
`;
const Item = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const QuestionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-right: 10px;
`;
const QuestionText = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const QBadge = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Arrow = styled.span`
  margin-left: auto;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textLight};
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
`;
const ItemButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;
const ItemEditBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.accentBlue};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const ItemDeleteBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;
const Answer = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 0 10px 24px 10px;
  background: ${({ theme }) => theme.colors.bgSection};
`;
const ABadge = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentBlue};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AnswerText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.8;
  padding-top: 4px;
`;
const Empty = styled.div`
  padding: 48px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 32px;
`;
const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.textMid)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.bgSection};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;
const FormModal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 40px 48px;
  width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`;
const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textLight};
`;
const FormInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.base};
  outline: none;
  transition: border-color 0.15s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;
const FormTextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.base};
  outline: none;
  resize: none;
  min-height: 120px;
  line-height: 1.7;
  transition: border-color 0.15s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;
const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`;
const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;
const ModalCancel = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;
const ModalConfirm = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const ModalDelete = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;
