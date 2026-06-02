import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ACCENT = '#3ec9a7';

export default function SellerPagination({ pno, total, onPage }) {
  if (!total || total <= 1) return null;

  const groupStart = Math.floor(pno / 10) * 10;
  const groupEnd   = Math.min(groupStart + 10, total);

  return (
    <Wrap>
      <Btn onClick={() => onPage(pno - 1)} disabled={pno === 0}>
        <ChevronLeft size={14} />
      </Btn>

      {groupStart > 0 && (
        <Btn onClick={() => onPage(groupStart - 1)}>···</Btn>
      )}

      {Array.from({ length: groupEnd - groupStart }, (_, i) => {
        const idx = groupStart + i;
        return (
          <Btn key={idx} $active={idx === pno} onClick={() => onPage(idx)}>
            {idx + 1}
          </Btn>
        );
      })}

      {groupEnd < total && (
        <Btn onClick={() => onPage(groupEnd)}>···</Btn>
      )}

      <Btn onClick={() => onPage(pno + 1)} disabled={pno >= total - 1}>
        <ChevronRight size={14} />
      </Btn>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const Btn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  background: ${({ $active }) => ($active ? ACCENT : 'white')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme?.colors?.textMid ?? '#64748b')};
  border: 1px solid ${({ $active }) => ($active ? ACCENT : '#e2e8f0')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    border-color: ${ACCENT};
    color: ${({ $active }) => ($active ? 'white' : ACCENT)};
  }
`;
