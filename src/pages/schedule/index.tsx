import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useScheduleList } from '@/domain/schedule/schedule-query-options';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';
import { css, cx } from '@/lib/css';
import { colors } from '@/lib/tokens';

interface ScheduleEvent {
  id: string | number;
  title: string;
  date: string;
  endDate?: string;
  type: '클래스' | '내부행사';
  archiveId: string | number | null;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const TYPE_COLOR: Record<ScheduleEvent['type'], string> = {
  클래스: colors.brand,
  내부행사: '#a78bfa',
};

// ─── Styles ──────────────────────────────────────────────────────
const pageCss = css({
  paddingTop: '128px',
  paddingBottom: '96px',
  paddingInline: '24px',
  maxWidth: '72rem',
  marginInline: 'auto',
  '@md': { paddingInline: '48px' },
});

const layoutCss = css({
  display: 'grid',
  gap: '32px',
  '@lg': { gridTemplateColumns: '1fr 320px' },
});

// ── Calendar ──
const calendarCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: '1.25rem',
  overflow: 'hidden',
});

const calHeaderCss = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: `1px solid ${colors.borderLight}`,
});

const calTitleCss = css({
  fontSize: '18px',
  fontWeight: '900',
  color: colors.textPrimary,
  letterSpacing: '0.02em',
});

const navBtnCss = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '9999px',
  border: `1px solid ${colors.borderLight}`,
  background: 'none',
  color: colors.textMuted,
  cursor: 'pointer',
  transition: 'all 0.15s',
  _hover: { borderColor: colors.brand, color: colors.brand },
});

const dayHeaderRowCss = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  borderBottom: `1px solid ${colors.borderLight}`,
});

const dayLabelCss = css({
  textAlign: 'center',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.05em',
  paddingBlock: '10px',
  color: colors.textDimmer,
});

const gridCss = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
});

const cellCss = css({
  minHeight: '80px',
  padding: '6px',
  borderRight: `1px solid ${colors.borderFaint}`,
  borderBottom: `1px solid ${colors.borderFaint}`,
  position: 'relative',
  _last: { borderRight: 'none' },
});

const cellOutsideCss = css({ opacity: '0.25' });

const dateNumCss = css({
  fontSize: '11px',
  fontWeight: '700',
  color: colors.textDimmer,
  marginBottom: '4px',
  lineHeight: '1',
});

const dateNumTodayCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  borderRadius: '9999px',
  backgroundColor: colors.brand,
  color: colors.bgPage,
  fontSize: '11px',
  fontWeight: '900',
});

const eventChipCss = css({
  display: 'block',
  fontSize: '10px',
  fontWeight: '700',
  paddingInline: '6px',
  paddingBlock: '2px',
  borderRadius: '4px',
  marginBottom: '2px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'opacity 0.15s',
  _hover: { opacity: '0.8' },
});

// ── Sidebar ──
const sidebarCss = css({ display: 'flex', flexDirection: 'column', gap: '16px' });

const legendCss = css({
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: '1rem',
  padding: '16px 20px',
});

const legendItemCss = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  fontWeight: '700',
  color: colors.textMuted,
});

const legendDotCss = css({
  width: '10px',
  height: '10px',
  borderRadius: '3px',
  flexShrink: '0',
});

const listCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: '1rem',
  overflow: 'hidden',
  flex: '1',
});

const listHeaderCss = css({
  padding: '16px 20px',
  borderBottom: `1px solid ${colors.borderLight}`,
  fontSize: '13px',
  fontWeight: '900',
  color: colors.textMuted,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
});

const listItemCss = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  paddingInline: '20px',
  paddingBlock: '14px',
  borderBottom: `1px solid ${colors.borderFaint}`,
  _last: { borderBottom: 'none' },
});

const listItemLinkCss = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  paddingInline: '20px',
  paddingBlock: '14px',
  borderBottom: `1px solid ${colors.borderFaint}`,
  textDecoration: 'none',
  transition: 'background-color 0.15s',
  _hover: { backgroundColor: 'rgba(245,158,11,0.05)' },
  _last: { borderBottom: 'none' },
});

const listDotCss = css({
  width: '8px',
  height: '8px',
  borderRadius: '3px',
  flexShrink: '0',
  marginTop: '4px',
});

const listTitleCss = css({ fontSize: '13px', fontWeight: '700', color: colors.textPrimary, lineHeight: '1.4' });
const listDateCss = css({ fontSize: '11px', color: colors.textFaint, marginTop: '2px' });
const listLinkIconCss = css({ color: colors.brand, flexShrink: '0', marginTop: '2px' });

const emptyListCss = css({ padding: '32px 20px', textAlign: 'center', fontSize: '13px', color: colors.textFaint });

