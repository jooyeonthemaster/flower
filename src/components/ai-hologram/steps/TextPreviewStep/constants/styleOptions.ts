// 일반 이펙트 (중복 선택 가능)
export const availableEffects = [
  // 시각 이펙트
  { id: 'glow', name: '글로우' },
  { id: 'glitch', name: '글리치' },
  { id: 'pulse', name: '펄스' },
  { id: 'extrude', name: '입체돌출' },
  // 움직임 이펙트
  { id: 'drift', name: '떠다님' },
  { id: 'wave', name: '웨이브' },
  { id: 'bounce', name: '바운스' },
  { id: 'spin', name: '스핀' },
  { id: 'swing', name: '스윙' },
  { id: 'slide', name: '슬라이드' },
  { id: 'orbit', name: '궤도' },
  // 3D 깊이 이펙트
  { id: 'zoomIn', name: '줌인 3D' },
  { id: 'flipUp', name: '플립업' },
  { id: 'spiral3d', name: '3D 나선' },
  { id: 'wave3d', name: '3D 웨이브' },
  { id: 'tumble', name: '텀블' },
  // 진입 이펙트
  { id: 'elastic', name: '탄성' },
];

// 글자별 이펙트 (단일 선택)
export const letterEffects = [
  { id: 'none', name: '없음' },
  { id: 'typewriter', name: '타이핑' },
  { id: 'letterDrop', name: '글자 낙하' },
  { id: 'letterWave', name: '글자 물결' },
  { id: 'letterBounce', name: '글자 바운스' },
  { id: 'letterSpin', name: '글자 회전' },
  { id: 'letterScatter', name: '글자 흩어짐' },
  { id: 'letterJump', name: '글자 점프' },
  { id: 'letterZoom', name: '글자 확대' },
  { id: 'letterFlip', name: '글자 뒤집기' },
  { id: 'letterSlide', name: '글자 슬라이드' },
  { id: 'letterPop', name: '글자 팡' },
  { id: 'letterRain', name: '글자 비' },
];

export const fontOptions = [
  // Google Fonts
  { value: "'Noto Sans KR', sans-serif", name: 'Noto Sans' },
  { value: "'Black Han Sans', sans-serif", name: '검은고딕' },
  { value: "'Jua', sans-serif", name: '주아체' },
  { value: "'Do Hyeon', sans-serif", name: '도현체' },
  { value: "'Gaegu', cursive", name: '개구체' },
  { value: "'Gamja Flower', cursive", name: '감자꽃체' },
  // 로컬 커스텀 폰트 (public/fonts)
  { value: "'Hakgyoansim Gongryongal', sans-serif", name: '공룡알체' },
  { value: "'OK DDUNG', sans-serif", name: '오케이뚱' },
  { value: "'SF Lemon Bingsu', sans-serif", name: 'SF 레몬빙수' },
  { value: "'Sinchon Rhapsody', sans-serif", name: '신촌랩소디' },
  { value: "'Solinsunny', sans-serif", name: '솔인써니' },
  { value: "'KERIS EDU Line', sans-serif", name: '케리스에듀' },
];

export const positionOptions = [
  { value: 'random', label: '랜덤' },
  { value: 'top', label: '상단' },
  { value: 'center', label: '중앙' },
  { value: 'bottom', label: '하단' },
] as const;

export const positionLabels: Record<string, string> = {
  random: '랜덤',
  top: '상단',
  center: '중앙',
  bottom: '하단',
};
