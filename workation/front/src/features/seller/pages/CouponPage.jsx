import { useState } from 'react';
import styled from 'styled-components';
import { Tag, Plus, X, ToggleLeft, ToggleRight, Copy, CheckCircle } from 'lucide-react';

const ACCENT = '#3ec9a7';

const INITIAL_COUPONS = [
  { id: 1, code: 'SUMMER10', name: '여름 맞이 10% 할인', discountType: 'PERCENT', discountValue: 10, minOrder: 100000, maxDiscount: 50000, startDate: '2025-06-01', endDate: '2025-08-31', useLimit: 100, usedCount: 23, status: 'ACTIVE' },
  { id: 2, code: 'WELCOME5K', name: '신규 회원 5,000원 할인', discountType: 'FIXED', discountValue: 5000, minOrder: 50000, maxDiscount: null, startDate: '2025-01-01', endDate: '2025-12-31', useLimit: 200, usedCount: 87, status: 'ACTIVE' },
  { id: 3, code: 'JEJU20', name: '제주 20% 특별 할인', discountType: 'PERCENT', discountValue: 20, minOrder: 200000, maxDiscount: 60000, startDate: '2025-04-01', endDate: '2025-04-30', useLimit: 50, usedCount: 50, status: 'EXPIRED' },
  { id: 4, code: 'WORK15', name: '워케이션 전용 15% 할인', discountType: 'PERCENT', discountValue: 15, minOrder: 150000, maxDiscount: 40000, startDate: '2025-05-01', endDate: '2025-05-31', useLimit: 80, usedCount: 34, status: 'INACTIVE' },
];

const STATUS_LABEL = { ACTIVE: '활성', INACTIVE: '비활성', EXPIRED: '만료' };
const STATUS_COLOR = { ACTIVE: '#15803d', INACTIVE: '#64748b', EXPIRED: '#9ca3af' };
const STATUS_BG = { ACTIVE: '#dcfce7', INACTIVE: '#f1f5f9', EXPIRED: '#f3f4f6' };

