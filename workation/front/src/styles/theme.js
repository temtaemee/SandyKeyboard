// 피그마 디자인 토큰 기반 테마
// styled-components ThemeProvider에 주입 → props.theme.colors.primary 형태로 사용
//
// 사용법 // 컴포넌트 내부: ${({ theme }) => theme.colors.primary}

export const theme = {
  colors: {
    primary: "#2c6480", // 주요 버튼·링크·강조 요소 (진한 파랑)
    primaryLight: "#3d8aaa", // hover 상태 등 primary의 밝은 변형
    accentBlue: "#c3edf6", // 태그·뱃지 배경 (연한 하늘색)
    accentYellow: "#f6e5ba", // 태그·뱃지 배경 (연한 노란색)
    textDark: "#191c1e", // 본문 제목 등 가장 진한 텍스트
    textMid: "#475569", // 부제목·설명 등 중간 텍스트
    textMuted: "#64748b", // placeholder·보조 설명
    textLight: "#94a3b8", // 비활성화·캡션 등 가장 연한 텍스트
    border: "#e2e8f0", // 카드·인풋 등 기본 보더
    borderLight: "#f1f5f9", // 섹션 구분 등 아주 연한 보더
    bg: "#f7f9fb", // 페이지 전체 배경
    bgSection: "#f8fafc", // 섹션별 배경 (bg보다 약간 흰색에 가까움)
    white: "#ffffff", // 카드 배경 등 순수 흰색
  },
  gradients: {
    hero: "linear-gradient(135deg, #c3edf6 0%, #f9e8bd 100%)", // 히어로 섹션 배경 (하늘 → 크림)
    icon: "linear-gradient(135deg, #c3edf6 0%, #f6e5ba 100%)", // 피처 아이콘 배경 원형
    logo: "linear-gradient(90deg, #7dd3fc, #fde68a)", // 로고 텍스트 컬러 (파랑 → 노랑)
  },
  fonts: {
    base: "'Noto Sans KR', sans-serif", // 한/영 본문 전체 기본 폰트
    number: "'Plus Jakarta Sans', sans-serif", // 가격·숫자 전용 폰트
  },
  shadows: {
    card: "0 1px 2px rgba(0,0,0,0.05)", // 카드 기본 그림자 (아주 미세한 depth)
    cardHover: "0 12px 32px rgba(0,0,0,0.1)", // 카드 호버 시 떠오르는 그림자
    nav: "0 15px 30px -10px rgba(12,74,110,0.05)", // 네비게이션 바 하단 그림자
    searchBar: "0 25px 50px -12px rgba(0,0,0,0.25)", // 검색창 강조 그림자
  },
  radius: {
    sm: "8px", // 인풋, 작은 버튼
    md: "16px", // 카드, 모달
    lg: "24px", // 섹션 컨테이너
    xl: "32px", // 히어로 검색창 등 크게 둥근 요소
    full: "9999px", // 알약(pill) 형태 태그·뱃지·아바타
  },
};
