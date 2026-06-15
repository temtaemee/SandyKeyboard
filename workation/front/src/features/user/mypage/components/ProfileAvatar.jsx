import styled from 'styled-components';
import { resolveAssetUrl } from '../../../../app/config/env';

function ProfileAvatar({ profileImageUrl, name }) {
  const firstLetter = name ? name.charAt(0) : '?';
  const colors = [
    '#4F6F78',
    '#5c7cfa',
    '#37b24d',
    '#f08c00',
    '#ae3ec9',
    '#f03e3e',
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const imageSrc = profileImageUrl ? resolveAssetUrl(profileImageUrl) : null;

  return (
    <AvatarWrapper $bgColor={colors[colorIndex]}>
      {imageSrc ? (
        <img src={imageSrc} alt={`${name || '회원'} 프로필`} />
      ) : (
        <span className="initial-text">{firstLetter}</span>
      )}
    </AvatarWrapper>
  );
}

export default ProfileAvatar;

const AvatarWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
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
    font-size: 36px;
    font-weight: 700;
    user-select: none;
  }
`;
