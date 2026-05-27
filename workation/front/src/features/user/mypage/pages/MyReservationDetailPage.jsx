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
} from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';
// 팀원 API 모듈 임포트
import {
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

  // 수정 폼 입력값 상태
  const [formData, setFormData] = useState({
    primaryGuestName: '',
    primaryGuestPhone: '',
    primaryGuestEmail: '',
    refundBankName: '',
    refundAccountNumber: '',
    refundAccountHolder: '',
  });

  // 🟩 1. 데이터 로드 (단건 상세 조회)
  useEffect(() => {
    getReservationOne(id)
      .then((response) => {
        const data = response.data ? response.data : response;
        setReservation(data);

        // 수정 폼의 초기값 세팅 (엔티티 필드 스펙 기준)
        setFormData({
          primaryGuestName: data.primaryGuestName || '',
          primaryGuestPhone: data.primaryGuestPhone || '',
          primaryGuestEmail: data.primaryGuestEmail || '',
          refundBankName: data.refundBankName || '',
          refundAccountNumber: data.refundAccountNumber || '',
          refundAccountHolder: data.refundAccountHolder || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('예약 상세 정보 로드 실패:', error);
        alert('존재하지 않거나 접근 권한이 없는 예약입니다.');
        navigate('/mypage/reservation');
        setLoading(false);
      });
  }, [id, navigate]);

  // 🟩 2. 핸들러 함수들
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 정보 수정 요청 (PUT)
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    // 엔티티 updateReqDto 제약조건 검증 (전화번호 11자리 등 간단 가드)
    if (formData.primaryGuestPhone.length > 11) {
      alert('전화번호는 하이픈(-) 없이 최대 11자리로 입력해 주세요.');
      return;
    }

    // 파일 첨부가 포함될 수 있는 구조이므로 가볍게 FormData 객체로 래핑하여 전송
    const sendData = new FormData();
    sendData.append('primaryGuestName', formData.primaryGuestName);
    sendData.append('primaryGuestPhone', formData.primaryGuestPhone);
    sendData.append('primaryGuestEmail', formData.primaryGuestEmail);
    sendData.append('refundBankName', formData.refundBankName);
    sendData.append('refundAccountNumber', formData.refundAccountNumber);
    sendData.append('refundAccountHolder', formData.refundAccountHolder);

    updateReservation(id, sendData)
      .then(() => {
        alert('예약 정보가 성공적으로 수정되었습니다.');
        // 최신 수정을 반영하기 위해 화면 강제 갱신 및 조회 모드 전환
        setReservation((prev) => ({ ...prev, ...formData }));
        setIsEdit(false);
      })
      .catch((error) => {
        console.error('예약 정보 수정 중 오류 발생:', error);
        alert(
          '정보 수정에 실패했습니다. (결제 완료 상태에서만 수정이 가능합니다.)'
        );
      });
  };

  // 🟩 3. 포맷터 공통 로직
  const formatPrice = (price) => (price ? `₩${price.toLocaleString()}` : '₩0');

  if (loading) {
    return (
      <Container>
        <MyPageSidebar />
        <Main
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>예약 상세 정보를 분석 중입니다... 🔍</h3>
        </Main>
      </Container>
    );
  }

  // 엔티티의 수정 가능 상태 분기 가드 조율
  // (PAYMENT_COMPLETED 상태일 때만 수정을 허용하는 엔티티 로직 반영)
  const isEditableStatus = reservation.status === 'PAYMENT_COMPLETED';

  return (
    <Container>
      <MyPageSidebar />
      <Main>
        {/* 상단 네비게이션 바 */}
        <BackButton onClick={() => navigate('/mypage/reservation')}>
          <ArrowLeft size={16} /> 예약 목록으로 돌아가기
        </BackButton>

        <HeaderRow>
          <div>
            <PageTitle>예약 상세 내역</PageTitle>
            <OrderNo>
              주문번호: {reservation.orderId || `RES-${reservation.id}`}
            </OrderNo>
          </div>
          <StatusBadge>
            {reservation.statusLabel || '상태 정보 없음'}
          </StatusBadge>
        </HeaderRow>

        <GridContainer onSubmit={handleUpdateSubmit}>
          {/* 왼쪽 컬럼: 핵심 컨텐츠 */}
          <LeftColumn>
            {/* 섹션 1: 숙소 정보 */}
            <SectionCard>
              <SectionTitle>숙소 정보</SectionTitle>
              <StayHeader>
                <StayTitle>
                  {reservation.stayName || '예약된 워케이션 공간'}
                </StayTitle>
                <InfoRow>
                  <InfoItem>
                    <CalendarDays size={14} /> {reservation.checkinDate} ~{' '}
                    {reservation.checkoutDate}
                  </InfoItem>
                  <Divider />
                  <InfoItem>
                    <Users size={14} /> 성인 {reservation.guestCount}명
                  </InfoItem>
                </InfoRow>
              </StayHeader>
              <NoticeBox>
                <CheckCircle size={16} color="#3f6971" />
                <span>
                  체크인 <b>15:00</b> / 체크아웃 <b>11:00</b> (현지 숙소 규정을
                  준수해 주세요.)
                </span>
              </NoticeBox>
            </SectionCard>

            {/* 섹션 2: 예약자 정보 (조회 / 수정 모드 분기 스위칭 영역) */}
            <SectionCard>
              <SectionHeader>
                <SectionTitle>예약자 정보</SectionTitle>
                {isEditableStatus && !isEdit && (
                  <InlineEditButton
                    type="button"
                    onClick={() => setIsEdit(true)}
                  >
                    정보 변경하기
                  </InlineEditButton>
                )}
              </SectionHeader>

              <FormGrid>
                <FormGroup>
                  <label>대표 투숙객 이름</label>
                  {isEdit ? (
                    <Input
                      name="primaryGuestName"
                      value={formData.primaryGuestName}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <TextValue>{reservation.primaryGuestName}</TextValue>
                  )}
                </FormGroup>

                <FormGroup>
                  <label>연락처</label>
                  {isEdit ? (
                    <Input
                      name="primaryGuestPhone"
                      value={formData.primaryGuestPhone}
                      onChange={handleInputChange}
                      placeholder="하이픈 없이 입력"
                      required
                    />
                  ) : (
                    <TextValue>{reservation.primaryGuestPhone}</TextValue>
                  )}
                </FormGroup>

                <FormGroup className="full-width">
                  <label>이메일 주소</label>
                  {isEdit ? (
                    <Input
                      type="email"
                      name="primaryGuestEmail"
                      value={formData.primaryGuestEmail}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <TextValue>{reservation.primaryGuestEmail}</TextValue>
                  )}
                </FormGroup>
              </FormGrid>
            </SectionCard>

            {/* 섹션 3: 환불 계좌 정보 */}
            <SectionCard>
              <SectionTitle>환불 계좌 설정</SectionTitle>
              <p
                style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginBottom: '14px',
                }}
              >
                * 판매자 거절이나 예약 취소 시 환불 처리가 진행될 계좌
                정보입니다.
              </p>
              <FormGrid>
                <FormGroup>
                  <label>은행명</label>
                  {isEdit ? (
                    <Input
                      name="refundBankName"
                      value={formData.refundBankName}
                      onChange={handleInputChange}
                      placeholder="예: 국민은행"
                    />
                  ) : (
                    <TextValue>
                      {reservation.refundBankName || '(등록된 은행 없음)'}
                    </TextValue>
                  )}
                </FormGroup>

                <FormGroup>
                  <label>예금주</label>
                  {isEdit ? (
                    <Input
                      name="refundAccountHolder"
                      value={formData.refundAccountHolder}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <TextValue>
                      {reservation.refundAccountHolder ||
                        '(등록된 예금주 없음)'}
                    </TextValue>
                  )}
                </FormGroup>

                <FormGroup className="full-width">
                  <label>계좌번호</label>
                  {isEdit ? (
                    <Input
                      name="refundAccountNumber"
                      value={formData.refundAccountNumber}
                      onChange={handleInputChange}
                      placeholder="하이픈 없이 입력"
                    />
                  ) : (
                    <TextValue>
                      {reservation.refundAccountNumber ||
                        '(등록된 계좌번호 없음)'}
                    </TextValue>
                  )}
                </FormGroup>
              </FormGrid>
            </SectionCard>
          </LeftColumn>

          {/* 오른쪽 컬럼: 결제 요약 영수증 및 제어 액션 패널 */}
          <RightColumn>
            <ReceiptCard>
              <ReceiptTitle>
                <CreditCard size={18} /> 결제 영수증
              </ReceiptTitle>

              <ReceiptRow>
                <span>객실 원가 금액</span>
                <span>
                  {formatPrice(
                    reservation.totalPrice + (reservation.discountAmount || 0)
                  )}
                </span>
              </ReceiptRow>

              <ReceiptRow className="discount">
                <span>쿠폰/프로모션 할인</span>
                <span>-{formatPrice(reservation.discountAmount)}</span>
              </ReceiptRow>

              <DividerLine />

              <TotalRow>
                <span>최종 결제 금액</span>
                <TotalPrice>{formatPrice(reservation.totalPrice)}</TotalPrice>
              </TotalRow>

              {/* 하단 동적 제어 버튼 컨트롤 구역 */}
              <ActionArea>
                {isEdit ? (
                  <>
                    <SubmitButton type="submit">변경 내용 저장</SubmitButton>
                    <CancelButton
                      type="button"
                      onClick={() => setIsEdit(false)}
                    >
                      수정 취소
                    </CancelButton>
                  </>
                ) : (
                  <>
                    {!isEditableStatus && (
                      <WarningNotice>
                        <ShieldAlert size={14} />
                        <span>
                          이용 완료 또는 취소된 내역은 정보 수정이 제한됩니다.
                        </span>
                      </WarningNotice>
                    )}
                  </>
                )}
              </ActionArea>
            </ReceiptCard>
          </RightColumn>
        </GridContainer>
      </Main>
    </Container>
  );
}

