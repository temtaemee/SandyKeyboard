import { useState, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ACCENT = '#3ec9a7';
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * events: Array<{
 *   date: 'YYYY-MM-DD',
 *   label: string,
 *   color?: string,
 *   bg?: string,
 *   cancelled?: boolean,           // 취소선 표시 여부
 *   tooltip?: {                    // 호버 툴팁 내용 (선택)
 *     id?, name?, stay?, space?,
 *     checkin?, checkout?, amount?, status?
 *   }
 * }>
 * onDayClick: (dateStr, eventsOnDay) => void
 */
export default function SellerCalendar({ events = [], onDayClick }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // 해당 월 날짜 계산
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);
  const pad = (n) => String(n).padStart(2, '0');

  // events를 date 키로 그룹핑
  const eventMap = events.reduce((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  const cells = [];
  // 앞쪽 빈칸
  for (let i = 0; i < firstDay; i++) cells.push(null);
  // 날짜
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const [selectedDay, setSelectedDay] = useState(null);
  const [tipPos, setTipPos] = useState(null);   // { x, y, ev }
  const tipRef = useRef(null);

  const handleDayClick = (d) => {
    if (!d) return;
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    const dayEvents = eventMap[dateStr] ?? [];
    setSelectedDay(dateStr === selectedDay ? null : dateStr);
    onDayClick?.(dateStr, dayEvents);
  };

  return (
    <>
    {tipPos && tipPos.ev?.tooltip && (
      <Tooltip ref={tipRef} style={{ left: tipPos.x, top: tipPos.y, transform: 'translateY(-100%)' }}>
        {tipPos.ev.tooltip.id    && <TRow><TKey>#</TKey><TVal>{tipPos.ev.tooltip.id}</TVal></TRow>}
        {tipPos.ev.tooltip.name  && <TRow><TKey>예약자</TKey><TVal>{tipPos.ev.tooltip.name}</TVal></TRow>}
        {tipPos.ev.tooltip.space && <TRow><TKey>공간</TKey><TVal>{tipPos.ev.tooltip.space}</TVal></TRow>}
        {tipPos.ev.tooltip.stay  && <TRow><TKey>숙소</TKey><TVal>{tipPos.ev.tooltip.stay}</TVal></TRow>}
        {tipPos.ev.tooltip.checkin   && <TRow><TKey>체크인</TKey><TVal>{tipPos.ev.tooltip.checkin}</TVal></TRow>}
        {tipPos.ev.tooltip.checkout  && <TRow><TKey>체크아웃</TKey><TVal>{tipPos.ev.tooltip.checkout}</TVal></TRow>}
        {tipPos.ev.tooltip.amount && <TRow><TKey>금액</TKey><TVal>{Number(tipPos.ev.tooltip.amount).toLocaleString()}원</TVal></TRow>}
        {tipPos.ev.tooltip.status && <TRow><TKey>상태</TKey><TVal $color={tipPos.ev.color}>{tipPos.ev.tooltip.status}</TVal></TRow>}
      </Tooltip>
    )}
    <Wrap>
      {/* 네비게이션 */}
      <NavRow>
        <NavBtn onClick={prevMonth}><ChevronLeft size={16} /></NavBtn>
        <MonthLabel>{year}년 {month + 1}월</MonthLabel>
        <NavBtn onClick={nextMonth}><ChevronRight size={16} /></NavBtn>
        <TodayBtn
          onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
          $isCurrentMonth={year === today.getFullYear() && month === today.getMonth()}
        >
          오늘
        </TodayBtn>
      </NavRow>

      {/* 요일 헤더 */}
      <Grid>
        {DAYS.map((d, i) => (
          <DayHeader key={d} $sun={i === 0} $sat={i === 6}>{d}</DayHeader>
        ))}

        {/* 날짜 셀 */}
        {cells.map((d, i) => {
          if (!d) return <EmptyCell key={`e-${i}`} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const dayEvents = eventMap[dateStr] ?? [];
          const isToday = dateStr === todayStr;
          const isSel = dateStr === selectedDay;
          const dow = (firstDay + d - 1) % 7;
          return (
            <DayCell
              key={dateStr}
              $today={isToday}
              $selected={isSel}
              $sun={dow === 0}
              $sat={dow === 6}
              $hasEvents={dayEvents.length > 0}
              onClick={() => handleDayClick(d)}
            >
              <DayNum $today={isToday}>{d}</DayNum>
              <EventList>
                {dayEvents.slice(0, 3).map((ev, idx) => (
                  <ChipWrap
                    key={idx}
                    onMouseEnter={(e) => {
                      if (!ev.tooltip) return;
                      const r = e.currentTarget.getBoundingClientRect();
                      setTipPos({ x: r.left, y: r.top - 8, ev });
                    }}
                    onMouseLeave={() => setTipPos(null)}
                  >
                    <EventChip $color={ev.color} $bg={ev.bg} $cancelled={ev.cancelled}>
                      {ev.label}
                    </EventChip>
                  </ChipWrap>
                ))}
                {dayEvents.length > 3 && (
                  <MoreChip>+{dayEvents.length - 3}</MoreChip>
                )}
              </EventList>
            </DayCell>
          );
        })}
      </Grid>
    </Wrap>
    </>
  );
}

/* ── Styled ── */

const Wrap = styled.div`
  background: white;
  border-radius: 10px;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f1f5f9;
`;

const NavBtn = styled.button`
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
`;

const TodayBtn = styled.button`
  height: 28px;
  padding: 0 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: ${({ $isCurrentMonth }) => $isCurrentMonth ? 'default' : 'pointer'};
  border: 1px solid ${({ $isCurrentMonth }) => $isCurrentMonth ? '#e2e8f0' : ACCENT};
  background: ${({ $isCurrentMonth }) => $isCurrentMonth ? '#f8fafc' : ACCENT};
  color: ${({ $isCurrentMonth }) => $isCurrentMonth ? '#94a3b8' : 'white'};
  transition: all 0.15s;
  margin-left: 8px;
`;

const MonthLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayHeader = styled.div`
  padding: 8px 0;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $sun }) => $sun ? '#ef4444' : ({ $sat }) => $sat ? '#3b82f6' : '#94a3b8'};
  color: ${({ $sun, $sat }) => $sun ? '#ef4444' : $sat ? '#3b82f6' : '#94a3b8'};
  border-bottom: 1px solid #f1f5f9;
  letter-spacing: 0.4px;
`;

const EmptyCell = styled.div`
  min-height: 90px;
  border-right: 1px solid #f8fafc;
  border-bottom: 1px solid #f8fafc;
  background: #fafafa;
`;

const DayCell = styled.div`
  min-height: 90px;
  padding: 6px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  cursor: ${({ $hasEvents }) => $hasEvents ? 'pointer' : 'default'};
  background: ${({ $selected }) => $selected ? '#f0fdf9' : 'white'};
  outline: ${({ $selected }) => $selected ? `2px solid ${ACCENT}` : 'none'};
  outline-offset: -2px;
  transition: background 0.1s;
  &:hover {
    background: ${({ $hasEvents }) => $hasEvents ? '#f0fdf9' : 'white'};
  }
`;

const DayNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px; height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: ${({ $today }) => $today ? '700' : '500'};
  background: ${({ $today }) => $today ? ACCENT : 'transparent'};
  color: ${({ $today }) => $today ? 'white' : '#334155'};
  margin-bottom: 4px;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ChipWrap = styled.div`
  position: relative;
`;

const EventChip = styled.div`
  font-size: 10px;
  font-weight: 500;
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ $bg }) => $bg ?? '#f1f5f9'};
  color: ${({ $color }) => $color ?? '#475569'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-decoration: ${({ $cancelled }) => $cancelled ? 'line-through' : 'none'};
  opacity: ${({ $cancelled }) => $cancelled ? 0.7 : 1};
  cursor: pointer;
`;

const Tooltip = styled.div`
  position: fixed;
  z-index: 9999;
  background: #1e293b;
  color: white;
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 210px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  pointer-events: none;
`;

const TRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 2px 0;
  font-size: 11px;
  line-height: 1.5;
`;

const TKey = styled.span`
  color: #94a3b8;
  min-width: 52px;
  flex-shrink: 0;
`;

const TVal = styled.span`
  color: ${({ $color }) => $color ?? 'white'};
  font-weight: 500;
  word-break: break-all;
`;

const MoreChip = styled.div`
  font-size: 10px;
  color: #94a3b8;
  padding: 1px 5px;
`;
