// 실행: npx tsx --test server/src/lib/dues.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addMonths,
  chargedMonthList,
  computeBalance,
  matchDepositor,
  monthBreakdown,
  monthsInclusive,
  reminderKind,
  todayInSeoul,
  type DuesMember,
} from './dues.js';

const rules = { monthlyFee: 40000, dueDay: 9 };

function member(over: Partial<DuesMember> = {}): DuesMember {
  return {
    id: 1,
    name: '홍길동',
    status: 'active',
    joinedMonth: '2026-09',
    stoppedMonth: '',
    monthlyFee: null,
    waivedAmount: 0,
    depositNames: [],
    ...over,
  };
}

test('한국 시간으로 날짜를 구한다 (UTC 15시는 한국의 다음 날 0시)', () => {
  const t = todayInSeoul(new Date('2026-10-31T15:00:00Z'));
  assert.deepEqual(t, { date: '2026-11-01', month: '2026-11', day: 1 });
});

test('달 계산', () => {
  assert.equal(addMonths('2026-11', 2), '2027-01');
  assert.equal(addMonths('2026-01', -1), '2025-12');
  assert.equal(monthsInclusive('2026-09', '2026-11'), 3);
  assert.equal(monthsInclusive('2026-12', '2026-11'), 0);
});

test('가입한 달부터 이번 달까지 부과한다', () => {
  assert.deepEqual(chargedMonthList(member(), '2026-11'), ['2026-09', '2026-10', '2026-11']);
});

test('부과를 멈춘 달부터는 부과하지 않는다', () => {
  const m = member({ stoppedMonth: '2026-11' });
  assert.deepEqual(chargedMonthList(m, '2026-12'), ['2026-09', '2026-10']);
});

test('멈추는 달이 아직 오지 않았으면 이번 달까지 부과한다', () => {
  const m = member({ stoppedMonth: '2027-01' });
  assert.deepEqual(chargedMonthList(m, '2026-11'), ['2026-09', '2026-10', '2026-11']);
});

test('미납액 = 부과액 − 입금 합계', () => {
  const b = computeBalance(member(), 80000, rules, { date: '2026-11-17', month: '2026-11', day: 17 });
  assert.equal(b.charged, 120000);
  assert.equal(b.due, 40000);
  assert.equal(b.overdue, 40000);
  assert.equal(b.unpaidMonths, 1);
});

test('마감일 전이면 이번 달 회비는 연체로 세지 않는다', () => {
  const b = computeBalance(member(), 80000, rules, { date: '2026-11-05', month: '2026-11', day: 5 });
  assert.equal(b.due, 40000);
  assert.equal(b.overdue, 0);
});

test('마감일 당일까지는 연체가 아니다', () => {
  const b = computeBalance(member(), 40000, rules, { date: '2026-11-09', month: '2026-11', day: 9 });
  assert.equal(b.due, 80000);
  assert.equal(b.overdue, 40000);
});

test('더 낸 돈은 선납으로 잡힌다', () => {
  const b = computeBalance(member(), 160000, rules, { date: '2026-11-17', month: '2026-11', day: 17 });
  assert.equal(b.due, 0);
  assert.equal(b.credit, 40000);
});

test('면제액과 회원별 월 회비를 반영한다', () => {
  const m = member({ monthlyFee: 20000, waivedAmount: 20000 });
  const b = computeBalance(m, 0, rules, { date: '2026-11-17', month: '2026-11', day: 17 });
  assert.equal(b.charged, 40000);
  assert.equal(b.unpaidMonths, 2);
});

test('달마다 냈는지: 오래된 달부터 채운다', () => {
  const rows = monthBreakdown(member(), 60000, rules, '2026-11');
  assert.deepEqual(rows.map((r) => r.state), ['paid', 'partial', 'unpaid']);
});

test('입금자명이 이름과 같으면 연결한다', () => {
  const members = [member(), member({ id: 2, name: '김철수' })];
  assert.equal(matchDepositor('홍길동', members), 1);
  assert.equal(matchDepositor(' 홍 길동 ', members), 1);
});

test('입금자명 안에 이름이 들어 있으면 연결한다', () => {
  const members = [member(), member({ id: 2, name: '김철수' })];
  assert.equal(matchDepositor('홍길동11월', members), 1);
  assert.equal(matchDepositor('코콕김철수', members), 2);
});

test('등록해 둔 입금자명으로도 연결한다', () => {
  const members = [member({ depositNames: ['길동맘'] })];
  assert.equal(matchDepositor('길동맘', members), 1);
});

test('동명이인이면 연결하지 않는다', () => {
  const members = [member(), member({ id: 2 })];
  assert.equal(matchDepositor('홍길동', members), null);
});

test('이름이 서로 겹치면 똑같은 쪽, 그다음 긴 쪽을 고른다', () => {
  const members = [member({ id: 1, name: '김민' }), member({ id: 2, name: '김민수' })];
  assert.equal(matchDepositor('김민', members), 1);
  assert.equal(matchDepositor('김민수회비', members), 2);
});

test('모르는 이름은 연결하지 않는다', () => {
  assert.equal(matchDepositor('박영희', [member()]), null);
  assert.equal(matchDepositor('', [member()]), null);
});

test('독촉 시점 이름', () => {
  assert.equal(reminderKind(-3), 'd-3');
  assert.equal(reminderKind(0), 'd0');
  assert.equal(reminderKind(1), 'd+1');
});
