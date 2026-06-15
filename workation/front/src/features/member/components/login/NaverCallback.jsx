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
    const state = params.get('state');

    if (isProcessed.current || !code) return;
    isProcessed.current = true;

    api
      .post('/guest/naver', { code, state })
      .then((response) => {
        const targetData = response.data ? response.data : response;
        const { token, isNewUser, email } = targetData;

        if (isNewUser === true || String(isNewUser) === 'true') {
          alert('추가 회원 정보 입력 페이지로 이동합니다.');
          navigate(`/join?type=social&email=${encodeURIComponent(email)}&tempToken=${encodeURIComponent(token)}`);
          return;
        }

        localStorage.setItem('accessToken', token);
        alert('네이버 로그인 성공!');
        navigate('/');
      })
      .catch(async (error) => {
        if (handleLinkRequired(error, 'NAVER')) return;
        if (await handleWithdrawn(error)) return;

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Naver login failed.';
        alert(errorMessage);
        isProcessed.current = false;
        navigate('/login');
      });
  }, [navigate]);

  const handleLinkRequired = (error, provider) => {
    const data = error.response?.data;
    if (error.response?.status !== 409 || data?.result !== 'LINK_REQUIRED') {
      return false;
    }

    setLinkData({
      email: data.email,
      socialId: data.socialId,
      provider: data.provider || provider,
    });
    setIsModalOpen(true);
    return true;
  };

  const handleWithdrawn = async (error) => {
    if (error.response?.status !== 401) return false;

    const serverMessage = error.response.data?.message || '';
    if (!serverMessage.includes('탈퇴')) return false;

    const isRestore = window.confirm('탈퇴한 계정입니다. 계정을 복구하고 다시 로그인하시겠습니까?');
    if (!isRestore) return true;

    const userEmail = error.response.data?.email;
    if (!userEmail) {
      alert('이메일 정보를 가져오지 못했습니다. 일반 로그인을 이용해 주세요.');
      isProcessed.current = false;
      navigate('/login');
      return true;
    }

    try {
      await restoreAccount({ username: userEmail });
      alert('계정이 복구되었습니다. 다시 로그인해주세요.');
      navigate('/login');
    } catch (restoreErr) {
      alert('계정 복구에 실패했습니다. 고객센터로 문의해 주세요.');
    }
    return true;
  };

  return (
    <>
      <div style={styles.wrapper}>
        <h3>네이버 계정으로 연결 중...</h3>
      </div>
      <SocialLinkModal
        isOpen={isModalOpen}
        linkData={linkData}
        onClose={() => {
          setIsModalOpen(false);
          navigate('/login');
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          navigate('/login');
        }}
      />
    </>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#3a4a57',
  },
};

export default NaverCallback;
