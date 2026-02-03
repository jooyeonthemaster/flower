/**
 * Products 페이지 상수 데이터
 */

// 전통 화환 vs 홀로그램 비교 데이터
export const COMPARISON_DATA = [
  { feature: '지속 기간', traditional: '3-5일 후 시듦', hologram: '영구적 (72시간 연속 재생)' },
  { feature: '환경 영향', traditional: '꽃 폐기물 발생', hologram: '친환경 (폐기물 없음)' },
  { feature: '맞춤화', traditional: '리본 문구 정도', hologram: '메시지, 이미지, 영상 모두 가능' },
  { feature: '재사용', traditional: '불가능', hologram: '무제한 재사용' },
  { feature: '보관', traditional: '물주기, 온도 관리 필요', hologram: '별도 관리 불필요' },
  { feature: '가격 대비', traditional: '일회성 비용', hologram: '장기적으로 경제적' },
  { feature: '시각적 임팩트', traditional: '일반적', hologram: '3D 홀로그램으로 주목도 극대화' },
  { feature: '메시지 전달', traditional: '정적 리본', hologram: '동적 애니메이션 + 다중 메시지' },
];

// 서비스 모드 상세 데이터
export const SERVICE_MODES_DETAILED = [
  {
    id: 'standard',
    title: '기본 템플릿',
    subtitle: 'Standard Mode',
    price: '무료',
    priceNote: 'Free',
    color: '#8A9A5B',
    bgColor: 'bg-[#8A9A5B]/10',
    borderColor: 'border-[#8A9A5B]/30',
    icon: '/icon-standard-template.png',
    bestFor: '빠른 제작이 필요하거나, 처음 서비스를 체험해보고 싶은 분',
    features: [
      { label: '제작 시간', value: '5-10분', detail: '템플릿 선택 후 바로 생성' },
      { label: '문구 개수', value: '6개', detail: '제목 + 본문 5개 구성' },
      { label: '템플릿', value: '사전 제작', detail: '웨딩/개업/행사별 최적화 디자인' },
      { label: '배경', value: '고정 템플릿', detail: '검증된 디자인 사용' },
      { label: '스타일 옵션', value: '2가지', detail: '심플 / 화려하게' },
      { label: '영상 길이', value: '30초', detail: '핵심 메시지 전달에 최적화' },
    ],
    useCases: [
      '급하게 화환이 필요한 경우',
      '홀로그램 화환을 처음 경험해보는 경우',
      '예산을 최소화하고 싶은 경우',
      '간단한 축하 메시지 전달',
    ],
    description:
      '검증된 템플릿을 활용하여 빠르고 안정적으로 홀로그램 영상을 제작합니다. 별도 비용 없이 서비스를 체험해볼 수 있습니다.',
    cta: '무료로 시작하기',
  },
  {
    id: 'premium',
    title: 'AI 프리미엄',
    subtitle: 'Premium Mode',
    price: '100,000원',
    priceNote: '1회 제작',
    color: '#E66B33',
    bgColor: 'bg-[#E66B33]/10',
    borderColor: 'border-[#E66B33]/30',
    icon: '/icon-premium-ai.png',
    bestFor: '특별한 날, 차별화된 고급스러운 결과물을 원하는 분',
    features: [
      { label: '제작 시간', value: '10-15분', detail: 'AI 이미지 생성 포함' },
      { label: '문구 개수', value: '3개', detail: '임팩트 있는 핵심 메시지' },
      { label: '배경 이미지', value: 'AI 생성', detail: '입력 정보 기반 맞춤 이미지' },
      { label: '커스터마이징', value: '완전 맞춤형', detail: '모든 요소 개인화 가능' },
      { label: '이미지 품질', value: '고해상도', detail: 'AI가 생성한 유니크한 아트' },
      { label: '영상 길이', value: '45초', detail: '스토리텔링 가능한 구성' },
    ],
    useCases: [
      '결혼식, VIP 고객 이벤트 등 중요한 행사',
      '기업 브랜딩이 필요한 공식 행사',
      '받는 분께 특별한 감동을 드리고 싶은 경우',
      '세상에 단 하나뿐인 유니크한 화환을 원하는 경우',
    ],
    description:
      'Google Gemini AI가 입력된 정보를 분석하여 세상에 단 하나뿐인 배경 이미지를 생성합니다. 더욱 특별하고 고급스러운 결과물을 제공합니다.',
    cta: '프리미엄 시작하기',
    popular: true,
  },
];

