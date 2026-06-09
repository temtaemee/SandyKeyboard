// src/features/member/components/login/SocialLinkModal.jsx
import { useState } from 'react';
import api from '../../../../app/api/axios';

function SocialLinkModal({ isOpen, onClose, linkData, onSuccess }) {
  const [step, setStep] = useState(1); // 1: 코드 발송 전, 2: 코드 입력 단계
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !linkData) return null;

  // 1️⃣ 이메일로 인증 코드 발송
  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await api.post('/public/social/send-code', { email: linkData.email });
      alert('인증 코드가 이메일로 발송되었습니다. 메일함을 확인해주세요.');
      setStep(2);
    } catch (error) {
      alert('인증 코드 발송에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2️⃣ 코드 검증 및 연동 처리
  const handleVerifyAndLink = async () => {
    if (!code.trim()) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. 코드 검증 API 호출
      await api.post('/public/social/verify-code', {
        email: linkData.email,
        code: code,
      });

      // 2. 검증 통과 시 연동 API 호출
      await api.post('/public/social/link', {
        provider: linkData.provider,
        email: linkData.email,
        socialId: linkData.socialId,
      });

      alert('성공적으로 계정이 연동되었습니다! 다시 로그인해주세요.');
      onSuccess(); // 연동 성공 후 처리 (보통 로그인 페이지로 이동)
    } catch (error) {
      alert('인증 코드가 올바르지 않거나 연동에 실패했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 배경 클릭 시 모달 닫기 방지 (보안/UX 목적)
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>기존 계정 연동 안내</h3>

        {step === 1 ? (
          <>
            <p style={styles.text}>
              <strong>{linkData.email}</strong>(으)로 가입된 계정이 이미
              존재합니다.
              <br />
              현재 {linkData.provider} 계정과 연동하시려면 본인 확인이
              필요합니다.
            </p>
            <div style={styles.buttonGroup}>
              <button
                onClick={onClose}
                style={styles.cancelBtn}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                onClick={handleSendCode}
                style={styles.confirmBtn}
                disabled={isLoading}
              >
                {isLoading ? '발송 중...' : '인증 코드 받기'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={styles.text}>이메일로 발송된 인증 코드를 입력해주세요.</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증 코드 입력"
              style={styles.input}
              disabled={isLoading}
            />
            <div style={styles.buttonGroup}>
              <button
                onClick={onClose}
                style={styles.cancelBtn}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                onClick={handleVerifyAndLink}
                style={styles.confirmBtn}
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '확인 및 연동'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 간단한 인라인 스타일 (프로젝트에서 사용하는 CSS 모듈이나 Tailwind 등으로 교체하시면 됩니다)
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: { marginTop: 0, color: '#333' },
  text: { margin: '20px 0', color: '#666', lineHeight: '1.5' },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default SocialLinkModal;
