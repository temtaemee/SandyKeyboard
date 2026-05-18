import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { spaceProductApi, stayApi, officeApi } from '../api/productApi';

/* ── Constants ── */

const AREA_OPTIONS = [
  { value: 'soeul', label: '서울' }, { value: 'gyeonggi', label: '경기' },
  { value: 'gangwon', label: '강원' }, { value: 'chungnam', label: '충남' },
  { value: 'chungbuk', label: '충북' }, { value: 'gyeongnam', label: '경남' },
  { value: 'gyeongbuk', label: '경북' }, { value: 'jeonnam', label: '전남' },
  { value: 'jeonbuk', label: '전북' }, { value: 'jeju', label: '제주' },
];

const STAY_OPTIONS = [
  'DESK', 'PRIVATE_BATHROOM', 'BATHTUB', 'SHOWER_BOOTH', 'BIDET', 'AMENITY',
  'KITCHEN', 'COOKING_AVAILABLE', 'MICROWAVE', 'INDUCTION', 'REFRIGERATOR',
  'TABLEWARE', 'COFFEE_MACHINE', 'OCEAN_VIEW', 'CITY_VIEW', 'MOUNTAIN_VIEW',
  'GARDEN_VIEW', 'RIVER_VIEW',
];

const OFFICE_OPTIONS = [
  { value: 'POWER_STRIP',          label: '멀티탭' },
  { value: 'MONITOR_PROVIDED',     label: '모니터 제공' },
  { value: 'STANDING_DESK',        label: '스탠딩 데스크' },
  { value: 'ERGONOMIC_CHAIR',      label: '인체공학 의자' },
  { value: 'WIRED_INTERNET',       label: '유선 인터넷' },
  { value: 'WIFI',                 label: '무선 인터넷(WiFi)' },
  { value: 'PRINTER',              label: '프린터' },
  { value: 'SCANNER',              label: '스캐너' },
  { value: 'MULTIFUNCTION_PRINTER',label: '복합기' },
  { value: 'PROJECTOR',            label: '프로젝터' },
  { value: 'WHITEBOARD',           label: '화이트보드' },
  { value: 'TV_SCREEN',            label: 'TV/스크린' },
  { value: 'VIDEO_CONFERENCE',     label: '화상회의 장비' },
  { value: 'COFFEE_MACHINE',       label: '커피머신' },
  { value: 'WATER_PURIFIER',       label: '정수기' },
  { value: 'REFRIGERATOR',         label: '냉장고' },
  { value: 'MICROWAVE',            label: '전자레인지' },
  { value: 'SHARED_KITCHEN',       label: '공용 주방' },
  { value: 'RECEPTION',            label: '리셉션' },
  { value: 'MAIL_SERVICE',         label: '우편/택배 수령' },
  { value: 'LOCKER',               label: '개인 사물함' },
  { value: 'PARKING',              label: '주차' },
  { value: 'SHOWER',               label: '샤워실' },
  { value: 'LOUNGE',               label: '휴게공간' },
];

const OFFICE_TYPES = [
  { value: 'ASSIGNED_SEAT',     label: '지정석' },
  { value: 'PRIVATE_ROOM',      label: '프라이빗 룸' },
  { value: 'LOUNGE_SEAT',       label: '라운지석' },
  { value: 'POWER_STRIP',       label: '멀티탭' },
  { value: 'PRINTER',           label: '프린터' },
  { value: 'WIRED_INTERNET',    label: '유선 인터넷' },
  { value: 'MONITOR_PROVIDED',  label: '모니터 제공' },
  { value: 'MEETING_ROOM',      label: '미팅룸' },
  { value: 'CONFERENCE_ROOM',   label: '컨퍼런스룸' },
  { value: 'SEMINAR_ROOM',      label: '세미나룸' },
  { value: 'BOARD_ROOM',        label: '보드룸' },
  { value: 'BRAINSTORMING_ROOM',label: '브레인스토밍룸' },
  { value: 'INTERVIEW_ROOM',    label: '인터뷰룸' },
  { value: 'TRAINING_ROOM',     label: '교육실' },
  { value: 'WORKSHOP_ROOM',     label: '워크샵룸' },
  { value: 'BALLROOM',          label: '볼룸' },
  { value: 'BANQUET_HALL',      label: '연회장' },
  { value: 'CONVENTION_HALL',   label: '컨벤션홀' },
  { value: 'EVENT_HALL',        label: '이벤트홀' },
  { value: 'GRAND_HALL',        label: '그랜드홀' },
  { value: 'MULTI_HALL',        label: '멀티홀' },
];

