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
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');
  const [deleteId, setDeleteId] = useState(null);

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

  function handleFormSubmit() {
    if (!formQ.trim()) return alert('질문을 입력해주세요.');
    if (!formA.trim()) return alert('답변을 입력해주세요.');
    if (editTarget) {
      setFaqList((prev) =>
        prev.map((f) =>
          f.id === editTarget.id ? { ...f, question: formQ, answer: formA } : f
        )
      );
    } else {
      setFaqList((prev) => [
        ...prev,
        { id: Date.now(), question: formQ, answer: formA },
      ]);
    }
    setShowForm(false);
  }

  function handleDelete() {
    setFaqList((prev) => prev.filter((f) => f.id !== deleteId));
    if (openId === deleteId) setOpenId(null);
    setDeleteId(null);
  }

  return (
    <Wrapper>
      <TopRow>
        <WriteButton onClick={openWrite}>✏️ 글쓰기</WriteButton>
      </TopRow>

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
              <ModalConfirm onClick={handleFormSubmit}>
                {editTarget ? '저장' : '등록'}
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
  transition: background 0.15s;
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

/* 모달 */
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
  &:hover {
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