// ─── Helpers ─────────────────────────────────────────────────────
function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function dateFromStr(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isInRange(date: Date, event: ScheduleEvent): boolean {
  if (!event.endDate) return isSameDay(date, dateFromStr(event.date));
  const start = dateFromStr(event.date);
  const end = dateFromStr(event.endDate);
  return date >= start && date <= end;
}

function formatDate(str: string): string {
  const [y, m, d] = str.split('-').map(Number);
  return `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────
export default function SchedulePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const { data: scheduleData = [] } = useScheduleList();
  const events = scheduleData as ScheduleEvent[];

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // 달력 셀 계산
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=일
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    const result: { date: Date; outside: boolean }[] = [];
    // 이전 달 채우기
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ date: new Date(year, month - 1, prevDays - i), outside: true });
    }
    // 이번 달
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ date: new Date(year, month, d), outside: false });
    }
    // 다음 달 채우기 (6행 고정)
    const remaining = 42 - result.length;
    for (let d = 1; d <= remaining; d++) {
      result.push({ date: new Date(year, month + 1, d), outside: true });
    }
    return result;
  }, [year, month]);

  // 해당 월의 이벤트
  const monthEvents = useMemo(() => {
    return events.filter(ev => {
      const start = dateFromStr(ev.date);
      const end = ev.endDate ? dateFromStr(ev.endDate) : start;
      const mStart = new Date(year, month, 1);
      const mEnd = new Date(year, month + 1, 0);
      return start <= mEnd && end >= mStart;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [year, month, events]);

  // 셀별 이벤트
  const eventsForDate = (date: Date): ScheduleEvent[] =>
    events.filter(ev => isInRange(date, ev));

  return (
    <PageWrapper>
      <div className={pageCss}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionTitle
            title="Schedule"
            subtitle="코콕의 클래스 및 행사 일정을 확인하세요."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={layoutCss}
        >
          {/* ── 캘린더 ── */}
          <div className={calendarCss}>
            <div className={calHeaderCss}>
              <button className={navBtnCss} onClick={prevMonth} aria-label="이전 달">
                <ChevronLeft size={16} />
              </button>
              <span className={calTitleCss}>{formatMonthTitle(year, month)}</span>
              <button className={navBtnCss} onClick={nextMonth} aria-label="다음 달">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className={dayHeaderRowCss}>
              {DAY_LABELS.map(d => (
                <div key={d} className={dayLabelCss}
                  style={d === '일' ? { color: '#f87171' } : d === '토' ? { color: '#60a5fa' } : {}}>
                  {d}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${year}-${month}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className={gridCss}
              >
                {cells.map(({ date, outside }, idx) => {
                  const dayEvents = eventsForDate(date);
                  const today_ = isToday(date);
                  const dow = date.getDay();
                  return (
                    <div
                      key={idx}
                      className={cx(cellCss, outside ? cellOutsideCss : '')}
                    >
                      <div className={dateNumCss}>
                        {today_ ? (
                          <span className={dateNumTodayCss}>{date.getDate()}</span>
                        ) : (
                          <span style={dow === 0 ? { color: '#f87171' } : dow === 6 ? { color: '#60a5fa' } : {}}>
                            {date.getDate()}
                          </span>
                        )}
                      </div>
                      {dayEvents.map(ev => (
                        ev.archiveId ? (
                          <Link
                            key={ev.id}
                            to="/archive/$id"
                            params={{ id: String(ev.archiveId) }}
                            className={eventChipCss}
                            style={{
                              backgroundColor: `${TYPE_COLOR[ev.type]}22`,
                              color: TYPE_COLOR[ev.type],
                            }}
                          >
                            {ev.title}
                          </Link>
                        ) : (
                          <span
                            key={ev.id}
                            className={eventChipCss}
                            style={{
                              backgroundColor: `${TYPE_COLOR[ev.type]}22`,
                              color: TYPE_COLOR[ev.type],
                              cursor: 'default',
                            }}
                          >
                            {ev.title}
                          </span>
                        )
                      ))}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── 사이드바 ── */}
          <div className={sidebarCss}>
            {/* 범례 */}
            <div className={legendCss}>
              {(Object.entries(TYPE_COLOR) as [ScheduleEvent['type'], string][]).map(([type, color]) => (
                <div key={type} className={legendItemCss}>
                  <span className={legendDotCss} style={{ backgroundColor: color }} />
                  {type}
                </div>
              ))}
            </div>

            {/* 이번 달 일정 목록 */}
            <div className={listCardCss}>
              <div className={listHeaderCss}>
                <CalendarDays size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                {formatMonthTitle(year, month)} 일정
              </div>
              {monthEvents.length === 0 ? (
                <div className={emptyListCss}>이번 달 일정이 없습니다.</div>
              ) : (
                monthEvents.map(ev => {
                  const inner = (
                    <>
                      <span className={listDotCss} style={{ backgroundColor: TYPE_COLOR[ev.type] }} />
                      <div>
                        <div className={listTitleCss}>{ev.title}</div>
                        <div className={listDateCss}>
                          {formatDate(ev.date)}{ev.endDate ? ` → ${formatDate(ev.endDate)}` : ''}
                        </div>
                      </div>
                      {ev.archiveId && <ExternalLink size={12} className={listLinkIconCss} style={{ marginLeft: 'auto' }} />}
                    </>
                  );
                  return ev.archiveId ? (
                    <Link
                      key={ev.id}
                      to="/archive/$id"
                      params={{ id: String(ev.archiveId) }}
                      className={listItemLinkCss}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={ev.id} className={listItemCss}>{inner}</div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
