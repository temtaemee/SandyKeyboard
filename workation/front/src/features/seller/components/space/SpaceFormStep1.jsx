import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Search, MapPin } from 'lucide-react';

const ACCENT = '#3ec9a7';

const AREA_OPTIONS = [
  { value: 'SEOUL',    label: '서울' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'GANGWON',  label: '강원' },
  { value: 'CHUNGNAM', label: '충남' },
  { value: 'CHUNGBUK', label: '충북' },
  { value: 'GYEONGNAM', label: '경남' },
  { value: 'GYEONGBUK', label: '경북' },
  { value: 'JEONNAM',  label: '전남' },
  { value: 'JEONBUK',  label: '전북' },
  { value: 'JEJU',     label: '제주' },
];

export default function SpaceFormStep1({ data, onChange, errors = {} }) {
  const mapRef     = useRef(null); // 지도 div
  const mapObjRef  = useRef(null); // kakao.maps.Map 인스턴스
  const markerRef  = useRef(null); // kakao.maps.Marker 인스턴스

  const field = (name) => ({
    value: data[name] ?? '',
    onChange: (e) => onChange(name, e.target.value),
  });

  // 지도 초기화 (address1 있을 때만 핀 표시)
  useEffect(() => {
    if (!window.kakao?.maps || !mapRef.current) return;

    const initMap = () => {
      const center = new window.kakao.maps.LatLng(36.5, 127.5); // 대한민국 중심
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: 13 });
      mapObjRef.current = map;
      markerRef.current = new window.kakao.maps.Marker({ map });
      markerRef.current.setVisible(false);

      // 이미 좌표가 있으면 핀 표시
      if (data.latitude && data.longitude) {
        movePin(map, markerRef.current, Number(data.latitude), Number(data.longitude));
      }
    };

    // SDK가 완전히 로드된 경우 즉시 실행, 아직 로딩 중이면 load() 콜백으로 대기
    if (window.kakao.maps.LatLng) {
      initMap();
    } else {
      window.kakao.maps.load(initMap);
    }
  }, []); // 마운트 한 번만

  function movePin(map, marker, lat, lng) {
    const pos = new window.kakao.maps.LatLng(lat, lng);
    map.setCenter(pos);
    map.setLevel(4);
    marker.setPosition(pos);
    marker.setVisible(true);
  }

  // 카카오 우편번호 팝업 → Geocoder → 폼/지도 업데이트
  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도하세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete(result) {
        const address = result.roadAddress || result.jibunAddress;
        onChange('address1', address);

        // Geocoder로 좌표 변환
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (results, status) => {
          if (status !== window.kakao.maps.services.Status.OK) return;
          const { y: lat, x: lng } = results[0];
          onChange('latitude',  lat);
          onChange('longitude', lng);

          if (mapObjRef.current && markerRef.current) {
            movePin(mapObjRef.current, markerRef.current, Number(lat), Number(lng));
          }
        });
      },
    }).open();
  };

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
          <Input {...field('phone')} placeholder="010-0000-0000" maxLength={15} $error={!!errors.phone} />
          {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
        </Field>
        <Field>
          <Label>이메일 <Req>*</Req></Label>
          <Input {...field('email')} type="email" placeholder="contact@example.com" $error={!!errors.email} />
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

      {/* ── 주소 + 지도 ── */}
      <Field>
        <Label>주소 <Req>*</Req></Label>
        <AddressRow>
          <AddressInput
            value={data.address1 ?? ''}
            readOnly
            placeholder="아래 버튼으로 주소를 검색하세요"
            $error={!!errors.address1}
          />
          <SearchBtn type="button" onClick={openPostcode}>
            <Search size={15} />주소 검색
          </SearchBtn>
        </AddressRow>
        {errors.address1 && <ErrorMsg>{errors.address1}</ErrorMsg>}
      </Field>

      <Field>
        <Label>상세 주소</Label>
        <Input {...field('address2')} placeholder="동/호수, 건물명 등" />
      </Field>

      {/* 지도 미리보기 */}
      <MapWrap>
        <MapDiv ref={mapRef} />
        {data.latitude && data.longitude ? (
          <CoordBadge>
            <MapPin size={12} />
            {Number(data.latitude).toFixed(6)}, {Number(data.longitude).toFixed(6)}
          </CoordBadge>
        ) : (
          <MapPlaceholder>주소를 검색하면 지도에 위치가 표시됩니다</MapPlaceholder>
        )}
      </MapWrap>
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 20px;`;

const Row = styled.div`
  display: flex; gap: 16px;
  & > * { flex: 1; }
`;

const Field = styled.div`display: flex; flex-direction: column; gap: 6px;`;

const Label = styled.label`
  font-size: 13px; font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Req = styled.span`color: #ef4444; margin-left: 2px;`;

const Input = styled.input`
  height: 40px; padding: 0 12px; border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px; color: ${({ theme }) => theme.colors.adminTextDark};
  background: white; font-family: inherit; outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
`;

const Select = styled.select`
  height: 40px; padding: 0 12px; border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px; color: ${({ theme }) => theme.colors.adminTextDark};
  background: white; font-family: inherit; outline: none; cursor: pointer;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
`;

const Textarea = styled.textarea`
  padding: 10px 12px; border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px; color: ${({ theme }) => theme.colors.adminTextDark};
  background: white; font-family: inherit; outline: none; resize: vertical; line-height: 1.6;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
`;

const ErrorMsg = styled.p`font-size: 12px; color: #ef4444;`;

const AddressRow = styled.div`display: flex; gap: 8px;`;

const AddressInput = styled.input`
  flex: 1; height: 40px; padding: 0 12px; border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px; color: ${({ theme }) => theme.colors.adminTextDark};
  background: ${({ theme }) => theme.colors.bgSection};
  font-family: inherit; outline: none; cursor: default;
  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
`;

const SearchBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  height: 40px; padding: 0 16px; border-radius: 8px;
  background: ${ACCENT}; color: white;
  font-size: 13px; font-weight: 600; font-family: inherit;
  white-space: nowrap; cursor: pointer; flex-shrink: 0;
  transition: background 0.15s;
  &:hover { background: #31b08e; }
`;

const MapWrap = styled.div`
  position: relative; border-radius: 10px; overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MapDiv = styled.div`width: 100%; height: 280px;`;

const CoordBadge = styled.div`
  position: absolute; bottom: 10px; left: 10px;
  display: flex; align-items: center; gap: 5px;
  background: rgba(0,0,0,0.65); color: white;
  font-size: 12px; font-family: monospace;
  padding: 5px 10px; border-radius: 6px;
`;

const MapPlaceholder = styled.div`
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};
  background: rgba(248,250,252,0.85); pointer-events: none;
`;