const DOMAINS = [
  { key: 'space', label: 'Space (공간)', api: spaceProductApi },
  { key: 'stay',  label: 'Stay (숙소)',  api: stayApi },
  { key: 'office',label: 'Office (오피스)', api: officeApi },
];

const INIT = {
  space: {
    name: '', phone: '', email: '', summary: '', description: '',
    address1: '', address2: '', latitude: '', longitude: '', area: 'jeju',
  },
  stay: {
    spaceId: '', name: '', summary: '', description: '',
    capacity: 2, maxCapa: 4,
    checkInTime: '15:00', checkOutTime: '11:00',
    monPrice: 0, tuePrice: 0, wedPrice: 0, thuPrice: 0,
    friPrice: 0, satPrice: 0, sunPrice: 0, holidayPrice: 0,
    optionList: [],
  },
  office: {
    spaceId: '', name: '', summary: '', description: '',
    capacity: 1, maxCapa: 10,
    timePrice: 0, officeType: 'ASSIGNED_SEAT',
    optionList: [],
  },
};

const NUM_FIELDS = [
  'capacity', 'maxCapa', 'monPrice', 'tuePrice', 'wedPrice', 'thuPrice',
  'friPrice', 'satPrice', 'sunPrice', 'holidayPrice', 'timePrice', 'spaceId',
];

const prepareDto = (domain, form) => {
  const dto = { ...form };
  NUM_FIELDS.forEach((k) => { if (dto[k] !== undefined && dto[k] !== '') dto[k] = Number(dto[k]); });
  if (domain === 'space') {
    if (dto.latitude !== '' && dto.latitude !== undefined) dto.latitude = Number(dto.latitude);
    else delete dto.latitude;
    if (dto.longitude !== '' && dto.longitude !== undefined) dto.longitude = Number(dto.longitude);
    else delete dto.longitude;
  }
  // Stay: time은 "HH:mm" → "HH:mm:ss"
  if (domain === 'stay') {
    if (dto.checkInTime?.length === 5)  dto.checkInTime  += ':00';
    if (dto.checkOutTime?.length === 5) dto.checkOutTime += ':00';
  }
  return dto;
};

const itemToForm = (domain, item) => {
  if (domain === 'space') {
    return {
      name: item.name ?? '', phone: item.phone ?? '', email: item.email ?? '',
      summary: item.summary ?? '', description: item.description ?? '',
      address1: item.address1 ?? '', address2: item.address2 ?? '',
      latitude: item.latitude ?? '', longitude: item.longitude ?? '',
      area: item.area ?? 'jeju',
    };
  }
  if (domain === 'stay') {
    // checkInTime이 배열([H,m,s])로 오는 경우도 처리
    const toTimeStr = (v) => {
      if (!v) return '';
      if (Array.isArray(v)) return `${String(v[0]).padStart(2,'0')}:${String(v[1]).padStart(2,'0')}`;
      return String(v).slice(0, 5);
    };
    return {
      spaceId: item.spaceId ?? '', name: item.name ?? '',
      summary: item.summary ?? '', description: item.description ?? '',
      capacity: item.capacity ?? 2, maxCapa: item.maxCapa ?? 4,
      checkInTime:  toTimeStr(item.checkInTime),
      checkOutTime: toTimeStr(item.checkOutTime),
      monPrice: item.monPrice ?? 0, tuePrice: item.tuePrice ?? 0,
      wedPrice: item.wedPrice ?? 0, thuPrice: item.thuPrice ?? 0,
      friPrice: item.friPrice ?? 0, satPrice: item.satPrice ?? 0,
      sunPrice: item.sunPrice ?? 0, holidayPrice: item.holidayPrice ?? 0,
      optionList: item.options ?? [],
    };
  }
  return {
    spaceId: item.spaceId ?? '', name: item.name ?? '',
    summary: item.summary ?? '', description: item.description ?? '',
    capacity: item.capacity ?? 1, maxCapa: item.maxCapa ?? 10,
    timePrice: item.timePrice ?? 0, officeType: item.officeType ?? 'ASSIGNED_SEAT',
    optionList: item.options ?? [],
  };
};

