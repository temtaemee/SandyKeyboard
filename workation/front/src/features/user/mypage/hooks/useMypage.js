import { useEffect, useState } from 'react';
import api from '../../../../app/api/axios';
import { deleteAccount } from '../api/mypageApi';

function useMypage() {
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const res = await api.get('/auth/me');
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