// features/member/components/login/NaverCallback.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axios';
import { restoreAccount } from '../../api/memberApi';
import SocialLinkModal from './SocialLinkModal';

function NaverCallback() {
  const navigate = useNavigate();
  const isProcessed = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkData, setLinkData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state'); // 네이버는 state 사용

    if (isProcessed.current) return;

    if (code) {
      isProcessed.current = true;
      let naverEmail = '';

      api
        .post('/guest/naver', { code: code, state: state })
        .then((response) => {
          const targetData = response.data ? response.data : response;
          const { token, isNewUser, email, profileImageUrl } = targetData;
          naverEmail = email;

          if (isNewUser === true || String(isNewUser) === 'true') {
            alert(
              '네이버 연동을 위해 추가 회원 정보 입력 페이지로 이동합니다.'
            );
            const photoParam = profileImageUrl
              ? `&profileImageUrl=${encodeURIComponent(profileImageUrl)}`
              : '';
            navigate(
              `/join?type=social&email=${email}&tempToken=${token}${photoParam}`
            );
          } else {
            localStorage.setItem('accessToken', token);
            alert('네이버 계정으로 로그인 성공!');
            navigate('/');
          }
        })
        .catch(async (error) => {
          console.error('네이버 로그인 처리 중 에러:', error);

          // [1] 401 에러: 탈퇴 유저 복구 로직
          if (error.response && error.response.status === 401) {
            const serverMessage = error.response.data?.message;

            if (serverMessage && serverMessage.includes('탈퇴')) {
              const isRestore = window.confirm(
                '탈퇴한 계정입니다. 계정을 복구하고 다시 로그인하시겠습니까?'
              );

              if (isRestore) {
                try {
                  const userEmail = error.response.data?.email;

                  if (!userEmail) {
                    alert(
                      '이메일 정보를 가져오지 못했습니다. 일반 로그인을 이용해 주세요.'
                    );
                    isProcessed.current = false;
                    navigate('/login');
                    return;
                  }

                  await restoreAccount({ username: userEmail });

                  alert(
                    '계정이 성공적으로 복구되었습니다! 다시 로그인을 시도해 주세요.'
                  );
                  isProcessed.current = false;
                  navigate('/login');
                  return;
                } catch (restoreErr) {
                  alert('계정 복구에 실패했습니다. 고객센터로 문의해 주세요.');
                  isProcessed.current = false;
                  navigate('/login');
                  return;
                }
              }
            }
          }

          // [2] 409 에러: 기존 계정 연동 로직
          if (error.response?.status === 409) {
            const data = error.response.data;
            if (data.result === 'LINK_REQUIRED') {
              // 💡 윈도우 confirm 대신 모달 띄우기용 데이터 세팅
              setLinkData({
                email: data.email,
                socialId: data.socialId,
                provider: 'NAVER', // 구글은 'GOOGLE', 네이버는 'NAVER'
              });
              setIsModalOpen(true);
              return; // 여기서 return해서 페이지가 바로 넘어가지 않게 막음
            }
          }

          if (!isModalOpen) {
            isProcessed.current = false;
            navigate('/login');
          }
        });
    }
  }, [navigate]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#3a4a57',
        }}
      >
        <h3>네이버 계정으로 모래묻은 키보드에 연결 중... 🦀</h3>
      </div>
      <SocialLinkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate('/login'); // 취소 시 로그인 화면으로 돌려보냄
        }}
        linkData={linkData}
        onSuccess={() => {
          setIsModalOpen(false);
          navigate('/login'); // 연동 완료 후 다시 로그인하도록 안내
        }}
      />
    </>
  );
}

export default NaverCallback;
