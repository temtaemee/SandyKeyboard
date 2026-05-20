// src/features/admin/components/common/AdminSearchInput.jsx
import styled from 'styled-components';
import { Search, X } from 'lucide-react';

export default function AdminSearchInput({
  value,
  onChange,
  placeholder = '검색...',
  width = '220px',
}) {
  return (
    <SearchWrap $width={width}>
      <SearchIconWrap>
        <Search size={14} color="#94a3b8" />
      </SearchIconWrap>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <ClearBtn onClick={() => onChange('')}>
          <X size={13} color="#94a3b8" />
        </ClearBtn>
      )}
    </SearchWrap>
  );
}

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ $width }) => $width};
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 7px 32px 7px 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #0d1c2e;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36, 76, 84, 0.08);
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover {
    background: #f1f5f9;
  }
`;
