import styled from 'styled-components';
import { ShieldCheck, UserCog } from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';
import MemberEditForm from '../components/MemberEditForm';
import { useState } from 'react';
import PasswordEditForm from '../components/PasswordEditForm';
import { deleteAccount } from '../api/mypageApi';

function MySettingPage() {
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);

  async function accountDelete() {
    try {
      const result = confirm(
        '정말 탈퇴하시겠습니까? 데이터는 복구되지 않습니다.'
      );
      if (!result) return;

      await deleteAccount();
      alert('회원탈퇴가 성공적으로 처리되었습니다.');
      localStorage.removeItem('accessToken');
      location.href = '/';
    } catch (error) {
      console.error(error);
      alert('회원탈퇴 처리 중 오류가 발생했습니다.');
    }
  }

  return (
    <Container>
      <MyPageSidebar />

      <Main>
        <ContentWrapper>
          <PageTitle>환경 설정</PageTitle>
          <PageDesc>
            워케이션 서비스 이용 계정 정보를 관리하고 설정하세요.
          </PageDesc>

          {/* 1. 회원 정보 관리 섹션 */}
          <SectionCard>
            <SectionTitle>
              <UserCog size={24} />
              회원 정보
            </SectionTitle>

            {editMode ? (
              <MemberEditForm setEditMode={setEditMode} />
            ) : (
              <SettingRow>
                <SettingInfo>
                  <SettingLabel>회원 정보 수정</SettingLabel>
                  <SettingDesc>
                    이름, 연락처, 사내 소속 정보 등을 최신 정보로 변경할 수
                    있습니다.
                  </SettingDesc>
                </SettingInfo>

                <PrimaryButton onClick={() => setEditMode(true)}>
                  정보 수정
                </PrimaryButton>
              </SettingRow>
            )}
          </SectionCard>

          {/* 2. 계정 보안 섹션 (비밀번호 단독 구성) */}
          <SectionCard>
            <SectionTitle>
              <ShieldCheck size={24} />
              계정 보안
            </SectionTitle>

            {passwordEditMode ? (
              <PasswordEditForm setPasswordEditMode={setPasswordEditMode} />
            ) : (
              <SecurityBox>
                <SecurityInfo>
                  <SecurityTitle>비밀번호 변경</SecurityTitle>
                  <SecurityDesc>
                    안전한 서비스 이용을 위해 정기적으로 비밀번호를 변경해
                    주세요.
                  </SecurityDesc>
                </SecurityInfo>

                <OutlineButton onClick={() => setPasswordEditMode(true)}>
                  변경하기
                </OutlineButton>
              </SecurityBox>
            )}
          </SectionCard>

          {/* 3. 위험 구역 (회원 탈퇴 섹션) */}
          <DangerSection>
            <DangerTitle>회원 탈퇴</DangerTitle>
            <DangerDesc>
              탈퇴 시 기존 활성화된 예약 기록 및 보유하신 쿠폰 목록을 포함한
              모든 계정 데이터가 안전하게 파기되며 복구할 수 없습니다.
            </DangerDesc>
            <DangerButton onClick={accountDelete}>회원 탈퇴하기</DangerButton>
          </DangerSection>
        </ContentWrapper>
      </Main>
    </Container>
  );
}

export default MySettingPage;

/* ================= styled ================= */

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const Main = styled.main`
  flex: 1;
  padding: 48px; /* 💡 마이페이지/찜목록과 동일하게 48px 사방 패딩으로 통일 */

  /* ❌ 기존 가운데 정렬을 일으키던 display: flex 및 justify-content 제거 완료! */
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px; /* 💡 마이페이지 그리드 스펙인 1200px 와이드 뷰로 시원하게 확장 */
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`;

const PageDesc = styled.p`
  color: #94a3b8;
  margin-bottom: 40px;
  font-size: 15px;
`;

const SectionCard = styled.section`
  background-color: white;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 26px;
  border: 1px solid #edf1f4;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 28px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SettingInfo = styled.div``;

const SettingLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const SettingDesc = styled.div`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
`;

const SecurityBox = styled.div`
  background-color: #f8fafc;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SecurityInfo = styled.div``;

const SecurityTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const SecurityDesc = styled.div`
  color: #94a3b8;
  font-size: 14px;
`;

const PrimaryButton = styled.button`
  border: none;
  background-color: #3f6971;
  color: white;
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d4f55;
  }
`;

const OutlineButton = styled.button`
  border: 1px solid #cfd8de;
  background-color: white;
  color: #374151;
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const DangerSection = styled.div`
  margin-top: 50px;
  padding: 32px;
  background-color: #fff5f5;
  border-radius: 24px;
  border: 1px solid #fee2e2;
`;

const DangerTitle = styled.h3`
  color: #dc2626;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const DangerDesc = styled.p`
  color: #7f1d1d;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const DangerButton = styled.button`
  border: none;
  background-color: #dc2626;
  color: white;
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #991b1b;
  }
`;
