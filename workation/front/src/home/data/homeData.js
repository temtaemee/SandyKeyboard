/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const NAV_LINKS = [
  {
    label: '여행지',
    path: `/resv/destination`,
  },
  {
    label: '참여후기',
    path: `/board/review`,
  },
  {
    label: '고객지원',
    path: '/board/support',
  },
  {
    label: '이벤트',
    path: `/board/event`,
  },
];

export const FOOTER_LINKS = {
  제품: ['여행지', '업무 공간', '커뮤니티'],
  회사: ['회사 소개', '인재 채용', '문의하기'],
  '법적 고지': ['개인정보 처리방침', '이용 약관'],
};

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */

export const FEATURES = [
  {
    id: 1,
    title: '생산성 향상',
    desc: '듀얼 모니터, 초고속 광랜, 인체공학적 가구가 구비된 검증된 작업 공간을 제공합니다.',
    icon: 'monitor',
  },
  {
    id: 2,
    title: '정신적 재충전',
    desc: '화면에서 고개를 돌리면 바로 바다가 보입니다. 자연과 함께 번아웃에서 벗어나세요.',
    icon: 'refresh',
  },
  {
    id: 3,
    title: '글로벌 네트워킹',
    desc: '커뮤니티 이벤트를 통해 전 세계의 창작자, 개발자, 기업가들과 소통하세요.',
    icon: 'users',
  },
];



export const COLLECTIONS = [
  {
    id: 1,
    title: '개발자를 위한 낙원',
    desc: '다중 모니터와 초고속 인터넷이 완비된 최고의 장소들.',
    image:
      'https://www.figma.com/api/mcp/asset/b6ca7d96-d3e8-45e7-a130-9f9849aa11d4',
    size: 'large',
  },
  {
    id: 2,
    title: '몰입을 위한 은신처',
    desc: '중요한 프로젝트에 집중할 수 있는 방해 없는 환경.',
    image:
      'https://www.figma.com/api/mcp/asset/474281fa-bcfb-445a-a399-3df2aabf0e34',
    size: 'wide',
  },
  {
    id: 3,
    title: '해변가',
    desc: '',
    image:
      'https://www.figma.com/api/mcp/asset/856f6175-8fa5-4be9-a379-e9b35875748b',
    size: 'small',
  },
  {
    id: 4,
    title: '도심의 활기',
    desc: '',
    image:
      'https://www.figma.com/api/mcp/asset/4ff96057-92a3-4e52-9a6d-b99f19c6dbf0',
    size: 'small',
  },
];
