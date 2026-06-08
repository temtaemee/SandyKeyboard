import { useFaq } from '../hooks/useFaq';
import {
  Wrapper,
  TopRow,
  WriteButton,
  Board,
  Item,
  QuestionRow,
  QuestionText,
  QBadge,
  Arrow,
  ItemButtons,
  ItemEditBtn,
  ItemDeleteBtn,
  Answer,
  ABadge,
  AnswerText,
  Empty,
  Pagination,
  PageBtn,
  Overlay,
  FormModal,
  FormTitle,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextArea,
  FormButtons,
  Modal,
  ModalText,
  ModalCancel,
  ModalConfirm,
  ModalDelete,
} from '../styles/FaqPage.styles';

// 토큰에서 role 확인
function getRole() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles ?? [];
    if (roles.includes('ADMIN')) return 'ADMIN';
    return 'USER';
  } catch {
    return null;
  }
}

const isAdmin = getRole() === 'ADMIN';

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
      {/* 글쓰기 버튼 — admin만 표시 */}
      {isAdmin && (
        <TopRow>
          <WriteButton onClick={openWrite}>✏️ 글쓰기</WriteButton>
        </TopRow>
      )}

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

              {/* 수정/삭제 버튼 — admin만 표시 */}
              {isAdmin && (
                <ItemButtons>
                  <ItemEditBtn onClick={() => openEdit(faq)}>수정</ItemEditBtn>
                  <ItemDeleteBtn onClick={() => setDeleteId(faq.id)}>
                    삭제
                  </ItemDeleteBtn>
                </ItemButtons>
              )}
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