export default MyReservationDetailPage;

/* ================= Styled Components ================= */

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const Main = styled.main`
  flex: 1;
  padding: 42px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 0;
  &:hover {
    color: #3f6971;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  color: #374151;
  font-weight: 700;
  margin-bottom: 6px;
`;

const OrderNo = styled.span`
  font-size: 13px;
  color: #94a3b8;
`;

const StatusBadge = styled.div`
  background-color: #eef5f6;
  color: #3f6971;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(63, 105, 113, 0.05);
`;

const GridContainer = styled.form`
  display: flex;
  gap: 28px;
  align-items: flex-start;
`;

const LeftColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  flex: 1;
  position: sticky;
  top: 20px;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #374151;
  font-weight: 600;
  margin-bottom: 20px;
  ${SectionHeader} & {
    margin-bottom: 0;
  }
`;

const InlineEditButton = styled.button`
  background-color: white;
  border: 1px solid #3f6971;
  color: #3f6971;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #3f6971;
    color: white;
  }
`;

const StayHeader = styled.div`
  margin-bottom: 20px;
`;

const StayTitle = styled.h4`
  font-size: 22px;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #4b5563;
  font-size: 14px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #d1d5db;
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f0f7f8;
  padding: 14px 18px;
  border-radius: 12px;
  color: #3f6971;
  font-size: 13px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  .full-width {
    grid-column: span 2;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
  }
`;

const TextValue = styled.div`
  font-size: 15px;
  color: #1f2937;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #334155;
  outline: none;
  &:focus {
    border-color: #3f6971;
    box-shadow: 0 0 0 1px #3f6971;
  }
`;

const ReceiptCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #edf2f7;
`;

const ReceiptTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
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

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SubmitButton = styled.button`
  background-color: #3f6971;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #2d4f55;
  }
`;

const CancelButton = styled.button`
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #e2e8f0;
  }
`;

const WarningNotice = styled.div`
  display: flex;
  gap: 8px;
  background-color: #fff7ed;
  color: #c2410c;
  padding: 12px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.4;
`;
