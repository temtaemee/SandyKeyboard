import styled from 'styled-components';

const ACCENT = '#3ec9a7';

/**
 * 빈 상태 UI
 * @param {ReactNode} icon lucide 아이콘 엘리먼트
 * @param {string} title
 * @param {string} description
 * @param {string} actionLabel
 * @param {function} onAction
 */
export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Container>
      {icon && <IconWrap>{icon}</IconWrap>}
      <Title>{title}</Title>
      {description && <Desc>{description}</Desc>}
      {actionLabel && onAction && (
        <ActionBtn type="button" onClick={onAction}>
          {actionLabel}
        </ActionBtn>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  gap: 12px;
`;

const IconWrap = styled.div`
  color: #cbd5e1;
  margin-bottom: 4px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Desc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  max-width: 340px;
  line-height: 1.6;
`;

const ActionBtn = styled.button`
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #31b08e;
  }
`;