/* ── Page ── */

export default function ProductCrudPage() {
  const [domain, setDomain]       = useState('space');
  const [items, setItems]         = useState([]);
  const [spaces, setSpaces]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm]           = useState(INIT.space);
  const [files, setFiles]         = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]             = useState(null);

  const currentApi = DOMAINS.find((d) => d.key === domain).api;

  // 공간 목록은 Stay/Office spaceId 드롭다운용으로 항상 로드
  useEffect(() => {
    spaceProductApi.getAll()
      .then((res) => setSpaces(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await currentApi.getAll();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('목록 조회 실패');
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    setSelectedId(null);
    setForm(INIT[domain]);
    setFiles([]);
    setMsg(null);
    fetchItems();
  }, [domain]);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setForm(itemToForm(domain, item));
    setFiles([]);
    setMsg(null);
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(INIT[domain]);
    setFiles([]);
    setMsg(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'optionList') {
      setForm((prev) => ({
        ...prev,
        optionList: checked
          ? [...prev.optionList, value]
          : prev.optionList.filter((o) => o !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBatchChange = (updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setMsg(null);
    try {
      const dto = prepareDto(domain, form);
      if (selectedId) {
        if (domain === 'stay' || domain === 'office') delete dto.spaceId;
        await currentApi.update(selectedId, dto);
        setMsg({ type: 'ok', text: '수정 완료!' });
      } else {
        await currentApi.create(dto, files);
        setMsg({ type: 'ok', text: '등록 완료!' });
        setForm(INIT[domain]);
        setFiles([]);
      }
      await fetchItems();
      if (domain === 'space') {
        spaceProductApi.getAll().then((r) => setSpaces(Array.isArray(r.data) ? r.data : []));
      }
    } catch (err) {
      const text = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.reason
        || '요청 실패';
      setMsg({ type: 'err', text });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await currentApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedId === id) handleNew();
    } catch { alert('삭제 실패'); }
  };

  const handleVisible = async (id, current, e) => {
    e.stopPropagation();
    try {
      await currentApi.changeVisible(id, current === 'Y' ? 'N' : 'Y');
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, visibleYn: i.visibleYn === 'Y' ? 'N' : 'Y' } : i));
    } catch { alert('노출 변경 실패'); }
  };

  return (
    <Page>
      <TopBar>
        <PageTitle>Product CRUD</PageTitle>
        <DomainTabs>
          {DOMAINS.map((d) => (
            <DomainTab key={d.key} $active={domain === d.key} onClick={() => setDomain(d.key)}>
              {d.label}
            </DomainTab>
          ))}
        </DomainTabs>
      </TopBar>

      <Layout>
        {/* 목록 */}
        <ListPanel>
          <PanelHead>
            <PanelTitle>목록 ({items.length})</PanelTitle>
            <SmallBtn onClick={handleNew}>+ 신규</SmallBtn>
          </PanelHead>
          {loading ? <Notice>로딩 중…</Notice>
            : error ? <Notice $err>{error} <Retry onClick={fetchItems}>재시도</Retry></Notice>
            : items.length === 0 ? <Notice>데이터 없음</Notice>
            : (
              <ItemList>
                {items.map((item) => (
                  <ItemRow key={item.id} $active={selectedId === item.id} onClick={() => handleSelect(item)}>
                    <ItemMeta>
                      <ItemId>#{item.id}</ItemId>
                      <ItemName>{item.name}</ItemName>
                    </ItemMeta>
                    <ItemRight>
                      {item.visibleYn !== undefined && (
                        <Badge $yn={item.visibleYn}>{item.visibleYn === 'Y' ? '노출' : '숨김'}</Badge>
                      )}
                      <BtnGroup>
                        {(domain === 'stay' || domain === 'office') && (
                          <MiniBtn
                            $color={item.visibleYn === 'Y' ? '#f6993f' : '#38a169'}
                            onClick={(e) => handleVisible(item.id, item.visibleYn, e)}
                          >
                            {item.visibleYn === 'Y' ? '숨김' : '노출'}
                          </MiniBtn>
                        )}
                        <MiniBtn $color="#e53e3e" onClick={(e) => handleDelete(item.id, e)}>삭제</MiniBtn>
                      </BtnGroup>
                    </ItemRight>
                  </ItemRow>
                ))}
              </ItemList>
            )}
        </ListPanel>

        {/* 폼 */}
        <FormPanel>
          <PanelHead>
            <PanelTitle>
              {selectedId
                ? `수정 — #${selectedId}`
                : `새 ${DOMAINS.find((d) => d.key === domain).label} 등록`}
            </PanelTitle>
          </PanelHead>
          {msg && <MsgBar $err={msg.type === 'err'}>{msg.text}</MsgBar>}
          <Form onSubmit={handleSubmit}>
            {domain === 'space' && <SpaceFields form={form} onChange={handleChange} />}
            {domain === 'stay'  && (
              <StayFields
                form={form}
                onChange={handleChange}
                onBatchChange={handleBatchChange}
                isEdit={!!selectedId}
                spaces={spaces}
              />
            )}
            {domain === 'office' && (
              <OfficeFields
                form={form}
                onChange={handleChange}
                isEdit={!!selectedId}
                spaces={spaces}
              />
            )}

            {!selectedId && (
              <FormGroup>
                <Label>이미지 파일 <Hint>(선택 · 첫 번째가 대표)</Hint></Label>
                <FileInput type="file" multiple accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files))} />
                {files.length > 0 && <FileHint>{files.length}개 선택됨</FileHint>}
              </FormGroup>
            )}

            <Footer>
              {selectedId && <CancelBtn type="button" onClick={handleNew}>취소</CancelBtn>}
              <SubmitBtn type="submit" disabled={submitting}>
                {submitting ? '처리 중…' : selectedId ? '수정 저장' : '등록'}
              </SubmitBtn>
            </Footer>
          </Form>
        </FormPanel>
      </Layout>
    </Page>
  );
}

