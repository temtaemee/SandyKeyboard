import { useState } from 'react';
import styled from 'styled-components';

const initialFaqList = [
  {
    id: 1,
    question: '예약은 어떻게 하나요?',
    answer:
      '홈페이지에서 원하시는 숙소를 선택한 후, 날짜와 인원을 설정하고 예약하기 버튼을 클릭하시면 됩니다. 결제 완료 후 예약이 확정됩니다.',
  },
  {
    id: 2,
    question: '환불은 가능한가요?',
    answer:
      '체크인 7일 전까지는 전액 환불이 가능합니다. 그 이후에는 부분 환불 또는 환불이 불가할 수 있으니 예약 전 환불 정책을 꼭 확인해 주세요.',
  },
  {
    id: 3,
    question: '쿠폰은 어떻게 사용하나요?',
    answer:
      '결제 페이지에서 쿠폰 코드 입력란에 발급받은 코드를 입력하시면 자동으로 할인이 적용됩니다. 쿠폰은 1회 예약에 1장만 사용 가능합니다.',
  },
];

export default function FaqPage() {
  const [faqList, setFaqList] = useState(initialFaqList);
  const [openId, setOpenId] = useState(null);

  // 글쓰기 / 수정 모달 상태
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null이면 신규, 객체면 수정
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');

  // 삭제 확인 모달 상태
  const [deleteId, setDeleteId] = useState(null);

  /* ── 글쓰기 열기 ── */
  function openWrite() {
    setEditTarget(null);
    setFormQ('');
    setFormA('');
    setShowForm(true);
  }

  /* ── 수정 열기 ── */
  function openEdit(faq) {
    setEditTarget(faq);
    setFormQ(faq.question);
    setFormA(faq.answer);
    setShowForm(true);
  }

  /* ── 등록 / 수정 저장 ── */
  function handleFormSubmit() {
    if (!formQ.trim()) return alert('질문을 입력해주세요.');
    if (!formA.trim()) return alert('답변을 입력해주세요.');

    if (editTarget) {
      // 수정
      setFaqList((prev) =>
        prev.map((f) =>
          f.id === editTarget.id ? { ...f, question: formQ, answer: formA } : f
        )
      );
    } else {
      // 신규 등록
      const newFaq = {
        id: Date.now(),
        question: formQ,
        answer: formA,
      };
      setFaqList((prev) => [...prev, newFaq]);
    }

    setShowForm(false);
  }

  /* ── 삭제 ── */
  function handleDelete() {
    setFaqList((prev) => prev.filter((f) => f.id !== deleteId));
    setDeleteId(null);
    if (openId === deleteId) setOpenId(null);
  }

  return (
    <Wrapper>
      {/* 글쓰기 버튼 */}
      <TopRow>
        <WriteButton onClick={openWrite}>✏️ 글쓰기</WriteButton>
      </TopRow>

      {/* FAQ 아코디언 목록 */}
      <Board>
        {faqList.map((faq) => (
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

      {/* ── 글쓰기 / 수정 모달 ── */}
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
              <ModalConfirm onClick={handleFormSubmit}>
                {editTarget ? '저장' : '등록'}
              </ModalConfirm>
            </FormButtons>
          </FormModal>
        </Overlay>
      )}

      {/* ── 삭제 확인 모달 ── */}
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
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  background: black;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #222;
  }
`;

const Board = styled.div`
  border-top: 2px solid black;
`;

const Item = styled.div`
  border-bottom: 1px solid #e5e7eb;
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
  padding: 24px 10px;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  &:hover {
    color: #2c6480;
  }
`;

const QBadge = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: black;
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
  color: #bbb;
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
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;

const ItemDeleteBtn = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
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
  padding: 0 10px 28px 10px;
`;

const ABadge = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #555;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnswerText = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  padding-top: 4px;
`;

const Empty = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #bbb;
  font-size: 15px;
`;

/* ── 모달 공통 ── */

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
  background: white;
  border-radius: 20px;
  padding: 40px 48px;
  width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #999;
`;

const FormInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  color: #333;
  outline: none;
  &:focus {
    border-color: #2c6480;
  }
  &::placeholder {
    color: #bbb;
  }
`;

const FormTextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  color: #333;
  outline: none;
  resize: none;
  min-height: 120px;
  line-height: 1.7;
  &:focus {
    border-color: #2c6480;
  }
  &::placeholder {
    color: #bbb;
  }
`;

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const ModalCancel = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #f3f4f6;
  }
`;

const ModalConfirm = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  background: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #222;
  }
`;

const ModalDelete = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #dc2626;
  }
`;
