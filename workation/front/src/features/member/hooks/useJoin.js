// src/hooks/useJoin.js
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../app/api/axios';
import { join } from '../api/memberApi';

export default function useJoin() {
    const navi = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. URL 쿼리 스트링 캡처
    const isSocial = searchParams.get('type') === 'social';
    const socialEmail = searchParams.get('email') || '';
    const socialProfileImageUrl = searchParams.get('profileImageUrl') || '';

    // 2. 통합 폼 데이터 데이터 상태 정의
    const [vo, setVo] = useState({
        name: '',
        username: isSocial ? socialEmail : '',
        password: isSocial ? 'SOCIAL_AUTHENTICATED_BY_KAKAO' : '',
        phone: '',
        email: isSocial ? socialEmail : '',
        preferredArea: '',
        zonecode: '',
        profileImageUrl: isSocial ? socialProfileImageUrl : '',
        address: '',
        addressDetail: '',
        companyId: '',
    });

    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false); // 💡 기업 모달 제어 상태
    const [selectedCompanyName, setSelectedCompanyName] = useState(''); // 💡 화면 체킹용 텍스트 명칭

    // 💡 기업을 픽했을 때 작동할 헬퍼 메서드
    const handleCompanySelect = (company) => {
        setSelectedCompanyName(company.companyName);
        setVo((prev) => ({
            ...prev,
            companyId: company.id, // 백엔드로 쏠 실제 PK ID
        }));
    };

    // 💡 폼 리셋 기능이나 초기 데이터가 필요할 때 선택 해제하는 기능도 얹으면 완벽합니다.
    const handleClearCompany = () => {
        setSelectedCompanyName('');
        setVo((prev) => ({ ...prev, companyId: '' }));
    };

    const [passwordCheck, setPasswordCheck] = useState(
        isSocial ? 'SOCIAL_AUTHENTICATED_BY_KAKAO' : ''
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companies, setCompanies] = useState([]);

    // 3. 기업 마스터 정보 비동기 로드
    useEffect(() => {
        api
            .get('/public/company')
            .then((res) => setCompanies(res.data?.content || []))
            .catch((err) => console.error('기업 목록 로드 실패', err));
    }, []);

    // 4. 주소 선택 리렌더링 시 소셜 데이터 유실 방어 가드
    useEffect(() => {
        if (isSocial && socialEmail && socialProfileImageUrl) {
            setVo((prev) => ({
                ...prev,
                username: socialEmail,
                email: socialEmail,
                password: 'SOCIAL_AUTHENTICATED_BY_KAKAO',
                profileImageUrl: socialProfileImageUrl,
            }));
            setPasswordCheck('SOCIAL_AUTHENTICATED_BY_KAKAO');
        }
    }, [isSocial, socialEmail, socialProfileImageUrl]);

    // 5. 폼 인풋 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVo((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressSelect = (selectedAddress) => {
        setVo((prev) => ({
            ...prev,
            zonecode: selectedAddress.zonecode,
            address: selectedAddress.address,
        }));
    };

    // 6. 통합 제출 처리 로직 (일반 / 소셜 분기 캡슐화)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSocial) {
            try {
                await api.post('/guest/social-join', vo);
                const tempToken = searchParams.get('tempToken');
                if (tempToken) {
                    localStorage.setItem('accessToken', tempToken);
                }
                alert('방문을 환영합니다! 모래묻은 키보드 연동이 완료되었습니다. 🦀🔵');
                navi('/');
            } catch (error) {
                console.error(error);
                alert('소셜 회원정보 저장 중 오류가 발생했습니다.');
            }
        } else {
            if (vo.password !== passwordCheck) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            const data = await join(vo);
            if (data.status === 201) {
                alert('회원가입 완료!');
                navi('/');
            }
        }
    };

    return {
        isSocial,
        vo,
        passwordCheck,
        setPasswordCheck,
        isModalOpen,
        setIsModalOpen,
        companies,
        handleChange,
        handleAddressSelect,
        handleSubmit,
        navi,
        isCompanyModalOpen,
        setIsCompanyModalOpen,
        selectedCompanyName,
        handleCompanySelect,
        handleClearCompany
    };
}