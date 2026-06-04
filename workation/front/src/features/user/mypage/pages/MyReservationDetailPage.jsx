import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MapPin,
  CalendarDays,
  Users,
  ArrowLeft,
  ShieldAlert,
  CheckCircle,
  CreditCard,
  FileDown, // 신청서 다운로드 아이콘 추가
} from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';
// 팀원 API 모듈 임포트
import {
  completeReservation,
  getReservationOne,
  updateReservation,
} from '../../reservation/api/reservationApi';

function MyReservationDetailPage() {
  const { id } = useParams(); // URL의 :id 값 추출
  const navigate = useNavigate();

  // 🟩 상태 관리 (State)
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 토글 플래그
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (isLoading) return; // 이미 요청 중이면 중복 클릭 방지 (디바운싱)

    setIsLoading(true); // 로딩 시작
    try {
      await completeReservation(id);
      alert('이용 완료 처리가 되었습니다!');
      // TODO: 목록을 새로고침하거나 상태를 '이용완료'로 변경하는 로직 추가
    } catch (error) {
      console.error(error);
      alert('처리에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false); // 성공하든 실패하든 로딩 해제
    }
  };
  // 수정 폼 입력값 상태
  const [formData, setFormData] = useState({
    primaryGuestName: '',
    primaryGuestPhone: '',
    primaryGuestEmail: '',
  });

  // 🟩 1. 데이터 로드 (단건 상세 조회)
  useEffect(() => {
    getReservationOne(id)
      .then((response) => {
        // 백엔드 응답 구조: response.data 혹은 response 자체가 DTO인 경우 확인 필요
        const data = response.data || response;
        setReservation(data);

        // 수정 폼 기본값 초기화
        setFormData({
          primaryGuestName: data.primaryGuestName || '',
          primaryGuestPhone: data.primaryGuestPhone || '',
          primaryGuestEmail: data.primaryGuestEmail || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('예약 상세 조회 실패:', error);
        alert('예약 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      });
  }, [id]);

  // 🟩 2. 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🟩 3. 수정 취소
  const handleCancel = () => {
    if (reservation) {
      setFormData({
        primaryGuestName: reservation.primaryGuestName || '',
        primaryGuestPhone: reservation.primaryGuestPhone || '',
        primaryGuestEmail: reservation.primaryGuestEmail || '',
      });
    }
    setIsEdit(false);
  };

  // 🟩 4. 수정 완료 요청 (저장)
  const handleSave = () => {
    if (!formData.primaryGuestName.trim())
      return alert('예약자 이름을 입력해주세요.');
    if (!formData.primaryGuestPhone.trim())
      return alert('연락처를 입력해주세요.');
    if (!formData.primaryGuestEmail.trim())
      return alert('이메일을 입력해주세요.');

    // 기존 데이터에 수정 폼 값을 덮어씌워 전송 데이터 조립
    const updateData = {
      ...reservation,
      ...formData,
    };

    updateReservation(id, updateData)
      .then(() => {
        alert('예약 정보가 성공적으로 수정되었습니다.');
        setReservation(updateData);
        setIsEdit(false);
      })
      .catch((error) => {
        console.error('예약 수정 실패:', error);
        alert('예약 정보 수정에 실패했습니다.');
      });
  };

  if (loading) {
    return (
      <LayoutContainer>
        <MyPageSidebar />
        <MainContent style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LoadingText>예약 상세 정보를 불러오는 중입니다...</LoadingText>
        </MainContent>
      </LayoutContainer>
    );
  }

  if (!reservation) {
    return (
      <LayoutContainer>
        <MyPageSidebar />
        <MainContent style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LoadingText>
            존재하지 않거나 불러올 수 없는 예약 정보입니다.
          </LoadingText>
        </MainContent>
      </LayoutContainer>
    );
  }

  // 데이터 접근 편의를 위한 비구조화 할당 (안전한 옵셔널 체이닝 기본 적용)
  const stay = reservation.stay || {};
  const space = reservation.space || {};
  const payment = reservation.payment || {};

  return (
    <LayoutContainer>
      <MyPageSidebar />

      <MainContent>
        {/* 상단 네비게이션 헤더 */}
        <PageHeader>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>목록으로</span>
          </BackButton>
          <PageTitle>예약 상세 내역</PageTitle>
        </PageHeader>

        <ContentGrid>
          {/* 왼쪽 컬럼: 상품 및 예약자 정보 */}
          <LeftColumn>
            {/* 1. 숙소/공간 카드 */}
            <ProductCard>
              <ProductImage
                src={
                  // 💡 stay.pictures[0]이 존재하면 그 경로를, 없으면 기존대로 space.imageUrl 등을 사용
                  stay.pictures && stay.pictures.length > 0
                    ? stay.pictures[0].filePath
                    : space.imageUrl ||
                      'https://via.placeholder.com/800x450?text=No+Image'
                }
                alt={stay.name || space.name || '상품 이미지'}
              />
              <ProductInfoArea>
                <ProductBadge>
                  {reservation.statusLabel || '예약 완료'}
                </ProductBadge>
                <ProductName>
                  {stay.name || space.name || '지정되지 않은 상품'}
                </ProductName>
                <ProductLocation>
                  <MapPin size={16} />
                  <span>
                    {space.address1 || '주소 정보 없음'}
                    {space?.address2 && `${space.address2}`}
                  </span>
                </ProductLocation>
              </ProductInfoArea>
            </ProductCard>

            {/* 💡 특이사항 요구사항: 정부지원 워케이션 신청서 다운로드 영역 */}
            {reservation.files && reservation.files.length > 0 && (
              <DocumentCard>
                <SectionTitle style={{ marginBottom: '12px' }}>
                  💼 워케이션 제출 서류
                </SectionTitle>
                <DocumentDescription>
                  본 워케이션 예약 시 함께 등록된 정부지원 워케이션 참가 신청서
                  파일입니다.
                </DocumentDescription>
                <FileList>
                  {reservation.files.map((file) => (
                    <FileItem
                      key={file.id}
                      href={file.fileUrl}
                      download={file.originalFileName}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileDown size={18} />
                      <FileName>{file.originalFileName}</FileName>
                    </FileItem>
                  ))}
                </FileList>
              </DocumentCard>
            )}

            {/* 2. 일정 및 인원 상세 */}
            <DetailCard>
              <SectionTitle>이용 정보</SectionTitle>
              <InfoGrid>
                <InfoRow>
                  <IconWrapper>
                    <CalendarDays size={18} />
                  </IconWrapper>
                  <InfoTextArea>
                    <InfoLabel>체크인 / 체크아웃</InfoLabel>
                    <InfoValue>
                      {reservation.checkinDate} ~ {reservation.checkoutDate}
                    </InfoValue>
                  </InfoTextArea>
                </InfoRow>
                <InfoRow>
                  <IconWrapper>
                    <Users size={18} />
                  </IconWrapper>
                  <InfoTextArea>
                    <InfoLabel>이용 인원</InfoLabel>
                    <InfoValue>총 {reservation.guestCount}명</InfoValue>
                  </InfoTextArea>
                </InfoRow>
              </InfoGrid>
            </DetailCard>

            {/* 3. 예약자 정보 (수정 가능 영역) */}
            <DetailCard>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <SectionTitle style={{ margin: 0 }}>예약자 정보</SectionTitle>
                {!isEdit && (
                  <EditToggleButton onClick={() => setIsEdit(true)}>
                    정보 변경
                  </EditToggleButton>
                )}
              </div>

              {isEdit ? (
                <EditFormContainer>
                  <InputGroup>
                    <label>예약자 성함</label>
                    <input
                      type="text"
                      name="primaryGuestName"
                      value={formData.primaryGuestName}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <label>연락처</label>
                    <input
                      type="text"
                      name="primaryGuestPhone"
                      value={formData.primaryGuestPhone}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                  <InputGroup>
                    <label>이메일</label>
                    <input
                      type="email"
                      name="primaryGuestEmail"
                      value={formData.primaryGuestEmail}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                  <FormActionButtons>
                    <CancelButton onClick={handleCancel}>취소</CancelButton>
                    <SaveButton onClick={handleSave}>변경 내용 저장</SaveButton>
                  </FormActionButtons>
                </EditFormContainer>
              ) : (
                <InfoGrid>
                  <InfoRow>
                    <InfoTextArea>
                      <InfoLabel>예약자명</InfoLabel>
                      <InfoValue>{reservation.primaryGuestName}</InfoValue>
                    </InfoTextArea>
                  </InfoRow>
                  <InfoRow>
                    <InfoTextArea>
                      <InfoLabel>연락처</InfoLabel>
                      <InfoValue>{reservation.primaryGuestPhone}</InfoValue>
                    </InfoTextArea>
                  </InfoRow>
                  <InfoRow>
                    <InfoTextArea>
                      <InfoLabel>이메일</InfoLabel>
                      <InfoValue>{reservation.primaryGuestEmail}</InfoValue>
                    </InfoTextArea>
                  </InfoRow>
                </InfoGrid>
              )}
            </DetailCard>

            {/* 취소 규정 고지 */}
            <NoticeBox>
              <ShieldAlert size={18} />
              <p>
                정부지원 워케이션 사업 지침에 따라 이용일 7일 전 취소 시 신청
                자격 제한 및 위약금이 발생할 수 있습니다.
              </p>
            </NoticeBox>
          </LeftColumn>

          {/* 오른쪽 컬럼: 영수증 및 결제 내역 */}
          <RightColumn>
            <ReceiptCard>
              <ReceiptTitle>결제 금액 상세</ReceiptTitle>

              <ReceiptRow>
                <span>기본 이용 금액</span>
                <span>{reservation.originalPrice?.toLocaleString()}원</span>
              </ReceiptRow>

              <ReceiptRow className="discount">
                <span>정부 지원 / 회원 할인 적용</span>
                <span>-{reservation.discountAmount?.toLocaleString()}원</span>
              </ReceiptRow>

              <DividerLine />

              <TotalRow>
                <span>최종 결제 금액</span>
                <TotalPrice>
                  {reservation.totalPrice?.toLocaleString()}원
                </TotalPrice>
              </TotalRow>

              {/* 연동된 실시간 결제 승인 정보 */}
              {payment.orderId && (
                <PaymentDetailBox>
                  <div className="detail-title">
                    <CreditCard size={14} />
                    <span>
                      실시간 승인 내역 ({payment.paymentStatus || '승인'})
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>결제 수단</span>
                    <span>
                      {payment.paymentMethod === 'CARD'
                        ? `신용카드 (${payment.cardCompany || '현대'})`
                        : payment.paymentMethod || '일반결제'}
                    </span>
                  </div>
                  {payment.cardNumber && (
                    <div className="detail-row">
                      <span>카드 번호</span>
                      <span>{payment.cardNumber}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span>주문 번호</span>
                    <span className="order-id">{payment.orderId}</span>
                  </div>
                </PaymentDetailBox>
              )}

              <ButtonGroup>
                {/* 1. 이용 완료 버튼: 상태가 'RESERVED'(예약 확정)일 때만 화면에 노출 🚀 */}
                {reservation.status === 'RESERVED' && (
                  <SubmitButton onClick={handleComplete} disabled={isLoading}>
                    <CheckCircle size={18} />
                    <span>{isLoading ? '처리 중...' : '이용 완료'}</span>
                  </SubmitButton>
                )}

                {/* 2. 환불 신청 버튼: 결제 완료(PAYMENT_COMPLETED) 또는 예약 확정(RESERVED) 상태일 때만 노출 🛡️ */}
                {(reservation.status === 'PAYMENT_COMPLETED' ||
                  reservation.status === 'RESERVED') && (
                  <RefundButton
                    onClick={() => navigate(`/resv/refund/apply/${id}`)}
                  >
                    <ShieldAlert size={18} />
                    <span>환불 신청하기</span>
                  </RefundButton>
                )}
              </ButtonGroup>
            </ReceiptCard>
          </RightColumn>
        </ContentGrid>
      </MainContent>
    </LayoutContainer>
  );
}

export default MyReservationDetailPage;

// =========================================================================
// 🟩 STYLED COMPONENTS (스타일 구조 정의)
// =========================================================================

/* ─── 기존 SubmitButton 아래에 이 스타일들을 추가/보완 하세요 ─── */

// 두 버튼 사이의 간격을 리드미컬하게 벌려주는 가이드 박스
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
`;

// 1. 이용 완료 버튼 (기존 SubmitButton 스타일 보완)
const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #3f6971;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  transition: all 0.2s ease;

  &:hover {
    background: #2c4a50;
  }
`;

// 2. 환불 신청 버튼 (✨ 완전히 새로 추가되는 뼈대 스타일)
const RefundButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: transparent; /* 배경을 투명하게 해서 이용완료 버튼을 강조 */
  color: #94a3b8; /* 기본 평상시 색상은 차분한 회색조 */
  border: 1px solid #e2e8f0;
  padding: 12px; /* 메인 버튼보다 살짝 슬림하게 잡아서 시각적 균형 최적화 */
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 마우스를 올렸을 때만 파괴적인 액션(환불)임을 은은하게 인지시키는 핑크/레드 스킨 무드 */
  &:hover {
    color: #e11d48;
    background-color: #fff1f2;
    border-color: #fecdd3;
  }
`;
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px 50px;
  overflow-y: auto;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;
  padding: 0;
  &:hover {
    color: #334155;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
  align-items: start;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  position: sticky;
  top: 40px;
`;

const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
`;

const ProductInfoArea = styled.div`
  padding: 24px;
`;

const ProductBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background-color: #f0fdf4;
  color: #16a34a;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const ProductName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px 0;
`;

const ProductLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
`;

const DocumentCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #cbd5e1;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;

const DocumentDescription = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #3f6971;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f5f6;
    border-color: #3f6971;
  }
`;

const FileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DetailCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const IconWrapper = styled.div`
  color: #64748b;
  padding-top: 2px;
`;

const InfoTextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 15px;
  color: #334155;
  font-weight: 600;
`;

const EditToggleButton = styled.button`
  background: none;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`;

const EditFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 13px;
    color: #475569;
    font-weight: 600;
  }
  input {
    padding: 10px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    color: #334155;
    outline: none;
    &:focus {
      border-color: #3f6971;
    }
  }
`;

const FormActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #e2e8f0;
  }
`;

const SaveButton = styled.button`
  background: #3f6971;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #2c4a50;
  }
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  background-color: #fff1f2;
  border-radius: 12px;
  color: #e11d48;
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    font-weight: 500;
  }
`;

const ReceiptCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const ReceiptTitle = styled.h3`
  font-size: 16px;
  color: #374151;
  font-weight: 600;
  margin-bottom: 22px;
`;

const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 14px;
  &.discount {
    color: #e11d48;
  }
`;

const DividerLine = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 20px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
  span {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }
`;

const TotalPrice = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #3f6971;
`;

const PaymentDetailBox = styled.div`
  background-color: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 24px;
  font-size: 12px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .detail-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 4px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
  }

  .order-id {
    font-family: monospace;
    color: #94a3b8;
  }
`;