// 이벤트 카테고리 상세 데이터
export const EVENT_CATEGORIES_DETAILED = [
  {
    id: 'wedding',
    title: '웨딩',
    subtitle: 'Wedding Celebration',
    description: '인생에서 가장 특별한 순간을 더욱 빛나게 만들어 드립니다.',
    image: '/wedding.jpg',
    longDescription:
      '결혼식장 입구, 포토존, 피로연장 등 다양한 공간에서 활용 가능합니다. 신랑신부의 이름과 축하 메시지가 아름다운 홀로그램으로 재탄생하여, 하객들에게 잊지 못할 인상을 남깁니다.',
    features: [
      { title: '맞춤 축하 메시지', desc: '축하하는 마음을 담은 개인화된 메시지' },
      { title: '신랑신부 이름 각인', desc: '두 분의 이름이 빛나는 홀로그램으로' },
      { title: '로맨틱한 배경 효과', desc: '꽃잎, 하트, 별빛 등 다양한 효과' },
      { title: '사진 통합 가능', desc: 'AI 프리미엄에서 커플 사진 활용' },
    ],
    templateOptions: ['클래식 화이트', '로맨틱 핑크', '엘레강스 골드', '모던 미니멀'],
    avgBudget: '10-20만원',
  },
  {
    id: 'opening',
    title: '개업',
    subtitle: 'Grand Opening',
    description: '새로운 시작을 축하하는 개업식, 전통 화환과는 차원이 다릅니다.',
    image: '/opening.jpg',
    longDescription:
      '매장 앞, 로비, 행사장 등에서 눈에 띄는 홀로그램으로 개업의 기쁨을 알립니다. 업체 로고와 브랜드 컬러를 적용하여 전문적인 이미지를 연출할 수 있습니다.',
    features: [
      { title: '업체명 & 로고 표시', desc: '브랜드 아이덴티티 적용 가능' },
      { title: '대박 기원 메시지', desc: '번창을 기원하는 축하 문구' },
      { title: '화려한 축하 효과', desc: '폭죽, 금빛 효과 등 축제 분위기' },
      { title: '보내는 분 정보', desc: '누가 보낸 화환인지 명확히 표시' },
    ],
    templateOptions: ['그랜드 오픈', '병원/의원 개원', '레스토랑 오픈', '오피스 이전'],
    avgBudget: '10-30만원',
  },
  {
    id: 'event',
    title: '행사',
    subtitle: 'Corporate Events',
    description: '기업 행사부터 기념일까지, 다양한 이벤트에 품격을 더합니다.',
    image: '/corporate.jpg',
    longDescription:
      '창립기념일, 시상식, 컨퍼런스, 전시회 등 기업의 중요한 순간에 홀로그램 화환이 격조를 높여드립니다. 기업 CI/BI를 적용한 맞춤형 제작이 가능합니다.',
    features: [
      { title: '다목적 활용', desc: '기념일, 시상식, 축하 행사 등' },
      { title: '기업 브랜딩 적용', desc: 'CI/BI 컬러와 로고 통합' },
      { title: '맞춤형 메시지', desc: '행사 성격에 맞는 문구 구성' },
      { title: '대량 주문 할인', desc: '기업 고객 특별 프로그램' },
    ],
    templateOptions: ['창립기념', '시상식', '컨퍼런스', '전시회/박람회'],
    avgBudget: '20-50만원',
  },
];

// 가격 상세 데이터
export const PRICING_DETAILS = {
  basic: {
    title: '기본 서비스',
    items: [
      { name: '기본 템플릿 제작', price: '무료', note: '횟수 제한 없음' },
      { name: 'AI 프리미엄 제작', price: '100,000원', note: '1회당' },
    ],
  },
  options: {
    title: '추가 옵션',
    items: [
      { name: '급행 제작 (1시간 내)', price: '+30,000원', note: 'AI 프리미엄만' },
      { name: '추가 메시지 삽입', price: '+10,000원', note: '메시지당' },
      { name: '로고/이미지 삽입', price: '+20,000원', note: 'AI 프리미엄만' },
      { name: '영상 길이 연장 (30초)', price: '+15,000원', note: '구간당' },
    ],
  },
  hardware: {
    title: '하드웨어 (선택)',
    items: [
      { name: 'LED 홀로그램 팬 렌탈', price: '50,000원/일', note: '설치비 포함' },
      { name: 'LED 홀로그램 팬 구매', price: '문의', note: '기업 고객 전용' },
      { name: '전국 배송', price: '무료', note: '도서산간 제외' },
      { name: '현장 설치 지원', price: '무료', note: '수도권 기준' },
    ],
  },
};

