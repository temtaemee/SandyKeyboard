import styled from 'styled-components';

const AREA_OPTIONS = [
  { value: 'SEOUL', label: '서울' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'GANGWON', label: '강원' },
  { value: 'CHUNGNAM', label: '충남' },
  { value: 'CHUNGBUK', label: '충북' },
  { value: 'GYEONGNAM', label: '경남' },
  { value: 'GYEONGBUK', label: '경북' },
  { value: 'JEONNAM', label: '전남' },
  { value: 'JEONBUK', label: '전북' },
  { value: 'JEJU', label: '제주' },
];

/**
 * 공간 등록 Step1 — 기본정보
 * @param {object} data 폼 데이터
 * @param {function} onChange (field, value) => void
 * @param {object} errors { field: message }
 */
export default function SpaceFormStep1({ data, onChange, errors = {} }) {
  const field = (name) => ({
    value: data[name] ?? '',
    onChange: (e) => onChange(name, e.target.value),
  });

  return (
    <Wrap>
      <Row>
        <Field>
          <Label>공간명 <Req>*</Req></Label>
          <Input {...field('name')} placeholder="공간 이름을 입력하세요" $error={!!errors.name} />
          {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </Field>
        <Field>
          <Label>지역 <Req>*</Req></Label>
          <Select
            value={data.area ?? ''}
            onChange={(e) => onChange('area', e.target.value)}
            $error={!!errors.area}
          >
            <option value="">지역 선택</option>
            {AREA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          {errors.area && <ErrorMsg>{errors.area}</ErrorMsg>}
        </Field>
      </Row>

      <Row>
        <Field>
          <Label>전화번호 <Req>*</Req></Label>
          <Input
            {...field('phone')}
            placeholder="010-0000-0000"
            maxLength={15}
            $error={!!errors.phone}
          />
          {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
        </Field>
        <Field>
          <Label>이메일 <Req>*</Req></Label>
          <Input
            {...field('email')}
            type="email"
            placeholder="contact@example.com"
            $error={!!errors.email}
          />
          {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
        </Field>
      </Row>

      <Field>
        <Label>한줄 소개 <Req>*</Req></Label>
        <Input
          {...field('summary')}
          placeholder="공간을 한 문장으로 소개해주세요 (최대 255자)"
          maxLength={255}
          $error={!!errors.summary}
        />
        {errors.summary && <ErrorMsg>{errors.summary}</ErrorMsg>}
      </Field>

      <Field>
        <Label>상세 설명 <Req>*</Req></Label>
        <Textarea
          {...field('description')}
          placeholder="공간의 특징, 시설, 주변 환경 등을 자세히 설명해주세요"
          rows={5}
          $error={!!errors.description}
        />
        {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
      </Field>

      <Row>
        <Field style={{ flex: 2 }}>
          <Label>주소 (도로명/지번) <Req>*</Req></Label>
          <Input
            {...field('address1')}
            placeholder="예) 서울특별시 강남구 테헤란로 123"
            $error={!!errors.address1}
          />
          {errors.address1 && <ErrorMsg>{errors.address1}</ErrorMsg>}
        </Field>
        <Field>
          <Label>상세 주소</Label>
          <Input {...field('address2')} placeholder="동/호수, 건물명 등" />
        </Field>
      </Row>

      <Row>
        <Field>
          <Label>위도 (Latitude)</Label>
          <Input
            {...field('latitude')}
            type="number"
            step="any"
            placeholder="예) 37.4979"
          />
        </Field>
        <Field>
          <Label>경도 (Longitude)</Label>
          <Input
            {...field('longitude')}
            type="number"
            step="any"
            placeholder="예) 127.0276"
          />
        </Field>
      </Row>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  & > * {
    flex: 1;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Req = styled.span`
  color: #ef4444;
  margin-left: 2px;
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
  &:focus {
    border-color: #3ec9a7;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  &:focus {
    border-color: #3ec9a7;
  }
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  outline: none;
  resize: vertical;
  line-height: 1.6;
  transition: border-color 0.15s;
  &:focus {
    border-color: #3ec9a7;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: #ef4444;
`;
