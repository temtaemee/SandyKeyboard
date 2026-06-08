// src/features/admin/components/common/YearMonthPicker.jsx
import styled from 'styled-components';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function YearMonthPicker({ year, month, onChange, availableDates }) {
  let displayYears = YEARS;
  let displayMonths = MONTHS;

  const hasAvailableData = availableDates && availableDates.length > 0;

  if (hasAvailableData) {
    // Extract unique years from availableDates, sorted descending
    displayYears = Array.from(new Set(availableDates.map(d => d.year))).sort((a, b) => b - a);

    // Extract months for the current selected year, sorted ascending
    const filteredMonths = Array.from(
      new Set(
        availableDates
          .filter(d => d.year === year)
          .map(d => d.month)
      )
    ).sort((a, b) => a - b);

    if (filteredMonths.length > 0) {
      displayMonths = filteredMonths;
    }
  }

  const handleYearChange = (e) => {
    const nextYear = Number(e.target.value);
    let nextMonth = month;

    if (hasAvailableData) {
      const nextYearMonths = Array.from(
        new Set(
          availableDates
            .filter(d => d.year === nextYear)
            .map(d => d.month)
        )
      ).sort((a, b) => a - b);

      if (nextYearMonths.length > 0 && !nextYearMonths.includes(month)) {
        // Fallback to the first available month of that year
        nextMonth = nextYearMonths[0];
      }
    }

    onChange(nextYear, nextMonth);
  };

  return (
    <Wrap>
      <Select
        value={year}
        onChange={handleYearChange}
      >
        {displayYears.map((y) => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </Select>
      <Select
        value={month}
        onChange={(e) => onChange(year, Number(e.target.value))}
      >
        {displayMonths.map((m) => (
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
