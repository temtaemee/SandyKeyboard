import { useState } from 'react';
import api from '../../../../app/api/axios';

function SocialLinkModal({ isOpen, onClose, linkData, onSuccess }) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !linkData) return null;

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await api.post('/public/social/send-code', { email: linkData.email });
      alert('인증 코드가 이메일로 발송되었습니다.');
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || '인증 코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndLink = async () => {
    if (!code.trim()) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/public/social/verify-code', {
        email: linkData.email,
        code,
      });
      await api.post('/public/social/link', {
        provider: linkData.provider,
        email: linkData.email,
        socialId: linkData.socialId,
      });

      alert('소셜 계정이 연결되었습니다. 다시 로그인해주세요.');
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || '인증 또는 계정 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>기존 계정 연동</h3>
        {step === 1 ? (
          <>
            <p style={styles.text}>
              <strong>{linkData.email}</strong> 계정이 이미 존재합니다.
              <br />
              {linkData.provider} 계정과 연결하려면 이메일 본인 확인이 필요합니다.
            </p>
            <div style={styles.buttonGroup}>
              <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={isLoading}>
                취소
              </button>
              <button type="button" onClick={handleSendCode} style={styles.confirmBtn} disabled={isLoading}>
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
              placeholder="인증 코드"
              style={styles.input}
              disabled={isLoading}
            />
            <div style={styles.buttonGroup}>
              <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={isLoading}>
                취소
              </button>
              <button type="button" onClick={handleVerifyAndLink} style={styles.confirmBtn} disabled={isLoading}>
                {isLoading ? '처리 중...' : '확인 및 연결'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    width: '400px',
    maxWidth: '90%',
    backgroundColor: '#fff',
    padding: '28px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
  },
  title: {
    marginTop: 0,
    color: '#333',
  },
  text: {
    margin: '20px 0',
    color: '#555',
    lineHeight: 1.6,
  },
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
