import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';

function AddressSearchModal({ onClose, onSelect }) {
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    // 💡 부모 컴포넌트(회원가입, 상품등록 등)가 지정한 핸들러로 데이터 전달
    onSelect({
      zonecode: data.zonecode,
      address: fullAddress,
    });

    onClose(); // 주소 선택 후 모달 닫기
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>주소 검색</h3>
          <CloseButton type="button" onClick={onClose}>
            ×
          </CloseButton>
        </ModalHeader>
        <DaumPostcode onComplete={handleComplete} />
      </ModalContainer>
    </ModalBackdrop>
  );
}

export default AddressSearchModal;

/* ── 모달 전용 스타일 컴포넌트 ── */
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #edf1f4;

  h3 {
    font-size: 16px;
    color: #3d4d54;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    color: #3d4d54;
  }
`;
