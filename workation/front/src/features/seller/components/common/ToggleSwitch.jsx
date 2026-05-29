import styled from 'styled-components';

const ACCENT = '#3ec9a7';

/**
 * 노출 토글 스위치
 * @param {boolean} checked
 * @param {function} onChange
 * @param {boolean} disabled
 * @param {boolean} loading
 */
export default function ToggleSwitch({ checked, onChange, disabled, loading }) {
  return (
    <Track
      $on={checked}
      $loading={loading}
      disabled={disabled || loading}
      onClick={() => !disabled && !loading && onChange && onChange(!checked)}
      type="button"
      aria-checked={checked}
      role="switch"
    >
      <Thumb $on={checked} />
    </Track>
  );
}

const Track = styled.button`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? ACCENT : '#e2e8f0')};
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
  opacity: ${({ $loading }) => ($loading ? 0.5 : 1)};
  cursor: ${({ $loading, disabled }) =>
    disabled || $loading ? 'not-allowed' : 'pointer'};
`;

const Thumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => ($on ? '21px' : '3px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: left 0.2s;
`;
