import styled from 'styled-components';
import { useFaq } from '../hooks/useFaq';

export default function FaqPage() {
  const {
    pagedList,
    openId,
    setOpenId,
    currentPage,
    totalPages,
    showForm,
    setShowForm,
    editTarget,
    formQ,
    setFormQ,
    formA,
    setFormA,
    deleteId,
    setDeleteId,
    submitting,
    handlePageChange,
    openWrite,
    openEdit,
    handleFormSubmit,
    handleDelete,
  } = useFaq();

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
        {pagedList.length === 0 && <Empty>등록된 FAQ가 없습니다.</Empty>}
      </Board>

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
