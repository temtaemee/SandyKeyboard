import styled from 'styled-components';
import { Plus, Trash2 } from 'lucide-react';
import PriceWeekGrid from './PriceWeekGrid';

const ACCENT = '#3ec9a7';

const EMPTY_ITEM = () => ({
  startDate: '',
  endDate: '',
  monPrice: '',
  tuePrice: '',
  wedPrice: '',
  thuPrice: '',
  friPrice: '',
  satPrice: '',
  sunPrice: '',
  holidayPrice: '',
});

/**
 * 특별 단가 입력 폼 (기간별 단가 추가/삭제)
 * @param {array} extraPriceList
 * @param {function} onChange (extraPriceList) => void
 */
export default function ExtraPriceForm({ extraPriceList = [], onChange, errors = {} }) {
  const add = () => {
    onChange([...extraPriceList, EMPTY_ITEM()]);
  };

  const remove = (idx) => {
    onChange(extraPriceList.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, key, value) => {
    const next = extraPriceList.map((item, i) =>
      i === idx ? { ...item, [key]: value } : item
    );
    onChange(next);
  };

  return (
    <Wrap>
      <Header>
        <Title>특별 단가 설정 <Optional>(선택)</Optional></Title>
        <AddBtn type="button" onClick={add}>
          <Plus size={14} />
          기간 추가
        </AddBtn>
      </Header>

      {extraPriceList.length === 0 && (
        <EmptyMsg>특정 기간에 단가를 다르게 설정하려면 "기간 추가"를 클릭하세요.</EmptyMsg>
      )}

      {extraPriceList.map((item, idx) => (
        <ItemCard key={idx}>
          <ItemHeader>
            <ItemTitle>특별 단가 #{idx + 1}</ItemTitle>
            <RemoveBtn type="button" onClick={() => remove(idx)}>
              <Trash2 size={14} />
              삭제
            </RemoveBtn>
          </ItemHeader>

          <DateRow>
            <DateField>
              <Label>시작일</Label>
              <Input
                type="date"
                value={item.startDate ?? ''}
                $error={!!errors[`extra_${idx}_date`]}
                onChange={(e) => updateItem(idx, 'startDate', e.target.value)}
              />
            </DateField>
            <DateSep>~</DateSep>
            <DateField>
              <Label>종료일</Label>
              <Input
                type="date"
                value={item.endDate ?? ''}
                $error={!!errors[`extra_${idx}_date`]}
                onChange={(e) => updateItem(idx, 'endDate', e.target.value)}
              />
            </DateField>
          </DateRow>
          {errors[`extra_${idx}_date`] && (
            <DateError>{errors[`extra_${idx}_date`]}</DateError>
          )}

          <PriceWeekGrid
            prices={item}
            onChange={(key, value) => updateItem(idx, key, value)}
          />
        </ItemCard>
      ))}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Optional = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 4px;
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${ACCENT};
  border: 1.5px solid ${ACCENT};
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: rgba(62, 201, 167, 0.06);
  }
`;

const EmptyMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 16px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const ItemCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: #b91c1c; }
`;

const DateRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

const DateField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const DateSep = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding-bottom: 6px;
`;

const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${({ $error }) => ($error ? '#ef4444' : ACCENT)}; }
`;

const DateError = styled.p`
  font-size: 12px;
  color: #ef4444;
  margin-top: -8px;
`;
