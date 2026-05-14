import { useEffect, useState } from 'react';
import api from '../../../../app/api/axios';

function useMypage() {
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const res = await api.get('/user/me');
                console.log(res.data);
                setMemberInfo(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberInfo();
    }, []);

    return {
        memberInfo,
        loading,
    };
}

export default useMypage;