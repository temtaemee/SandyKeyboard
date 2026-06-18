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

        // [소셜 회원가입 흐름]
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

            // [일반 회원가입 흐름] 🔥 안전하게 try-catch 보완 및 에러 핸들링 추가
        } else {
            if (vo.password !== passwordCheck) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            try {
                // memberApi의 join 통신 시도
                const response = await join(vo);

                // axios 응답 구조체나 커스텀 리턴 형태(response.status 또는 response.data.status)에 맞춰 검증
                if (response && (response.status === 201 || response.data?.status === 201)) {
                    alert('회원가입 완료! 🎉');
                    navi('/');
                } else {
                    alert('회원가입 처리 중 알 수 없는 상태가 반환되었습니다.');
                }

            } catch (error) {
                console.error('일반 회원가입 실패:', error);

                if (error.response && error.response.status === 400) {
                    const errorData = error.response.data;

                    // 1. 백엔드가 필드별 상세 에러 배열(errors)을 내려줬는지 확인
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        // 배열 중에서 'email' 필드와 관련된 에러 정보를 찾아냅니다.
                        const emailError = errorData.errors.find(err => err.field === 'email');

                        if (emailError) {
                            // 이메일 전용 에러 메시지가 있다면 그걸 띄워줌 (예: "이미 가입된 이메일 주소입니다.")
                            alert(emailError.reason || emailError.message || '이미 가입된 이메일입니다.');
                            return; // 함수 종료
                        }
                    }

                    // 2. 만약 특정 필드 에러가 아니라 객체 자체의 message가 있다면 출력
                    // (예: "요청 값이 올바르지 않습니다." 가 나오기 전 2차 방어)
                    const serverMessage = errorData.message || errorData;
                    alert(serverMessage || '입력하신 회원 정보에 오류가 있습니다.');

                } else {
                    alert('서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
                }
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