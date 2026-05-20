import styled from 'styled-components';
import { Bell, ShieldCheck, Globe, UserCog } from 'lucide-react';
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
      const result = confirm('정말 탈퇴하시겠습니까?');
      if (!result) {
        return;
      }
      await deleteAccount();
      alert('회원탈퇴 성공');
      localStorage.removeItem('accessToken');
      location.href = '/';
    } catch (error) {
      console.error(error);
      alert('회원탈퇴 실패했습니다.');
    }
  }
  return (
    <Container>
      <MyPageSidebar />

      <Main>
        <ContentWrapper>
          <PageTitle>환경 설정</PageTitle>

          <PageDesc>워케이션 서비스 이용 환경을 설정하고 관리하세요.</PageDesc>

          {/* 회원 정보 */}
          <SectionCard>
            <SectionTitle>
              <UserCog size={22} />
              회원 정보
            </SectionTitle>

            {editMode ? (
              <MemberEditForm setEditMode={setEditMode} />
            ) : (
              <SettingRow>
                <SettingInfo>
                  <SettingLabel>회원 정보 수정</SettingLabel>

                  <SettingDesc>
                    이름, 연락처, 기업 정보 등을 수정할 수 있습니다.
                  </SettingDesc>
                </SettingInfo>

                <PrimaryButton onClick={() => setEditMode(true)}>
                  정보 수정
                </PrimaryButton>
              </SettingRow>
            )}
          </SectionCard>

          {/* 알림 설정 */}
          <SectionCard>
            <SectionTitle>
              <Bell size={22} />
              알림 설정
            </SectionTitle>

            <SettingRow>
              <SettingInfo>
                <SettingLabel>푸시 알림</SettingLabel>

                <SettingDesc>
                  예약 상태 및 주요 안내를 알림으로 받습니다.
                </SettingDesc>
              </SettingInfo>

              <Toggle active />
            </SettingRow>

            <Divider />

            <SettingRow>
              <SettingInfo>
                <SettingLabel>이메일 마케팅 수신</SettingLabel>

                <SettingDesc>
                  신규 워케이션 공간 및 이벤트 소식을 이메일로 받습니다.
                </SettingDesc>
              </SettingInfo>

              <Toggle />
            </SettingRow>
          </SectionCard>

          {/* 보안 */}
          <SectionCard>
            <SectionTitle>
              <ShieldCheck size={22} />
              계정 보안
            </SectionTitle>

            {passwordEditMode ? (
              <PasswordEditForm setPasswordEditMode={setPasswordEditMode} />
            ) : (
              <>
                <SecurityBox>
                  <SecurityInfo>
                    <SecurityTitle>비밀번호 변경</SecurityTitle>

                    <SecurityDesc>마지막 변경 : 3개월 전</SecurityDesc>
                  </SecurityInfo>

                  <OutlineButton
                    onClick={() => {
                      setPasswordEditMode(true);
                    }}
                  >
                    변경하기
                  </OutlineButton>
                </SecurityBox>

                <SecurityBox>
                  <SecurityInfo>
                    <SecurityTitle>2단계 인증 설정</SecurityTitle>

                    <SecurityDesc>계정 보안을 더욱 강화합니다.</SecurityDesc>
                  </SecurityInfo>

                  <PrimaryButton>설정하기</PrimaryButton>
                </SecurityBox>
              </>
            )}
          </SectionCard>

          {/* 언어 */}
          <SectionCard>
            <SectionTitle>
              <Globe size={22} />
              서비스 언어
            </SectionTitle>

            <SelectLabel>언어 선택</SelectLabel>

            <LanguageSelect>
              <option>한국어 (Korean)</option>
              <option>English</option>
              <option>日本語</option>
            </LanguageSelect>
          </SectionCard>

          {/* 탈퇴 */}
          <DangerSection>
            <DangerTitle>회원 탈퇴</DangerTitle>

            <DangerDesc>
              탈퇴 시 예약 기록 및 일부 데이터가 삭제될 수 있습니다.
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

const Section = styled.section`
  background-color: white;
  border-radius: 28px;
  padding: 36px;
  margin-bottom: 28px;
`;

const Main = styled.main`
  flex: 1;
  padding: 48px 32px;

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 980px;
`;

const PageTitle = styled.h1`
  font-size: 42px;
  color: #374151;
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
  padding: 30px;
  margin-bottom: 26px;

  border: 1px solid #edf1f4;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 24px;
  color: #374151;

  margin-bottom: 26px;
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
  font-size: 17px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const SettingDesc = styled.div`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #edf1f4;
  margin: 24px 0;
`;

const Toggle = styled.div`
  width: 54px;
  height: 30px;
  border-radius: 999px;
  position: relative;
  cursor: pointer;

  background-color: ${({ active }) => (active ? '#3f6971' : '#dbe2e8')};

  &::after {
    content: '';

    width: 22px;
    height: 22px;

    border-radius: 50%;
    background-color: white;

    position: absolute;
    top: 4px;

    left: ${({ active }) => (active ? '28px' : '4px')};

    transition: 0.2s;
  }
`;

const SecurityBox = styled.div`
  background-color: #f8fafc;
  border-radius: 18px;

  padding: 22px;
  margin-bottom: 18px;

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
  font-size: 13px;
`;

const PrimaryButton = styled.button`
  border: none;
  background-color: #3f6971;
  color: white;

  height: 42px;
  padding: 0 22px;

  border-radius: 12px;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;
`;

const OutlineButton = styled.button`
  border: 1px solid #cfd8de;
  background-color: white;
  color: #374151;

  height: 42px;
  padding: 0 22px;

  border-radius: 12px;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;
`;

const SelectLabel = styled.div`
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 12px;
`;

const LanguageSelect = styled.select`
  width: 100%;
  height: 52px;

  border: 1px solid #dbe2e8;
  border-radius: 14px;

  padding: 0 16px;
  font-size: 15px;

  outline: none;
  background-color: white;
`;

const DangerSection = styled.div`
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #e5e7eb;
`;

const DangerTitle = styled.h3`
  color: #dc2626;
  font-size: 20px;
  margin-bottom: 10px;
`;

const DangerDesc = styled.p`
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 20px;
`;

const DangerButton = styled.button`
  border: none;
  background-color: #fee2e2;
  color: #dc2626;

  height: 44px;
  padding: 0 20px;

  border-radius: 12px;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;
`;
