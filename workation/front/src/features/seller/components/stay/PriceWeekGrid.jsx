import styled from 'styled-components';

const DAYS = [
  { key: 'monPrice', label: '월' },
  { key: 'tuePrice', label: '화' },
  { key: 'wedPrice', label: '수' },
  { key: 'thuPrice', label: '목' },
  { key: 'friPrice', label: '금' },
  { key: 'satPrice', label: '토', highlight: true },
  { key: 'sunPrice', label: '일', highlight: true },
  { key: 'holidayPrice', label: '공휴일', holiday: true },
];

/**
 * 요일별 단가 입력 그리드
 * @param {object} prices { monPrice, tuePrice, wedPrice, thuPrice, friPrice, satPrice, sunPrice, holidayPrice }
 * @param {function} onChange (key, value) => void
 * @param {boolean} readOnly
 */
export default function PriceWeekGrid({ prices = {}, onChange, readOnly = false }) {
  return (
    <Grid>
      {DAYS.map(({ key, label, highlight, holiday }) => (
        <DayCell key={key}>
          <DayLabel $highlight={highlight} $holiday={holiday}>{label}</DayLabel>
          <PriceInput
            type="number"
            min={0}
            value={prices[key] ?? ''}
            readOnly={readOnly}
            disabled={readOnly}
            onChange={(e) => onChange?.(key, e.target.value === '' ? '' : Number(e.target.value))}
            $highlight={highlight}
            $holiday={holiday}
            placeholder="0"
          />
          {!readOnly && <Won>원</Won>}
          {readOnly && prices[key] != null && (
            <PriceDisplay $highlight={highlight} $holiday={holiday}>
              {Number(prices[key]).toLocaleString()}원
            </PriceDisplay>
          )}
        </DayCell>
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const DayLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ $holiday }) =>
    $holiday ? '#fef3c7' : ({ $highlight }) => ($highlight ? '#fee2e2' : '#f1f5f9')};
  color: ${({ $holiday }) =>
    $holiday ? '#d97706' : ({ $highlight }) => ($highlight ? '#b91c1c' : '#475569')};
`;

const PriceInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid ${({ $holiday, $highlight, theme }) =>
    $holiday ? '#fcd34d' : $highlight ? '#fca5a5' : theme.colors.border};
  font-size: 13px;
  text-align: right;
  font-family: ${({ theme }) => theme.fonts.number};
  background: ${({ disabled }) => (disabled ? '#f8fafc' : 'white')};
  color: ${({ theme }) => theme.colors.adminTextDark};
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #3ec9a7; }
  &:disabled { cursor: default; }
  /* number input 스피너 숨기기 */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; }
`;

const Won = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PriceDisplay = styled.span`
  font-size: 13px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.number};
  color: ${({ $holiday }) =>
    $holiday ? '#d97706' : ({ $highlight }) => ($highlight ? '#b91c1c' : '#1e293b')};
`;
