// components/common/ProfileAvatar.jsx
import styled from 'styled-components';

function ProfileAvatar({ profileImageUrl, name }) {
  // 이름의 첫 글자 추출 (예: "김유저" -> "김", 없으면 "?")
  const firstLetter = name ? name.charAt(0) : '?';

  // 이름 글자 수나 아스키 코드를 기반으로 항상 일정한 예쁜 배경색 지정 (구글 스타일)
  const colors = [
    '#4F6F78',
    '#5c7cfa',
    '#37b24d',
    '#f08c00',
    '#ae3ec9',
    '#f03e3e',
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const randomColor = colors[colorIndex];

  return (
    <AvatarWrapper $bgColor={randomColor}>
      {profileImageUrl ? (
        // 소셜 로그인 프로필 이미지가 있으면 이미지 노출
        <img src={profileImageUrl} alt={`${name} 프로필`} />
      ) : (
        // 없으면 구글 스타일 첫 글자 텍스트 노출 ✨
        <span className="initial-text">{firstLetter}</span>
      )}
    </AvatarWrapper>
  );
}

export default ProfileAvatar;

/* ─── 스타일 정의 ─── */
const AvatarWrapper = styled.div`
  width: 100px; /* 현재 마이페이지 UI 크기에 맞게 조절 */
  height: 100px;
  border-radius: 50%; /* 👈 원형으로 변경하면 구글 느낌 물씬 납니다! */
  background-color: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initial-text {
    color: #ffffff;
    font-size: 36px; /* 아바타 크기에 맞춘 폰트 사이즈 */
    font-weight: 700;
    user-select: none; /* 텍스트 드래그 방지 */
  }
`;
