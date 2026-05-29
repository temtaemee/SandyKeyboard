import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Loader } from 'lucide-react';
import { spaceApi } from '../../api/spaceApi';

const ACCENT = '#3ec9a7';

/**
 * 공간 등록 Step3 — 편의시설 선택 + 직접 추가
 * arcadeIdList: number[]
 * onChange: (arcadeIdList: number[]) => void
 */
export default function SpaceFormStep3({ arcadeIdList = [], onChange }) {
  const [arcades, setArcades] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [customName, setCustomName] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    spaceApi.getArcades()
      .then((res) => setArcades(res.data))
      .catch(() => {
        setAddError('편의시설 목록을 불러오지 못했습니다. 백엔드 서버를 확인하세요.');
      })
      .finally(() => setLoadingList(false));
  }, []);

  const toggle = (id) => {
    if (arcadeIdList.includes(id)) {
      onChange(arcadeIdList.filter((a) => a !== id));
    } else {
      onChange([...arcadeIdList, id]);
    }
  };

  const handleAdd = async () => {
    const name = customName.trim();
    if (!name) { setAddError('이름을 입력하세요'); return; }
    if (arcades.some((a) => a.name === name)) { setAddError('이미 존재하는 항목입니다'); return; }

    setAdding(true);
    setAddError('');
    try {
      const res = await spaceApi.createArcade(name);
      const newArcade = res.data;
      setArcades((prev) => [...prev, newArcade]);
      onChange([...arcadeIdList, newArcade.id]);
      setCustomName('');
    } catch (e) {
      setAddError(e.response?.data?.message ?? '추가에 실패했습니다');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Wrap>
      <SectionTitle>편의시설 선택 <Optional>(선택)</Optional></SectionTitle>
      <SectionDesc>공간에 제공되는 편의시설을 선택하세요. 목록에 없으면 직접 추가할 수 있습니다.</SectionDesc>

      {loadingList ? (
        <LoadingRow>
          <Loader size={16} />
          <span>편의시설 목록 로딩 중...</span>
        </LoadingRow>
      ) : (
        <ArcadeGrid>
          {arcades.map((arcade) => {
            const checked = arcadeIdList.includes(arcade.id);
            return (
              <ArcadeItem key={arcade.id} $checked={checked} onClick={() => toggle(arcade.id)}>
                <Checkbox $checked={checked}>{checked && '✓'}</Checkbox>
                <ArcadeName $checked={checked}>{arcade.name}</ArcadeName>
              </ArcadeItem>
            );
          })}
          {arcades.length === 0 && (
            <EmptyMsg>등록된 편의시설이 없습니다. 아래에서 직접 추가하세요.</EmptyMsg>
          )}
        </ArcadeGrid>
      )}

      {/* 직접 추가 */}
      <AddSection>
        <AddTitle>직접 추가</AddTitle>
        <AddRow>
          <AddInput
            type="text"
            placeholder="편의시설 이름 입력 (예: 수영장, 피트니스)"
            value={customName}
            onChange={(e) => { setCustomName(e.target.value); setAddError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            disabled={adding}
            maxLength={50}
          />
          <AddBtn type="button" onClick={handleAdd} disabled={adding || !customName.trim()}>
            {adding ? <Loader size={15} /> : <Plus size={15} />}
            추가
          </AddBtn>
        </AddRow>
        {addError && <AddError>{addError}</AddError>}
      </AddSection>

      {arcadeIdList.length > 0 && (
        <SelectedInfo>선택된 편의시설: {arcadeIdList.length}개</SelectedInfo>
      )}
    </Wrap>
  );
}

/* ── Styled Components ── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
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

const SectionDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: -8px;
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ArcadeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
`;

const ArcadeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid ${({ $checked }) => ($checked ? ACCENT : '#e2e8f0')};
  background: ${({ $checked }) => ($checked ? 'rgba(62,201,167,0.05)' : 'white')};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: ${ACCENT}; }
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid ${({ $checked }) => ($checked ? ACCENT : '#cbd5e1')};
  background: ${({ $checked }) => ($checked ? ACCENT : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
`;

const ArcadeName = styled.span`
  font-size: 13px;
  font-weight: ${({ $checked }) => ($checked ? '600' : '400')};
  color: ${({ $checked }) => ($checked ? '#0d9488' : '#475569')};
  transition: color 0.15s;
`;

const EmptyMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  grid-column: 1 / -1;
`;

const AddSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

const AddTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const AddRow = styled.div`
  display: flex;
  gap: 8px;
`;

const AddInput = styled.input`
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
  &:disabled { background: ${({ theme }) => theme.colors.borderLight}; }
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 38px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: white;
  background: ${ACCENT};
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  &:hover:not(:disabled) { background: #31b08e; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const AddError = styled.p`
  font-size: 12px;
  color: #b91c1c;
`;

const SelectedInfo = styled.p`
  font-size: 13px;
  color: #0d9488;
  font-weight: 500;
`;
