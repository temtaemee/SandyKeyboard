// src/features/admin/components/common/YearMonthPicker.jsx
import styled from 'styled-components';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function YearMonthPicker({ year, month, onChange }) {
  return (
    <Wrap>
      <Select
        value={year}
        onChange={(e) => onChange(Number(e.target.value), month)}
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </Select>
      <Select
        value={month}
        onChange={(e) => onChange(year, Number(e.target.value))}
      >
        {MONTHS.map((m) => (
          <option key={m} value={m}>{String(m).padStart(2, '0')}월</option>
        ))}
      </Select>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Select = styled.select`
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 6px;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s;
  &:hover { border-color: #94a3b8; }
  &:focus { outline: none; border-color: #3d646c; }
`;