/* ── Sub-forms ── */

function SpaceFields({ form, onChange }) {
  return (
    <>
      <Row2>
        <FormGroup>
          <Label>공간명 *</Label>
          <Input name="name" value={form.name} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>전화번호 * <Hint>(숫자만·12자 이내)</Hint></Label>
          <Input name="phone" value={form.phone} onChange={onChange} maxLength={12} required />
        </FormGroup>
      </Row2>
      <FormGroup>
        <Label>이메일 *</Label>
        <Input name="email" type="email" value={form.email} onChange={onChange} required />
      </FormGroup>
      <FormGroup>
        <Label>한줄 소개 *</Label>
        <Input name="summary" value={form.summary} onChange={onChange} required />
      </FormGroup>
      <FormGroup>
        <Label>상세 설명 *</Label>
        <Textarea name="description" value={form.description} onChange={onChange} rows={4} required />
      </FormGroup>
      <FormGroup>
        <Label>기본 주소 *</Label>
        <Input name="address1" value={form.address1} onChange={onChange} required />
      </FormGroup>
      <Row2>
        <FormGroup>
          <Label>상세 주소 *</Label>
          <Input name="address2" value={form.address2} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>지역 *</Label>
          <Select name="area" value={form.area} onChange={onChange} required>
            {AREA_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </Select>
        </FormGroup>
      </Row2>
      <Row2>
        <FormGroup>
          <Label>위도 <Hint>(선택)</Hint></Label>
          <Input name="latitude" type="number" step="any" value={form.latitude} onChange={onChange} />
        </FormGroup>
        <FormGroup>
          <Label>경도 <Hint>(선택)</Hint></Label>
          <Input name="longitude" type="number" step="any" value={form.longitude} onChange={onChange} />
        </FormGroup>
      </Row2>
    </>
  );
}

function StayFields({ form, onChange, onBatchChange, isEdit, spaces }) {
  const [priceMode, setPriceMode] = useState('simple');

  const handleWeekday = (e) => {
    const v = Number(e.target.value);
    onBatchChange({ monPrice: v, tuePrice: v, wedPrice: v, thuPrice: v, friPrice: v });
  };

  const weekdayVal = form.monPrice === form.tuePrice &&
    form.tuePrice === form.wedPrice &&
    form.wedPrice === form.thuPrice &&
    form.thuPrice === form.friPrice
    ? form.monPrice : '';

  return (
    <>
      {!isEdit && (
        <FormGroup>
          <Label>공간 선택 * <Hint>(Space)</Hint></Label>
          <Select name="spaceId" value={form.spaceId} onChange={onChange} required>
            <option value="">— 공간 선택 —</option>
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>#{s.id} {s.name}</option>
            ))}
          </Select>
        </FormGroup>
      )}
      <FormGroup>
        <Label>숙소명 *</Label>
        <Input name="name" value={form.name} onChange={onChange} required />
      </FormGroup>
      <FormGroup>
        <Label>한줄 소개 *</Label>
        <Input name="summary" value={form.summary} onChange={onChange} required />
      </FormGroup>
      <FormGroup>
        <Label>상세 설명 *</Label>
        <Textarea name="description" value={form.description} onChange={onChange} rows={3} required />
      </FormGroup>
      <Row2>
        <FormGroup>
          <Label>기본 인원 *</Label>
          <Input name="capacity" type="number" min={1} value={form.capacity} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>최대 인원 *</Label>
          <Input name="maxCapa" type="number" min={1} value={form.maxCapa} onChange={onChange} required />
        </FormGroup>
      </Row2>
      <Row2>
        <FormGroup>
          <Label>입실 시간 * <Hint>(체크인 기준시간)</Hint></Label>
          <Input name="checkInTime" type="time" value={form.checkInTime} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>퇴실 시간 * <Hint>(체크아웃 기준시간)</Hint></Label>
          <Input name="checkOutTime" type="time" value={form.checkOutTime} onChange={onChange} required />
        </FormGroup>
      </Row2>

      {/* 요일별 단가 */}
      <SectionRow>
        <SectionTitle>요일별 단가 (원)</SectionTitle>
        <ModeToggle>
          <ModeBtn $active={priceMode === 'simple'} onClick={() => setPriceMode('simple')} type="button">
            간편입력
          </ModeBtn>
          <ModeBtn $active={priceMode === 'advanced'} onClick={() => setPriceMode('advanced')} type="button">
            요일별
          </ModeBtn>
        </ModeToggle>
      </SectionRow>

      {priceMode === 'simple' ? (
        <PriceGrid3>
          <FormGroup>
            <Label>평일 (월~금)</Label>
            <Input
              type="number" min={0}
              value={weekdayVal}
              onChange={handleWeekday}
              placeholder="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>토요일</Label>
            <Input name="satPrice" type="number" min={0} value={form.satPrice} onChange={onChange} required />
          </FormGroup>
          <FormGroup>
            <Label>일요일</Label>
            <Input name="sunPrice" type="number" min={0} value={form.sunPrice} onChange={onChange} required />
          </FormGroup>
          <FormGroup>
            <Label>공휴일</Label>
            <Input name="holidayPrice" type="number" min={0} value={form.holidayPrice} onChange={onChange} required />
          </FormGroup>
        </PriceGrid3>
      ) : (
        <PriceGrid>
          {[
            ['monPrice','월'],['tuePrice','화'],['wedPrice','수'],['thuPrice','목'],
            ['friPrice','금'],['satPrice','토'],['sunPrice','일'],['holidayPrice','공휴일'],
          ].map(([key, lbl]) => (
            <FormGroup key={key}>
              <Label>{lbl}</Label>
              <Input name={key} type="number" min={0} value={form[key]} onChange={onChange} required />
            </FormGroup>
          ))}
        </PriceGrid>
      )}

      <SectionTitle>옵션 <Hint>(선택)</Hint></SectionTitle>
      <CheckGrid>
        {STAY_OPTIONS.map((opt) => (
          <CheckItem key={opt}>
            <input
              type="checkbox" id={`opt-${opt}`}
              name="optionList" value={opt}
              checked={(form.optionList ?? []).includes(opt)}
              onChange={onChange}
            />
            <label htmlFor={`opt-${opt}`}>{opt}</label>
          </CheckItem>
        ))}
      </CheckGrid>
    </>
  );
}

