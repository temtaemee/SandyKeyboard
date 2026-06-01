// src/features/admin/pages/AdminBoardPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  MessageSquare,
  Calendar,
  PlusCircle,
  HelpCircle,
  Star,
  Tag,
  Paperclip,
  MapPin,
  Pencil,
  Trash2,
  X,
  Eye,
} from 'lucide-react';
import { BOARD_TABS } from '../data/adminBoardConstants';
import useAdminBoard from '../hooks/useAdminBoard';
import useAdminBoardUI from '../hooks/useAdminBoardUI';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import AdminSearchInput from '../components/common/AdminSearchInput';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseBtn,
} from '../components/common/AdminModal.styles'; // 모달 공통 스타일

const TOTAL = 124;
const TOTAL_PAGES = 3;

const STATUS_LABEL = {
  published: '게시 중',
  ended: '종료',
  active: '활성',
  deleted: '삭제',
  exhausted: '소진',
  ACTIVE: '활성',
  EXPIRED: '만료',
  EXHAUSTED: '소진',
};
const STATUS_COLORS = {
  published: { bg: '#dcfce7', color: '#16a34a' },
  ended: { bg: '#f1f5f9', color: '#64748b' },
  active: { bg: '#dcfce7', color: '#16a34a' },
  deleted: { bg: '#fee2e2', color: '#dc2626' },
  exhausted: { bg: '#fff7ed', color: '#ea580c' },
  ACTIVE: { bg: '#dcfce7', color: '#16a34a' },
  EXPIRED: { bg: '#f1f5f9', color: '#64748b' },
  EXHAUSTED: { bg: '#fff7ed', color: '#ea580c' },
};

const COUPON_FILTERS = ['전체', '활성', '소진', '삭제'];

