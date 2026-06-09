import styled from 'styled-components';

const ACCENT = '#3ec9a7';

const OPTION_GROUPS = [
  {
    label: '가구/기본시설',
    options: ['DESK', 'PRIVATE_BATHROOM', 'BATHTUB', 'SHOWER_BOOTH', 'BIDET', 'AMENITY'],
  },
  {
    label: '주방시설',
    options: ['KITCHEN', 'COOKING_AVAILABLE', 'MICROWAVE', 'INDUCTION', 'REFRIGERATOR', 'TABLEWARE', 'COFFEE_MACHINE'],
  },
  {
    label: '조망',
    options: ['OCEAN_VIEW', 'CITY_VIEW', 'MOUNTAIN_VIEW', 'GARDEN_VIEW', 'RIVER_VIEW'],
  },
];

export const OPTION_LABELS = {
  DESK: '책상',
  PRIVATE_BATHROOM: '개인 욕실',
  BATHTUB: '욕조',
  SHOWER_BOOTH: '샤워부스',
  BIDET: '비데',
  AMENITY: '어메니티',
  KITCHEN: '주방',
  COOKING_AVAILABLE: '취사 가능',
  MICROWAVE: '전자레인지',
  INDUCTION: '인덕션',
  REFRIGERATOR: '냉장고',
  TABLEWARE: '식기류',
  COFFEE_MACHINE: '커피머신',
  OCEAN_VIEW: '오션뷰',
  CITY_VIEW: '시티뷰',
  MOUNTAIN_VIEW: '마운틴뷰',
  GARDEN_VIEW: '가든뷰',
  RIVER_VIEW: '리버뷰',
};

/**
 * StayOption 다중 선택 체크박스 (카테고리별 그룹)
 * @param {string[]} selected 선택된 option enum 배열
 * @param {function} onChange (selected: string[]) => void
 * @param {boolean} readOnly
 */
export default function OptionSelector({ selected = [], onChange, readOnly = false }) {
  const toggle = (opt) => {
    if (readOnly) return;
    if (selected.includes(opt)) {
      onChange(selected.filter((o) => o !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  if (readOnly) {
    return (
      <ReadOnlyWrap>
        {OPTION_GROUPS.map((group) => {
          const selectedInGroup = group.options.filter((o) => selected.includes(o));
          if (selectedInGroup.length === 0) return null;
          return (
            <GroupBlock key={group.label}>
              <GroupLabel>{group.label}</GroupLabel>
              <BadgeRow>
                {selectedInGroup.map((opt) => (
                  <OptionBadge key={opt}>{OPTION_LABELS[opt] ?? opt}</OptionBadge>
                ))}
              </BadgeRow>
            </GroupBlock>
          );
        })}
        {selected.length === 0 && <EmptyMsg>선택된 옵션 없음</EmptyMsg>}
      </ReadOnlyWrap>
    );
  }

  return (
    <Wrap>
      {OPTION_GROUPS.map((group) => (
        <GroupBlock key={group.label}>
          <GroupLabel>{group.label}</GroupLabel>
          <OptionGrid>
            {group.options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <OptionItem key={opt} $checked={checked} onClick={() => toggle(opt)}>
                  <Checkbox $checked={checked}>{checked && '✓'}</Checkbox>
                  <OptionText $checked={checked}>{OPTION_LABELS[opt] ?? opt}</OptionText>
                </OptionItem>
              );
            })}
          </OptionGrid>
        </GroupBlock>
      ))}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReadOnlyWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GroupLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

const OptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid ${({ $checked }) => ($checked ? ACCENT : '#e2e8f0')};
  background: ${({ $checked }) => ($checked ? 'rgba(62,201,167,0.05)' : 'white')};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: ${ACCENT}; }
`;

const Checkbox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid ${({ $checked }) => ($checked ? ACCENT : '#cbd5e1')};
  background: ${({ $checked }) => ($checked ? ACCENT : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
`;

const OptionText = styled.span`
  font-size: 13px;
  font-weight: ${({ $checked }) => ($checked ? '600' : '400')};
  color: ${({ $checked }) => ($checked ? '#0d9488' : '#475569')};
  transition: color 0.15s;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const OptionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(62, 201, 167, 0.1);
  color: #0d9488;
`;

const EmptyMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