function OfficeFields({ form, onChange, isEdit, spaces }) {
  return (
    <>
      {!isEdit && (
        <FormGroup>
          <Label>공간 선택 * <Hint>(Space)</Hint></Label>
          <Select name="spaceId" value={form.spaceId} onChange={onChange} required>
            <option value="">— 공간 선택 —</option>
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>#{s.id} {s.name}</option>
            ))}
          </Select>
        </FormGroup>
      )}
      <FormGroup>
        <Label>오피스명 *</Label>
        <Input name="name" value={form.name} onChange={onChange} required />
      </FormGroup>
      <FormGroup>
        <Label>한줄 소개 *</Label>
        <Input name="summary" value={form.summary} onChange={onChange} required />
      </FormGroup>
      <FormGroup>
        <Label>상세 설명 *</Label>
        <Textarea name="description" value={form.description} onChange={onChange} rows={3} required />
      </FormGroup>
      <Row2>
        <FormGroup>
          <Label>기본 인원 *</Label>
          <Input name="capacity" type="number" min={1} value={form.capacity} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>최대 인원 *</Label>
          <Input name="maxCapa" type="number" min={1} value={form.maxCapa} onChange={onChange} required />
        </FormGroup>
      </Row2>
      <Row2>
        <FormGroup>
          <Label>시간당 단가 (원) *</Label>
          <Input name="timePrice" type="number" min={0} value={form.timePrice} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label>오피스 타입 *</Label>
          <Select name="officeType" value={form.officeType} onChange={onChange} required>
            {OFFICE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </FormGroup>
      </Row2>
      <SectionTitle>옵션 <Hint>(선택)</Hint></SectionTitle>
      <CheckGrid>
        {OFFICE_OPTIONS.map((opt) => (
          <CheckItem key={opt.value}>
            <input
              type="checkbox" id={`oopt-${opt.value}`}
              name="optionList" value={opt.value}
              checked={(form.optionList ?? []).includes(opt.value)}
              onChange={onChange}
            />
            <label htmlFor={`oopt-${opt.value}`}>{opt.label}</label>
          </CheckItem>
        ))}
      </CheckGrid>
    </>
  );
}