const EMPTY_FORM = {
  name: '', code: '', discountType: 'PERCENT', discountValue: '', minOrder: '',
  maxDiscount: '', startDate: '', endDate: '', useLimit: '',
};

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function CouponPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = filterStatus === 'ALL' ? coupons : coupons.filter((c) => c.status === filterStatus);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = '쿠폰 이름을 입력하세요.';
    if (!form.code.trim()) e.code = '쿠폰 코드를 입력하세요.';
    if (!form.discountValue || Number(form.discountValue) <= 0) e.discountValue = '할인값을 입력하세요.';
    if (form.discountType === 'PERCENT' && Number(form.discountValue) > 100) e.discountValue = '최대 100%입니다.';
    if (!form.minOrder || Number(form.minOrder) < 0) e.minOrder = '최소 주문 금액을 입력하세요.';
    if (!form.startDate) e.startDate = '시작일을 선택하세요.';
    if (!form.endDate) e.endDate = '종료일을 선택하세요.';
    if (form.startDate && form.endDate && form.startDate > form.endDate) e.endDate = '종료일은 시작일 이후여야 합니다.';
    if (!form.useLimit || Number(form.useLimit) <= 0) e.useLimit = '사용 한도를 입력하세요.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    const newCoupon = {
      id: Date.now(),
      code: form.code.toUpperCase(),
      name: form.name,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrder: Number(form.minOrder),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      useLimit: Number(form.useLimit),
      usedCount: 0,
      status: 'ACTIVE',
    };
    setCoupons((p) => [newCoupon, ...p]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaving(false);
  };

  const toggleStatus = (id) => {
    setCoupons((p) =>
      p.map((c) => {
        if (c.id !== id || c.status === 'EXPIRED') return c;
        return { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      })
    );
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>쿠폰 관리</PageTitle>
          <PageSub>할인 쿠폰을 발행하고 사용 현황을 확인합니다</PageSub>
        </TitleGroup>
        <AddBtn onClick={() => setShowForm((p) => !p)}>
          {showForm ? <><X size={15} />취소</> : <><Plus size={15} />쿠폰 발행</>}
        </AddBtn>
      </PageHeader>

      {/* 발행 폼 */}
      {showForm && (
        <FormCard>
          <FormTitle>새 쿠폰 발행</FormTitle>
          <FormGrid>
            <FormGroup $full>
              <FormLabel>쿠폰 이름 *</FormLabel>
              <FormInput
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="쿠폰 이름"
                $error={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </FormGroup>

            <FormGroup>
              <FormLabel>쿠폰 코드 *</FormLabel>
              <CodeRow>
                <FormInput
                  value={form.code}
                  onChange={(e) => setField('code', e.target.value.toUpperCase())}
                  placeholder="CODE"
                  $error={!!errors.code}
                  style={{ flex: 1 }}
                />
                <GenBtn type="button" onClick={() => setField('code', generateCode())}>자동 생성</GenBtn>
              </CodeRow>
              {errors.code && <FieldError>{errors.code}</FieldError>}
            </FormGroup>

            <FormGroup>
              <FormLabel>할인 유형 *</FormLabel>
              <FormSelect value={form.discountType} onChange={(e) => setField('discountType', e.target.value)}>
                <option value="PERCENT">퍼센트 (%)</option>
                <option value="FIXED">정액 (원)</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel>할인값 * {form.discountType === 'PERCENT' ? '(%)' : '(원)'}</FormLabel>
              <FormInput
                type="number"
                value={form.discountValue}
                onChange={(e) => setField('discountValue', e.target.value)}
                placeholder={form.discountType === 'PERCENT' ? '10' : '5000'}
                $error={!!errors.discountValue}
              />
              {errors.discountValue && <FieldError>{errors.discountValue}</FieldError>}
            </FormGroup>

            <FormGroup>
              <FormLabel>최소 주문금액 (원) *</FormLabel>
              <FormInput
                type="number"
                value={form.minOrder}
                onChange={(e) => setField('minOrder', e.target.value)}
                placeholder="100000"
                $error={!!errors.minOrder}
              />
              {errors.minOrder && <FieldError>{errors.minOrder}</FieldError>}
            </FormGroup>

            <FormGroup>
              <FormLabel>최대 할인금액 (원, 선택)</FormLabel>
              <FormInput
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setField('maxDiscount', e.target.value)}
                placeholder="50000"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>시작일 *</FormLabel>
              <FormInput
                type="date"
                value={form.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
                $error={!!errors.startDate}
              />
              {errors.startDate && <FieldError>{errors.startDate}</FieldError>}
            </FormGroup>

            <FormGroup>
              <FormLabel>종료일 *</FormLabel>
              <FormInput
                type="date"
                value={form.endDate}
                onChange={(e) => setField('endDate', e.target.value)}
                $error={!!errors.endDate}
              />
              {errors.endDate && <FieldError>{errors.endDate}</FieldError>}
            </FormGroup>

            <FormGroup>
              <FormLabel>사용 한도 (매 수) *</FormLabel>
              <FormInput
                type="number"
                value={form.useLimit}
                onChange={(e) => setField('useLimit', e.target.value)}
                placeholder="100"
                $error={!!errors.useLimit}
              />
              {errors.useLimit && <FieldError>{errors.useLimit}</FieldError>}
            </FormGroup>
          </FormGrid>

          <FormActions>
            <CancelBtn onClick={() => { setShowForm(false); setErrors({}); setForm(EMPTY_FORM); }}>취소</CancelBtn>
            <SubmitBtn onClick={handleSubmit} disabled={saving}>
              {saving ? '발행 중...' : '쿠폰 발행'}
            </SubmitBtn>
          </FormActions>
        </FormCard>
      )}

      {/* 필터 + 목록 */}
      <Card>
        <TableHeader>
          <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">비활성</option>
            <option value="EXPIRED">만료</option>
          </FilterSelect>
          <TableCount>{filtered.length}개 쿠폰</TableCount>
        </TableHeader>

        <Table>
          <colgroup>
            <col width="130" />
            <col />
            <col width="120" />
            <col width="130" />
            <col width="160" />
            <col width="110" />
            <col width="80" />
            <col width="80" />
          </colgroup>
          <thead>
            <tr>
              {['코드', '쿠폰 이름', '할인', '최소 주문', '유효 기간', '사용현황', '상태', '활성'].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><Td colSpan={8}><Empty>쿠폰이 없습니다</Empty></Td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <Td>
                    <CodeCell>
                      <CodeText>{c.code}</CodeText>
                      <CopyBtn onClick={() => copyCode(c.code)} title="코드 복사">
                        {copied === c.code ? <CheckCircle size={12} color={ACCENT} /> : <Copy size={12} />}
                      </CopyBtn>
                    </CodeCell>
                  </Td>
                  <Td>
                    <CouponName>{c.name}</CouponName>
                    {c.maxDiscount && (
                      <MaxDiscount>최대 {c.maxDiscount.toLocaleString()}원</MaxDiscount>
                    )}
                  </Td>
                  <Td>
                    <DiscountText>
                      {c.discountType === 'PERCENT'
                        ? `${c.discountValue}%`
                        : `${c.discountValue.toLocaleString()}원`}
                    </DiscountText>
                  </Td>
                  <Td>{c.minOrder.toLocaleString()}원 이상</Td>
                  <Td>
                    <DateRange>{c.startDate}<br />{c.endDate}</DateRange>
                  </Td>
                  <Td>
                    <UseBar>
                      <UseText>{c.usedCount} / {c.useLimit}</UseText>
                      <UseBarTrack>
                        <UseBarFill $pct={Math.min((c.usedCount / c.useLimit) * 100, 100)} />
                      </UseBarTrack>
                    </UseBar>
                  </Td>
                  <Td>
                    <StatusBadge $color={STATUS_COLOR[c.status]} $bg={STATUS_BG[c.status]}>
                      {STATUS_LABEL[c.status]}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <ToggleBtn
                      onClick={() => toggleStatus(c.id)}
                      disabled={c.status === 'EXPIRED'}
                      title={c.status === 'EXPIRED' ? '만료된 쿠폰' : (c.status === 'ACTIVE' ? '비활성화' : '활성화')}
                    >
                      {c.status === 'ACTIVE'
                        ? <ToggleRight size={22} color={ACCENT} />
                        : <ToggleLeft size={22} color="#cbd5e1" />}
                    </ToggleBtn>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 24px;`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  background: ${ACCENT};
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #31b08e; }
`;

const FormCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const FormTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
`;

const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
`;

const FormInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#f87171' : theme.colors.border)};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  background: white;
  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? '#f87171' : ACCENT)};
    box-shadow: 0 0 0 3px ${({ $error }) => ($error ? '#fee2e250' : `${ACCENT}22`)};
  }
`;

const FormSelect = styled.select`
  height: 38px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  cursor: pointer;
`;

const CodeRow = styled.div`display: flex; gap: 8px;`;

const GenBtn = styled.button`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  background: white;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const FieldError = styled.p`
  font-size: 12px;
  color: #ef4444;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CancelBtn = styled.button`
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  background: white;
  cursor: pointer;
  font-family: inherit;
`;

const SubmitBtn = styled.button`
  height: 38px;
  padding: 0 20px;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#e2e8f0' : ACCENT)};
  color: ${({ disabled }) => (disabled ? '#94a3b8' : 'white')};
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterSelect = styled.select`
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  cursor: pointer;
`;

const TableCount = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  vertical-align: middle;
`;

const Empty = styled.div`
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const CodeCell = styled.div`display: flex; align-items: center; gap: 6px;`;

const CodeText = styled.span`
  font-family: 'Plus Jakarta Sans', monospace;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: 0.5px;
`;

const CopyBtn = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  &:hover { color: ${ACCENT}; background: ${ACCENT}18; }
`;

const CouponName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const MaxDiscount = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const DiscountText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${ACCENT};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const DateRange = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const UseBar = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const UseText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMid};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const UseBarTrack = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 999px;
  overflow: hidden;
`;

const UseBarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${ACCENT};
  border-radius: 999px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
`;

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: opacity 0.15s;
`;