// FAQ 데이터
export const FAQ_DATA = [
  {
    category: '서비스 일반',
    questions: [
      {
        q: '홀로그램 화환은 어떻게 작동하나요?',
        a: 'LED 홀로그램 팬이 고속으로 회전하면서 LED 불빛이 잔상을 만들어 공중에 3D 이미지가 떠있는 것처럼 보이게 합니다. 8K UHD 해상도로 선명한 영상을 제공하며, 72시간 연속 재생이 가능합니다.',
      },
      {
        q: '기본 템플릿과 AI 프리미엄의 차이가 무엇인가요?',
        a: '기본 템플릿은 사전 제작된 디자인을 활용하여 무료로 빠르게 제작할 수 있습니다. AI 프리미엄은 Google Gemini AI가 입력된 정보를 바탕으로 세상에 단 하나뿐인 배경 이미지를 생성하여 더욱 특별한 결과물을 만들어냅니다.',
      },
      {
        q: '제작된 영상은 어떻게 받나요?',
        a: '제작 완료 후 바로 다운로드 링크가 제공됩니다. MP4 형식의 고화질 영상 파일을 받으실 수 있으며, 이메일로도 발송해드립니다.',
      },
    ],
  },
  {
    category: '주문 및 결제',
    questions: [
      {
        q: '주문 후 얼마나 걸리나요?',
        a: '기본 템플릿은 5-10분, AI 프리미엄은 10-15분 내에 제작됩니다. 급행 옵션 선택 시 1시간 이내 완성을 보장합니다.',
      },
      {
        q: '결제 방법은 어떤 것이 있나요?',
        a: '신용카드, 체크카드, 계좌이체, 네이버페이, 카카오페이 등 다양한 결제 수단을 지원합니다. 기업 고객의 경우 세금계산서 발행 및 후불 결제도 가능합니다.',
      },
      {
        q: '환불 정책은 어떻게 되나요?',
        a: '제작 시작 전에는 100% 환불이 가능합니다. 제작 완료 후에는 결과물에 심각한 오류가 있는 경우에 한해 재제작 또는 환불을 진행해드립니다.',
      },
    ],
  },
  {
    category: '설치 및 사용',
    questions: [
      {
        q: '설치 환경에 제한이 있나요?',
        a: '실내/실외 모두 사용 가능하지만, 직사광선이 강한 곳에서는 가시성이 떨어질 수 있습니다. 전원 연결(220V)이 필요하며, Wi-Fi 환경에서 무선 제어가 가능합니다.',
      },
      {
        q: '직접 설치할 수 있나요?',
        a: '네, 매우 간단합니다. 전원 연결 후 USB에 영상을 넣고 재생 버튼만 누르면 됩니다. 평균 5분 이내에 설치가 완료됩니다. 원하시면 전문 기사가 직접 방문 설치해드립니다.',
      },
      {
        q: '렌탈과 구매 중 어떤 것이 좋을까요?',
        a: '일회성 행사라면 렌탈(50,000원/일)이 경제적입니다. 여러 번 사용하거나 상시 전시가 필요한 기업이라면 구매를 권장드립니다. 기업 고객에게는 특별 할인이 적용됩니다.',
      },
    ],
  },
];

// 기술 사양 상세 데이터
export const TECH_SPECS_DETAILED = [
  {
    category: '디스플레이',
    specs: [
      { label: '해상도', value: '8K UHD (7680 x 4320)' },
      { label: '색상', value: '16.7M 컬러 (24bit)' },
      { label: '밝기', value: '1800 nits' },
      { label: '시야각', value: '176도' },
    ],
  },
  {
    category: '성능',
    specs: [
      { label: '연속 재생', value: '72시간 이상' },
      { label: '회전 속도', value: '900 RPM' },
      { label: '프레임 레이트', value: '30 FPS' },
      { label: '소비 전력', value: '50W' },
    ],
  },
  {
    category: '연결',
    specs: [
      { label: '무선', value: 'Wi-Fi 6 (802.11ax)' },
      { label: '유선', value: 'USB 3.0' },
      { label: '제어', value: '전용 앱 / 리모컨' },
      { label: '전원', value: 'AC 220V' },
    ],
  },
  {
    category: '물리적 특성',
    specs: [
      { label: '크기', value: '직경 65cm' },
      { label: '무게', value: '2.5kg' },
      { label: '설치', value: '벽걸이 / 스탠드' },
      { label: '방수등급', value: 'IP54 (생활방수)' },
    ],
  },
];
