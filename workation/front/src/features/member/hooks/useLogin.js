import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, restoreAccount } from '../api/memberApi';

function useLogin() {
  const navi = useNavigate();
  const [error, setError] = useState('');

  async function fetchLogin(vo) {
    try {
      setError('');

      const data = await login(vo);

      if (data.result === 'success') {
        localStorage.setItem('accessToken', data.token);
        console.log('로그인 성공');

        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          const roles = payload.roles || [];

          if (roles.includes('ADMIN')) {
            navi('/admin/dashboard');
          } else {
            navi(`/`);
          }
        } catch (decodeError) {
          console.error('토큰 디코딩 에러:', decodeError);
          navi(`/`);
        }
      } else {
        setError(data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 실패', err);

      if (err.response && err.response.status === 401) {
        let serverMessage = err.response.data?.message;
        if (serverMessage === "자격 증명에 실패하였습니다.") {
          serverMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
        }

        // 🌟 1. 탈퇴 회원인 경우 처리
        if (serverMessage && serverMessage.includes('탈퇴')) {
          setError(serverMessage); // 화면에 우선 "탈퇴 처리된 계정입니다." 표시

          // 🌟 2. 컨펌창을 띄우고 그 결과를 변수에 저장 (순서 바로잡음)
          const isRestore = window.confirm("탈퇴한 계정입니다. 계정을 복구하고 다시 로그인하시겠습니까?");

          if (isRestore) {
            try {
              // 백엔드에 탈퇴 복구 API 요청 주석 해제하여 사용
              await restoreAccount(vo);
              alert("계정이 성공적으로 복구되었습니다! 다시 로그인을 시도해 주세요.");
              setError(''); // 에러 메시지 초기화
            } catch (restoreErr) {
              alert("계정 복구에 실패했습니다. 고객센터로 문의해 주세요.");
            }
          }
        } else {
          // 🌟 3. 탈퇴가 아닌 일반 로그인 실패인 경우 (순서와 괄호 정리)
          setError(serverMessage || '아이디 또는 비밀번호가 일치하지 않습니다.');
        }

      } else if (err.response && err.response.status === 403) {
        setError('접근 권한이 없는 계정입니다.');
      } else {
        setError('서버와의 통신이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  }

  return { fetchLogin, navi, error };
}

export default useLogin;