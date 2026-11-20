// ─── COCOC 디자인 토큰 (디자인 A: 잉크와 라임) ─────────────────
// 회비 앱과 같은 모양이다. 회색 바탕에 테두리 없는 흰 카드, 잉크 검정 글자와 버튼, 포인트는 라임 하나.
// 라임은 밝은 바탕에서 글자로 쓰지 않는다 (읽히지 않는다).
// 라임 바탕 위 검정 글자(배지, 알약, 진행 막대)나 검정 면 위(큰 검정 카드, 푸터)에만 쓴다.
// 키 이름은 예전 그대로 두어 이 값을 쓰는 곳이 한꺼번에 바뀌게 했다.

export const colors = {
  // 눌러야 하는 것(버튼, 링크, 선택 표시). 예전 녹슨 주황 자리에 잉크 검정이 들어간다
  brand:         '#0F1115',
  brandHover:    '#2A2E37',

  // 포인트 색. 라임 바탕에는 잉크 글자(textPrimary)를 쓴다
  lime:          '#C8F53C',
  limeHover:     '#B6E42A',

  // 바탕
  bgPage:        '#F2F3F5', // 화면 바탕 (밝은 회색)
  bgCard:        '#FFFFFF', // 카드 (테두리·그림자 없음)
  bgSection:     '#EEF0F2', // 카드 안에서 한 단 들어간 면, 입력칸
  bgFooter:      '#0F1115', // 푸터 (검정 면)
  bgBand:        '#0F1115', // 홈의 흐르는 글자 띠 (검정 면)
  bgInk:         '#0F1115', // 큰 검정 카드
  bgPressed:     '#E4E6EA', // 눌린 면, 막대의 빈 부분

  // 검정 면 위의 글자
  onInk:         '#FFFFFF',
  onInkMuted:    '#A9AFBC',
  onInkLine:     '#2A2E37', // 검정 면 위의 선, 빈 막대

  // 글자
  textPrimary:   '#0F1115',
  textSecondary: '#2A2E37',
  textMuted:     '#5B616E',
  textFaint:     '#646A76',
  textDimmer:    '#676D79', // 회색 바탕에서도 4.5:1을 넘기는 가장 옅은 글자
  textDimmest:   '#C0C4CC', // 입력칸 안내 글, 장식

  // 선
  borderFaint:   '#EEF0F2',
  borderSubtle:  '#E4E6EA',
  borderLight:   '#E4E6EA',
  borderMedium:  '#E4E6EA',
  borderStrong:  '#CDD1D8',
  borderInput:   '#CDD1D8',

  // 상태: 위험은 붉은색, 잘 된 것은 초록, 주의는 주황
  danger:        '#C4301C',
  dangerHover:   '#A52714',
  dangerMuted:   '#C4301C',
  dangerBg:      '#FDE6E1',
  dangerShadow:  '#F5C2B8', // 위험 버튼의 옅은 테두리

  success:       '#286E45',
  successHover:  '#256841',
  successMuted:  '#286E45',
  successBg:     '#E2F3E8',
  successShadow: '#BFE3CC',

  warning:       '#B23A08',
  warningBg:     '#FFE3D3',

  // 달력의 토요일
  info:          '#2B5CC9',
};

// 디자인 A는 그림자를 쓰지 않는다. 이 값을 쓰던 곳이 그대로 평평해지도록 키만 남겼다.
export const shadows = {
  amber:   'none',
  amberSm: 'none',
  amberMd: 'none',
  danger:  'none',
  success: 'none',
  card:    'none',
};

// 숫자와 영문은 Space Grotesk. 한글 글리프가 없어 한글은 뒤의 글꼴로 나온다.
const KOREAN_FALLBACK = "'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', system-ui, sans-serif";

export const fonts = {
  display: `'Space Grotesk', ${KOREAN_FALLBACK}`,
  body:    `'Space Grotesk', ${KOREAN_FALLBACK}`,
  mono:    "ui-monospace, 'JetBrains Mono', Menlo, monospace",
};

export const radii = {
  sm: '8px',
  md: '12px',
  btn: '16px',
  lg: '20px', // 카드
  xl: '28px', // 큰 검정 카드
  pill: '9999px',
};
