import { useEffect, useState } from 'react';
import { getMyInfo, getMyPageDashboard } from '../api/mypageApi'; // 1. 작성하신 API 함수 임포트 ✨

function useMypage() {
    const [memberInfo, setMemberInfo] = useState(null);
    const [dashboardData, setDashboardData] = useState(null); // 2. 대시보드 데이터 상태 추가 ✨
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // 에러 핸들링을 위한 상태 추가 (선택)

    useEffect(() => {
        const fetchMypageData = async () => {
            try {
                setLoading(true);

                // 3. Promise.all을 사용해 유저 정보와 대시보드 데이터를 동시에 병렬로 최적화 조회 🚀
                const [infoRes, dashboardRes] = await Promise.all([
                    getMyInfo(),
                    getMyPageDashboard()
                ]);

                setMemberInfo(infoRes);
                setDashboardData(dashboardRes);
            } catch (err) {
                console.error("마이페이지 데이터 로딩 실패:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMypageData();
    }, []);

    return {
        memberInfo,
        dashboardData, // 4. 컴포넌트에서 쓸 수 있도록 대시보드 데이터도 함께 리턴 ✨
        loading,
        error
    };
}

export default useMypage;