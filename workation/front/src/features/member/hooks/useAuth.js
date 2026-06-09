import { useEffect, useState } from 'react';
import api from '../../../app/api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            const token = localStorage.getItem('accessToken');

            if (location.pathname === '/join' || location.pathname.startsWith('/oauth/callback')) {
                setLoading(false);
                return;
            }
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/auth/me');

                setMemberInfo(res.data);
            } catch (error) {
                console.error(error);

                localStorage.removeItem('accessToken');

                setMemberInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [location.pathname]);

    return {
        memberInfo,
        loading,
        isLoggedIn: !!memberInfo,
        isSeller:
            memberInfo?.roleSet?.includes('SELLER'),
    };
}

export default useAuth;