export default function AdminBoardPage() {
  const [activeTab, setActiveTab] = useState('공지사항');
  const {
    posts: tabPosts,
    updatePost,
    deletePost,
    createPost,
  } = useAdminBoard(activeTab);

  const { currentPage, goToPage, reset: resetPage } = usePagination();

  // 통합 UI 훅 도입으로 복잡한 useState 제거 및 비즈니스 로직 격리
  const {
    searchQuery,
    setSearchQuery,
    couponFilter,
    setCouponFilter,
    posts,
    resetFilters,
    registerModal,
    editingPost,
    formData,
    removedFileIds,
    handleRemoveExistingFile,
    openRegisterModal,
    openEditModal,
    closeRegisterModal,
    handleFormChange,
    handleRegisterSubmit,
    detailPost,
    setDetailPost,
    handleShowDetail,
    deleteTarget,
    setDeleteTarget,
    handleDeleteConfirm,
  } = useAdminBoardUI({
    tabPosts,
    activeTab,
    updatePost,
    deletePost,
    createPost,
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetFilters();
    resetPage();
  };

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>게시판 관리</PageTitle>
          <PageSub>사용자 후기, 공지사항 및 Q&A를 통합 관리합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 상단: 콘텐츠 신규 등록 ── */}
      <TopSection>
        <QuickRegisterCard>
          <QuickRegisterTitle>콘텐츠 신규 등록</QuickRegisterTitle>
          <QuickRegisterGrid>
            <QuickBtn onClick={() => openRegisterModal('공지사항')}>
              <QuickBtnInner>
                <PlusCircleIcon />
                공지사항
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => openRegisterModal('FAQ')}>
              <QuickBtnInner>
                <HelpSquareIcon />
                FAQ
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => openRegisterModal('이벤트')}>
              <QuickBtnInner>
                <EventIcon />
                이벤트
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => openRegisterModal('쿠폰')}>
              <QuickBtnInner>
                <CouponIcon />
                쿠폰
              </QuickBtnInner>
            </QuickBtn>
          </QuickRegisterGrid>
        </QuickRegisterCard>
      </TopSection>

      {/* ── 게시글 테이블 ── */}
      <TableSection>
        {/* 탭 + 검색 */}
        <TabRow>
          <Tabs>
            {BOARD_TABS.map((tab) => (
              <Tab
                key={tab}
                $active={activeTab === tab}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </Tab>
            ))}
          </Tabs>
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="제목 검색..."
            width="220px"
          />
        </TabRow>

        {activeTab === '쿠폰' && (
          <CouponFilterRow>
            {COUPON_FILTERS.map((f) => (
              <CouponFilterBtn
                key={f}
                $active={couponFilter === f}
                onClick={() => setCouponFilter(f)}
              >
                {f}
              </CouponFilterBtn>
            ))}
          </CouponFilterRow>
        )}

        <Table>
          <THead>
            <TR>
              <TH $width="280px">제목</TH>
              {activeTab === '쿠폰' ? (
                <>
                  <TH $width="120px">남은 수량</TH>
                  <TH $width="120px">유효기간</TH>
                </>
              ) : activeTab === '리뷰' ? (
                <>
                  <TH $width="160px">작성자</TH>
                  <TH $width="150px">등록일</TH>
                </>
              ) : (
                <>
                  <TH $width="150px">등록일</TH>
                </>
              )}
            </TR>
          </THead>
          <TBody>
            {posts.length === 0 ? (
              <TR>
                <TD colSpan={4}>
                  <EmptyState>검색 결과가 없습니다.</EmptyState>
                </TD>
              </TR>
            ) : (
              posts.map((post) => {
                return (
                  <TR
                    key={post.id}
                    $hoverable
                    $clickable
                    onClick={() => handleShowDetail(post)}
                  >
                    <TD>
                      <TitleCell>
                        <TitleText style={{ textDecoration: post.delYn === 'Y' ? 'line-through' : 'none', color: post.delYn === 'Y' ? '#cbd5e1' : 'inherit' }}>
                          {activeTab === '쿠폰' ? post.couponName : post.title}
                        </TitleText>
                        {(post.pinYn === 'Y' || post.isFixed) && <FixedBadge>고정</FixedBadge>}
                        {post.delYn === 'Y' && (
                          <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600, background: '#fee2e2', padding: '1px 6px', borderRadius: '3px', marginLeft: '4px', display: 'inline-block' }}>
                            삭제됨
                          </span>
                        )}
                        {post.hasAttachment && <AttachIcon />}
                      </TitleCell>
                    </TD>
                    {activeTab === '쿠폰' ? (
                      <>
                        <TD>
                          <QtyText>{post.remainQty ?? '-'} 매</QtyText>
                        </TD>
                        <TD>
                          <ValidDaysText>
                            {post.validDays != null
                              ? `${post.validDays}일`
                              : '-'}
                          </ValidDaysText>
                        </TD>
                      </>
                    ) : activeTab === '리뷰' ? (
                      <>
                        <TD>
                          <AuthorText>{post.author}</AuthorText>
                        </TD>
                        <TD>
                          <DateText>
                            {post.createdAt 
                              ? post.createdAt.split('T')[0] 
                              : post.date || '—'}
                          </DateText>
                        </TD>
                      </>
                    ) : (
                      <>
                        <TD>
                          <DateText>
                            {post.createdAt 
                              ? post.createdAt.split('T')[0] 
                              : post.date || '—'}
                          </DateText>
                        </TD>
                      </>
                    )}
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>

        {/* footer: 페이지네이션 */}
        <TableFooter>
          <FooterInfo>총 {TOTAL}개</FooterInfo>
          <AdminPagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={goToPage}
          />
          <div style={{ width: '120px' }} />
        </TableFooter>
      </TableSection>

      {/* ── 상세보기 모달 ── */}
      {detailPost && (
        <ModalOverlay onClick={() => setDetailPost(null)}>
          <ModalContent $width="520px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader $align="center" $gap="12px">
              <ModalTitleGroup style={{ flex: 1 }}>
                <ModalTabBadge>{activeTab}</ModalTabBadge>
                <ModalTitleRow style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <ModalTitle>
                    {activeTab === '쿠폰'
                      ? detailPost.couponName
                      : detailPost.title}
                  </ModalTitle>
                  {activeTab === '쿠폰' && detailPost.couponCode && (
                    <CouponCodeBadge>{detailPost.couponCode}</CouponCodeBadge>
                  )}
                  {activeTab !== '쿠폰' && (
                    <StatusChip
                      $bg={detailPost.delYn === 'Y' ? '#fee2e2' : '#dcfce7'}
                      $color={detailPost.delYn === 'Y' ? '#dc2626' : '#16a34a'}
                      style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}
                    >
                      {detailPost.delYn === 'Y' ? '삭제됨' : '정상'}
                    </StatusChip>
                  )}
                </ModalTitleRow>
              </ModalTitleGroup>

              {/* 제목 오른쪽에 등록일, 수정일 두 줄로 표기 */}
              {activeTab !== '쿠폰' && (
                <DetailHeaderDates>
                  <DateRow>등록일: {detailPost.createdAt ? new Date(detailPost.createdAt).toLocaleString() : detailPost.date || '—'}</DateRow>
                  <DateRow>수정일: {detailPost.updatedAt ? new Date(detailPost.updatedAt).toLocaleString() : '—'}</DateRow>
                </DetailHeaderDates>
              )}

              <ModalCloseBtn onClick={() => setDetailPost(null)} style={{ alignSelf: 'center' }}>
                <X size={18} />
              </ModalCloseBtn>
            </ModalHeader>

            <ModalBody>
              {activeTab === '쿠폰' ? (
                <DetailMetaGrid>
                  <DetailMetaItem>
                    <DetailMetaLabel>쿠폰이름</DetailMetaLabel>
                    <DetailMetaValue>{detailPost.couponName}</DetailMetaValue>
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <DetailMetaLabel>할인율</DetailMetaLabel>
                    <DetailMetaValue>
                      {detailPost.discountRate != null
                        ? `${detailPost.discountRate}%`
                        : '-'}
                    </DetailMetaValue>
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <DetailMetaLabel>생성일자</DetailMetaLabel>
                    <DetailMetaValue $mono>
                      {detailPost.createdAt ?? detailPost.date ?? '-'}
                    </DetailMetaValue>
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <DetailMetaLabel>수정일자</DetailMetaLabel>
                    <DetailMetaValue $mono>
                      {detailPost.updatedAt ?? '-'}
                    </DetailMetaValue>
                  </DetailMetaItem>
                </DetailMetaGrid>
              ) : (
                <>
                  {/* 아래는 다 내용으로 채워짐 */}
                  <DetailContentArea style={{ paddingTop: '0px' }}>
                    {detailPost.content || '등록된 내용이 없습니다.'}
                  </DetailContentArea>

                  {detailPost.files && detailPost.files.length > 0 && (
                    <DetailFilesArea>
                      <DetailFilesLabel>첨부파일 ({detailPost.files.length})</DetailFilesLabel>
                      {detailPost.files.map((file) => (
                        <DetailFileLink
                          key={file.id}
                          href={file.fileUrl || `http://localhost/api/public/files/${file.s3Key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Paperclip size={12} /> {file.originalFileName}
                        </DetailFileLink>
                      ))}
                    </DetailFilesArea>
                  )}
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <DeleteBtn onClick={() => setDeleteTarget(detailPost)}>
                <Trash2 size={14} />
                삭제
              </DeleteBtn>
              <RightBtns>
                <CancelBtn onClick={() => setDetailPost(null)}>닫기</CancelBtn>
                <SubmitBtn onClick={() => openEditModal(detailPost)}>
                  <Pencil size={13} />
                  수정
                </SubmitBtn>
              </RightBtns>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 신규 등록 / 수정 모달 ── */}
      {registerModal && (
        <ModalOverlay onClick={closeRegisterModal}>
          <ModalContent $width="520px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingPost
                  ? `${registerModal} 수정`
                  : `${registerModal} 등록`}
              </ModalTitle>
              <ModalCloseBtn onClick={closeRegisterModal}>
                <X size={18} />
              </ModalCloseBtn>
            </ModalHeader>

            <ModalBody>
              {registerModal === '쿠폰' ? (
                <>
                  <FieldGroup>
                    <FieldLabel>쿠폰 이름</FieldLabel>
                    <FieldInput
                      placeholder="쿠폰 이름을 입력하세요"
                      value={formData.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldRow>
                    <FieldGroup>
                      <FieldLabel>할인율 (%)</FieldLabel>
                      <FieldInput
                        type="number"
                        min={1}
                        max={100}
                        placeholder="예: 10"
                        value={formData.discountRate || ''}
                        onChange={(e) =>
                          handleFormChange('discountRate', e.target.value)
                        }
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>수량</FieldLabel>
                      <FieldInput
                        type="number"
                        min={1}
                        placeholder="예: 100"
                        value={formData.quantity || ''}
                        onChange={(e) =>
                          handleFormChange('quantity', e.target.value)
                        }
                      />
                    </FieldGroup>
                  </FieldRow>
                  <FieldGroup>
                    <FieldLabel>유효 기간 (일)</FieldLabel>
                    <FieldInputWithUnit>
                      <FieldInput
                        type="number"
                        min={1}
                        placeholder="예: 30"
                        value={formData.validDays || ''}
                        onChange={(e) =>
                          handleFormChange('validDays', e.target.value)
                        }
                      />
                      <FieldUnit>일</FieldUnit>
                    </FieldInputWithUnit>
                  </FieldGroup>
                </>
              ) : (
                <>
                  <FieldGroup>
                    <FieldLabel>제목</FieldLabel>
                    <FieldInput
                      placeholder="제목을 입력하세요"
                      value={formData.title || ''}
                      onChange={(e) =>
                        handleFormChange('title', e.target.value)
                      }
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <FieldLabel>내용</FieldLabel>
                    <FieldTextarea
                      placeholder="내용을 입력하세요"
                      value={formData.content || ''}
                      onChange={(e) =>
                        handleFormChange('content', e.target.value)
                      }
                    />
                  </FieldGroup>
                  {activeTab === '공지사항' && (
                    <>
                      <CheckboxGroup>
                        <CheckboxInput
                          type="checkbox"
                          id="isFixed"
                          checked={formData.isFixed || false}
                          onChange={(e) =>
                            handleFormChange('isFixed', e.target.checked)
                          }
                        />
                        <CheckboxLabel htmlFor="isFixed">이 글을 상단에 고정합니다 (필독)</CheckboxLabel>
                      </CheckboxGroup>
                      <FieldGroup>
                        <FieldLabel>첨부파일</FieldLabel>
                        {editingPost && editingPost.files && editingPost.files.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>기존 첨부파일 ({editingPost.files.length}개)</p>
                            {editingPost.files.map((file) => {
                              const isRemoved = removedFileIds.includes(file.id);
                              return (
                                <div key={file.id} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#334155', justifyContent: 'space-between', width: '100%', minHeight: '22px' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px', textDecoration: isRemoved ? 'line-through' : 'none', color: isRemoved ? '#cbd5e1' : '#334155' }}>
                                    <Paperclip size={11} color={isRemoved ? '#cbd5e1' : '#94a3b8'} /> {file.originalFileName}
                                  </span>
                                  {isRemoved ? (
                                    <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600, background: '#fee2e2', padding: '1px 6px', borderRadius: '3px', marginLeft: 'auto' }}>
                                      삭제 대기
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveExistingFile(file.id)}
                                      style={{ fontSize: '10px', color: '#ef4444', background: '#fff5f5', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '4px', marginLeft: 'auto', cursor: 'pointer', fontWeight: 500 }}
                                    >
                                      삭제
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <FileInput
                          type="file"
                          multiple
                          onChange={(e) =>
                            handleFormChange('files', Array.from(e.target.files))
                          }
                        />
                        {editingPost && (
                          <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            * 새 파일을 선택하면 기존 첨부파일에 추가하거나 교체 가능하도록 대기합니다. (백엔드 보강 필요)
                          </span>
                        )}
                      </FieldGroup>
                    </>
                  )}
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <div />
              <RightBtns>
                <CancelBtn onClick={closeRegisterModal}>취소</CancelBtn>
                <SubmitBtn onClick={handleRegisterSubmit}>
                  {editingPost ? '수정 완료' : '등록'}
                </SubmitBtn>
              </RightBtns>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 삭제 확인 모달 ── */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={
          activeTab === '쿠폰'
            ? '쿠폰을 삭제하시겠습니까?'
            : '게시글을 삭제하시겠습니까?'
        }
        description={
          deleteTarget
            ? activeTab === '쿠폰'
              ? `"${deleteTarget.couponName ?? deleteTarget.title}" 쿠폰이 삭제됩니다.`
              : `"${deleteTarget.title}" 게시글이 영구적으로 삭제됩니다.`
            : ''
        }
        isDanger
        confirmText="삭제"
        icon={<Trash2 size={24} color="#ef4444" />}
      />
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function ReviewIcon() {
  return <MessageSquare size={20} />;
}
function CalendarIcon() {
  return <Calendar size={20} />;
}
function PlusCircleIcon() {
  return <PlusCircle size={14} strokeWidth={2.5} />;
}
function HelpSquareIcon() {
  return <HelpCircle size={14} />;
}
function EventIcon() {
  return <Star size={14} />;
}
function CouponIcon() {
  return <Tag size={14} />;
}
function AttachIcon() {
  return <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />;
}
function PinSvg({ $pinned }) {
  return (
    <MapPin
      size={14}
      fill={$pinned ? '#244c54' : 'none'}
      color={$pinned ? '#244c54' : '#94a3b8'}
    />
  );
}

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div``;
const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.24px;
  line-height: 1.33;
`;
const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* 상단 영역 */
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: stretch;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatCardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const StatIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;
const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  letter-spacing: -0.5px;
  line-height: 1.2;
`;
const MonthBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #ea580c;
  background: #fff7ed;
  padding: 3px 8px;
  border-radius: 999px;
`;

/* 콘텐츠 신규 등록 카드 */
const QuickRegisterCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const QuickRegisterTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;
const QuickRegisterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
`;
const QuickBtn = styled.button`
  width: 100%;
`;
const QuickBtnInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s;
  cursor: pointer;

  background: ${({ theme }) => theme.colors.white};
  color: #334155;
  border: 1px solid ${({ theme }) => theme.colors.border};
  &:hover {
    background: ${({ theme }) => theme.colors.adminPrimary};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.adminPrimary};
  }
`;

/* 쿠폰 필터 */
const CouponFilterRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const CouponFilterBtn = styled.button`
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.adminPrimary : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textMuted};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.adminPrimary : theme.colors.border};
  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.adminPrimary : theme.colors.bgSection};
  }
`;

/* 게시글 테이블 */
const TableSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const Tabs = styled.div`
  display: flex;
  gap: 0;
`;
const Tab = styled.button`
  padding: 14px 18px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.adminPrimary : theme.colors.textMuted};
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.adminPrimary : 'transparent'};
  transition: all 0.15s;
  font-family: inherit;
  &:hover {
    color: ${({ theme }) => theme.colors.adminPrimary};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const THead = styled.thead`
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const TBody = styled.tbody``;
const TR = styled.tr`
  border-top: ${({ $hoverable, theme }) =>
    $hoverable ? `1px solid ${theme.colors.borderLight}` : 'none'};
  transition: background 0.1s;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;
const TH = styled.th`
  padding: 11px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.3px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;
const TD = styled.td`
  padding: 14px 20px;
  vertical-align: middle;
`;

const EmptyState = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const FixedBadge = styled.span`
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  color: #c2410c;
  background: #fff7ed;
  padding: 2px 7px;
  border-radius: 4px;
`;
const TitleText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-weight: 500;
  line-height: 1.4;
`;
const AuthorText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
`;
const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const QtyText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const ValidDaysText = styled.span`
  font-size: 13px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.number};
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

/* 핀 버튼 */
const PinBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  background: ${({ $pinned }) =>
    $pinned ? 'rgba(36,76,84,0.08)' : 'transparent'};
  &:hover {
    background: ${({ $pinned, theme }) =>
      $pinned ? 'rgba(36,76,84,0.14)' : theme.colors.borderLight};
  }
`;

/* 페이지네이션 푸터 */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const FooterInfo = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* ── 모달: ModalOverlay / ModalContent / ModalHeader / ModalCloseBtn 은
   components/common/AdminModal.styles.js 에서 공통 import ── */

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const ModalTabBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #244c54;
  background: rgba(36, 76, 84, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
`;

const ModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const CouponCodeBadge = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #0369a1;
  background: #e0f2fe;
  padding: 3px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  font-family: ${({ theme }) => theme.fonts.number};
`;

const ModalTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #0d1c2e;
  line-height: 1.4;
  word-break: break-word;
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* 상세보기 전용 */
const DetailMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const DetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* 쿠폰 상세용 그리드 */
const DetailMetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
`;

const DetailMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DetailMetaLabel = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const DetailMetaValue = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  font-family: ${({ $mono, theme }) =>
    $mono ? theme.fonts.number : 'inherit'};
`;

const StatusChip = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const DetailDivider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

const DetailContentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 80px;
  color: #cbd5e1;
`;

const DetailContentNote = styled.p`
  font-size: 12px;
  color: #cbd5e1;
`;

const DetailContentArea = styled.div`
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  white-space: pre-wrap;
  padding: 16px 0;
`;

const DetailHeaderDates = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  margin-right: 8px;
  align-self: center;
`;

const DateRow = styled.div`
  line-height: 1.4;
`;

const DetailFilesArea = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const DetailFilesLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
`;

const DetailFileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  user-select: none;
`;

const FileInput = styled.input`
  display: block;
  width: 100%;
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  
  &::file-selector-button {
    font-weight: 500;
    padding: 6px 12px;
    margin-right: 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    cursor: pointer;
    &:hover {
      background: #f8fafc;
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const RightBtns = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid #fecaca;
  background: #fff5f5;
  color: #ef4444;
  transition: background 0.15s;
  &:hover {
    background: #fee2e2;
  }
`;

const CancelBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  transition: background 0.15s;
  &:hover {
    background: #f1f5f9;
  }
`;

const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  background: #244c54;
  color: white;
  border: 1px solid #244c54;
  transition: background 0.15s;
  &:hover {
    background: #1d3d44;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 12px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #334155;
`;

const FieldInputWithUnit = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  & > input {
    width: 100%;
    padding-right: 36px;
  }
`;

const FieldUnit = styled.span`
  position: absolute;
  right: 12px;
  font-size: 13px;
  color: #64748b;
  pointer-events: none;
`;

const FieldInput = styled.input`
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #0d1c2e;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36, 76, 84, 0.08);
  }
`;

const FieldTextarea = styled.textarea`
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #0d1c2e;
  resize: vertical;
  min-height: 120px;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36, 76, 84, 0.08);
  }
`;