/* ── Styled Components ── */

const Page = styled.div`
  display: flex; flex-direction: column; gap: 20px;
  padding: 28px 32px; min-height: 100vh; background: #f7f9fb;
`;

const TopBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: 22px; font-weight: 700; color: #244c54;
`;

const DomainTabs = styled.div`
  display: flex; gap: 4px; background: #e2e8f0;
  padding: 4px; border-radius: 10px;
`;

const DomainTab = styled.button`
  padding: 7px 18px; border-radius: 7px; font-size: 13px; font-weight: 500;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active }) => ($active ? '#244c54' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#64748b')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 4px rgba(36,76,84,.25)' : 'none')};
  &:hover { background: ${({ $active }) => ($active ? '#1a3840' : '#cbd5e1')}; }
`;

const Layout = styled.div`
  display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

const Panel = styled.div`
  background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;
`;
const ListPanel = styled(Panel)``;
const FormPanel = styled(Panel)``;

const PanelHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid #f1f5f9;
`;

const PanelTitle = styled.h2`font-size: 14px; font-weight: 600; color: #1e293b;`;

const SmallBtn = styled.button`
  padding: 5px 12px; background: #3d646c; color: #fff;
  border-radius: 6px; font-size: 12px; font-weight: 500;
  &:hover { background: #244c54; }
`;

const Notice = styled.p`
  padding: 24px; font-size: 13px; text-align: center;
  color: ${({ $err }) => ($err ? '#e53e3e' : '#94a3b8')};
`;

const Retry = styled.span`cursor: pointer; text-decoration: underline; color: #3d646c;`;

const ItemList = styled.div`
  display: flex; flex-direction: column; max-height: 520px; overflow-y: auto;
`;

const ItemRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #f8fafc;
  background: ${({ $active }) => ($active ? '#f0f9ff' : 'transparent')};
  &:hover { background: ${({ $active }) => ($active ? '#e0f2fe' : '#f8fafc')}; }
`;

const ItemMeta = styled.div`display: flex; align-items: center; gap: 7px; overflow: hidden;`;
const ItemId   = styled.span`font-size: 11px; color: #94a3b8; flex-shrink: 0;`;
const ItemName = styled.span`
  font-size: 13px; font-weight: 500; color: #1e293b;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const ItemRight  = styled.div`display: flex; align-items: center; gap: 5px; flex-shrink: 0;`;
const BtnGroup   = styled.div`display: flex; gap: 3px;`;

const Badge = styled.span`
  font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px;
  background: ${({ $yn }) => ($yn === 'Y' ? '#dcfce7' : '#fee2e2')};
  color: ${({ $yn }) => ($yn === 'Y' ? '#15803d' : '#b91c1c')};
`;

const MiniBtn = styled.button`
  padding: 3px 7px; border-radius: 4px; font-size: 11px; font-weight: 500;
  background: ${({ $color }) => $color}; color: #fff; opacity: .85;
  &:hover { opacity: 1; }
`;

const MsgBar = styled.div`
  margin: 12px 18px 0; padding: 9px 13px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  background: ${({ $err }) => ($err ? '#fef2f2' : '#f0fdf4')};
  color: ${({ $err }) => ($err ? '#b91c1c' : '#15803d')};
  border: 1px solid ${({ $err }) => ($err ? '#fecaca' : '#bbf7d0')};
`;

const Form = styled.form`
  padding: 18px; display: flex; flex-direction: column; gap: 13px;
  max-height: 640px; overflow-y: auto;
`;

const FormGroup = styled.div`display: flex; flex-direction: column; gap: 5px;`;
const Row2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;

const Label = styled.label`font-size: 12px; font-weight: 600; color: #475569;`;
const Hint  = styled.span`font-weight: 400; color: #94a3b8;`;

const inputBase = `
  width: 100%; padding: 8px 11px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: #fff; outline: none;
  transition: border-color .15s;
  &:focus { border-color: #3d646c; }
`;
const Input    = styled.input`${inputBase}`;
const Select   = styled.select`${inputBase}`;
const Textarea = styled.textarea`${inputBase} resize: vertical; line-height: 1.5;`;

const SectionRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 4px; border-top: 1px solid #f1f5f9;
`;

const SectionTitle = styled.p`font-size: 12px; font-weight: 600; color: #475569;`;

const ModeToggle = styled.div`
  display: flex; gap: 2px; background: #f1f5f9; padding: 3px; border-radius: 7px;
`;

const ModeBtn = styled.button`
  padding: 3px 10px; border-radius: 5px; font-size: 11px; font-weight: 500;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#244c54' : '#94a3b8')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 2px rgba(0,0,0,.08)' : 'none')};
`;

const PriceGrid  = styled.div`display: grid; grid-template-columns: repeat(4,1fr); gap: 8px;`;
const PriceGrid3 = styled.div`display: grid; grid-template-columns: repeat(4,1fr); gap: 8px;`;

const CheckGrid = styled.div`display: grid; grid-template-columns: repeat(3,1fr); gap: 5px;`;

const CheckItem = styled.div`
  display: flex; align-items: center; gap: 5px;
  label { font-size: 11px; color: #475569; cursor: pointer; }
  input[type='checkbox'] { width: 13px; height: 13px; accent-color: #3d646c; cursor: pointer; }
`;

const FileInput = styled.input`font-size: 12px; color: #475569;`;
const FileHint  = styled.p`font-size: 11px; color: #3d646c;`;

const Footer = styled.div`
  display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px;
`;

const CancelBtn = styled.button`
  padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;
  color: #64748b; border: 1px solid #e2e8f0; background: #fff;
  &:hover { background: #f1f5f9; }
`;

const SubmitBtn = styled.button`
  padding: 8px 22px; border-radius: 8px; font-size: 13px; font-weight: 600;
  background: #244c54; color: #fff;
  &:hover:not(:disabled) { background: #1a3840; }
  &:disabled { opacity: .5; cursor: not-allowed; }
`;
