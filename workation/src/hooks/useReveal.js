import { useEffect, useRef, useState } from 'react';

/**
 * 요소가 뷰포트에 들어오면 visible = true 반환
 * → styled-components의 prop으로 전달해서 조건부 스타일 적용
 *
 * @param {number} threshold - 몇 % 보일 때 트리거할지 (기본 0.1 = 10%)
 */
export default function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // 한 번 실행 후 해제
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
