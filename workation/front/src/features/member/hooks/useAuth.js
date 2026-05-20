import { useEffect, useState } from 'react';
import api from '../../../app/api/axios';

function useAuth() {
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            const token = localStorage.getItem('accessToken');

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
    }, []);

    return {
        memberInfo,
        loading,
        isLoggedIn: !!memberInfo,
        isSeller:
            memberInfo?.roleSet?.includes('SELLER'),
    };
}

export default useAuth;