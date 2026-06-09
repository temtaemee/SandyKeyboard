import { useState } from 'react';
import {
  getAdminBoardPost,
  getCouponById,
  reviewDetail,
  faqDetail,
} from '../api/adminBoardApi';

/**
 * AdminBoardPage의 UI 로직(검색, 필터링, 다양한 모달 창 제어, 폼 입력)을 전담하는 커스텀 훅입니다.
 *
 * @param {Object} params
 * @param {Array} params.tabPosts - 현재 탭의 게시글 목록
 * @param {string} params.activeTab - 현재 선택된 활성 탭명
 * @param {Function} params.updatePost - 게시글 정보를 업데이트하는 서버 디스패치 함수
 * @param {Function} params.deletePost - 게시글을 삭제하는 서버 디스패치 함수
 * @param {Function} params.createPost - 게시글을 생성하는 서버 디스패치 함수
 * @returns {Object} AdminBoardPage에서 사용할 UI 상태 및 핸들러 객체
 */
export default function useAdminBoardUI({
  tabPosts,
  activeTab,
  currentPage = 1,
  updatePost,
  deletePost,
  createPost,
}) {
  // ─── 1. 검색 및 필터 상태 ───
  const [searchQuery, setSearchQuery] = useState('');
  const [couponFilter, setCouponFilter] = useState('전체');

  // 검색 및 쿠폰 상태 필터링 연산 (백엔드 JPA delYn 필드 기준으로 소프트 딜리트 완벽 판별)
  const filteredPosts = tabPosts.filter((p) => {
    if (activeTab === '쿠폰') {
      const matchSearch = (p.couponName || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // '삭제' 카테고리는 오직 삭제된 쿠폰(delYn === 'Y')만 표시합니다.
      if (couponFilter === '삭제') {
        return matchSearch && p.delYn === 'Y';
      }

      // '전체', '활성', '소진' 카테고리에서는 소프트 삭제된 쿠폰(delYn === 'Y')을 완벽히 제외합니다.
      if (p.delYn === 'Y') return false;

      if (couponFilter === '전체') return matchSearch;

      // '활성' 필터 조건: delYn === 'N' 이면서 (ACTIVE이거나 남은 수량이 0보다 큰 경우)
      if (couponFilter === '활성') {
        const isQtyActive = p.remainQty !== undefined && p.remainQty > 0;
        return matchSearch && (p.couponStatus === 'ACTIVE' || isQtyActive);
      }

      // '소진' 필터 조건: delYn === 'N' 이면서 (EXHAUSTED이거나 남은 수량이 0 이하인 경우)
      if (couponFilter === '소진') {
        const isQtyExhausted = p.remainQty !== undefined && p.remainQty <= 0;
        return (
          matchSearch && (p.couponStatus === 'EXHAUSTED' || isQtyExhausted)
        );
      }

      return matchSearch;
    } else {
      const searchTarget = activeTab === 'FAQ' ? p.question : p.title;
      const matchSearch = (searchTarget || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchSearch;
    }
  });

  // 상단 고정(pinYn === 'Y' || isFixed) 게시글 최상단 정렬 연산
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === '공지사항') {
      const aPinned = a.pinYn === 'Y' || a.isFixed ? 1 : 0;
      const bPinned = b.pinYn === 'Y' || b.isFixed ? 1 : 0;
      return bPinned - aPinned;
    }
    return 0;
  });

  const displayPosts =
    activeTab === 'FAQ'
      ? sortedPosts.slice((currentPage - 1) * 10, currentPage * 10)
      : sortedPosts;

  // 검색 및 쿠폰 필터 상태 초기화
  const resetFilters = () => {
    setSearchQuery('');
    setCouponFilter('전체');
  };

  // ─── 2. 신규 등록 / 수정 모달 & 폼 상태 ───
  const [registerModal, setRegisterModal] = useState(null); // null | tabName string
  const [editingPost, setEditingPost] = useState(null); // 현재 수정 중인 post 객체
  const [formData, setFormData] = useState({}); // 작성 중인 폼 입력 값 객체
  const [removedFileIds, setRemovedFileIds] = useState([]); // 삭제할 기존 파일 ID 목록

  // 등록 모달 열기
  const openRegisterModal = (type) => {
    setRegisterModal(type);
    setEditingPost(null);
    setFormData({});
  };

  // 수정 모달 열기 (상세 모달은 자동으로 닫힘)
  const openEditModal = (post) => {
    setDetailPost(null);
    setRegisterModal(activeTab);
    setEditingPost(post);
    setRemovedFileIds([]); // 삭제 목록 초기화
    if (activeTab === '쿠폰') {
      setFormData({
        name: post.couponName ?? '',
        discountRate: post.discountRate ?? '',
        quantity: post.remainQty ?? '',
        validDays: post.validDays ?? '',
      });
    } else {
      setFormData({
        title: activeTab === 'FAQ' ? post.question : post.title,
        content: activeTab === 'FAQ' ? post.answer : post.content || '',
        isFixed: post.pinYn === 'Y' || post.isFixed || false,
      });
    }
  };

  // 기존 파일 삭제 대기열 추가 핸들러
  const handleRemoveExistingFile = (fileId) => {
    setRemovedFileIds((prev) => [...prev, fileId]);
  };

  // 등록/수정 모달 닫기
  const closeRegisterModal = () => {
    setRegisterModal(null);
    setEditingPost(null);
    setFormData({});
    setRemovedFileIds([]);
  };

  // 폼 입력 필드 변경 핸들러
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 등록/수정 완료 제출 핸들러
  const handleRegisterSubmit = async () => {
    if (editingPost) {
      const postId = editingPost.id;
      let updatedData = {};

      if (activeTab === '쿠폰') {
        updatedData = {
          couponName: formData.name || editingPost.couponName,
          discountRate: formData.discountRate
            ? Number(formData.discountRate)
            : editingPost.discountRate,
          remainQty: formData.quantity
            ? Number(formData.quantity)
            : editingPost.remainQty,
          validDays: formData.validDays
            ? Number(formData.validDays)
            : editingPost.validDays,
        };
      } else if (activeTab === '공지사항') {
        updatedData = {
          title: formData.title ?? editingPost.title,
          content: formData.content ?? editingPost.content,
          pinYn: formData.isFixed ? 'Y' : 'N',
          removedFileIds: removedFileIds, // 삭제 대기 중인 기존 첨부파일 ID 배열
          files: formData.files || [], // 새로 업로드할 파일들 추가
        };
      } else if (activeTab === 'FAQ') {
        updatedData = {
          question: formData.title ?? editingPost.question,
          answer: formData.content ?? editingPost.answer,
        };
      } else {
        updatedData = {
          title: formData.title || editingPost.title,
        };
      }

      // 서버 비동기 업데이트 대기
      await updatePost(postId, updatedData);

      // 수정 폼 모달을 닫음
      closeRegisterModal();

      // 상세 조회 모달(수정버튼 누르기 전 상태)로 다시 돌아가되, 최신 내용으로 갱신하여 띄움
      if (activeTab === '공지사항') {
        try {
          const resp = await getAdminBoardPost(postId);
          setDetailPost(resp.data);
        } catch (err) {
          console.error('수정 완료 후 공지 상세 재조회 에러:', err);
          setDetailPost({ ...editingPost, ...updatedData });
        }
      } else if (activeTab === '쿠폰') {
        try {
          const resp = await getCouponById(postId);
          setDetailPost(resp.data);
        } catch (err) {
          console.error('수정 완료 후 쿠폰 상세 재조회 에러:', err);
          setDetailPost({ ...editingPost, ...updatedData });
        }
      } else if (activeTab === 'FAQ') {
        try {
          const resp = await faqDetail(postId);
          setDetailPost(resp.data);
        } catch (err) {
          console.error('수정 완료 후 FAQ 상세 재조회 에러:', err);
          setDetailPost({ ...editingPost, ...updatedData });
        }
      } else {
        setDetailPost({ ...editingPost, ...updatedData });
      }
    } else {
      if (activeTab === '쿠폰') {
        await createPost({
          couponName: formData.name,
          discountRate: Number(formData.discountRate),
          remainQty: Number(formData.quantity),
          validDays: Number(formData.validDays),
        });
      } else if (activeTab === '공지사항') {
        const fd = new FormData();
        const noticeDto = {
          memberId: 1, // 필요 시 로그인 한 계정 ID 정보 연계
          title: formData.title || '',
          content: formData.content || '',
          pinYn: formData.isFixed ? 'Y' : 'N',
        };
        fd.append(
          'dto',
          new Blob([JSON.stringify(noticeDto)], { type: 'application/json' })
        );

        if (formData.files && formData.files.length > 0) {
          formData.files.forEach((file) => {
            fd.append('files', file);
          });
        }
        await createPost(fd);
      } else if (activeTab === 'FAQ') {
        await createPost({
          memberId: 1,
          question: formData.title || '',
          answer: formData.content || '',
        });
      }
      closeRegisterModal();
    }
  };

  // ─── 3. 상세보기 모달 상태 ───
  const [detailPost, setDetailPost] = useState(null); // null | post 객체

  const handleShowDetail = async (post) => {
    if (activeTab === '공지사항') {
      try {
        const resp = await getAdminBoardPost(post.id);
        setDetailPost(resp.data);
      } catch (err) {
        console.error('공지 상세 조회 실패:', err);
        setDetailPost(post);
      }
    } else if (activeTab === '리뷰') {
      try {
        const resp = await reviewDetail(post.id);
        setDetailPost(resp.data);
      } catch (err) {
        console.error('리뷰 상세 조회 실패:', err);
        setDetailPost(post);
      }
    } else if (activeTab === 'FAQ') {
      try {
        const resp = await faqDetail(post.id);
        setDetailPost(resp.data);
      } catch (err) {
        console.error('FAQ 상세 조회 실패:', err);
        setDetailPost(post);
      }
    } else {
      setDetailPost(post);
    }
  };

  // ─── 4. 삭제 확인 모달 상태 ───
  const [deleteTarget, setDeleteTarget] = useState(null); // null | post 객체

  // 삭제 확인 완료 제출 핸들러 (실제 서버 DELETE API 호출)
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    // 💡 이미 삭제된 상태('Y')인 경우 얼럿 표시 후 중단
    if (deleteTarget.delYn === 'Y') {
      alert('이미 삭제된 게시글입니다.');
      setDeleteTarget(null);
      return;
    }

    deletePost(deleteTarget.id);
    setDeleteTarget(null);
    setDetailPost(null);
  };

  return {
    // 1. 검색 및 필터
    searchQuery,
    setSearchQuery,
    couponFilter,
    setCouponFilter,
    posts: displayPosts,
    totalCount: sortedPosts.length,
    resetFilters,

    // 2. 신규 등록 및 수정
    registerModal,
    editingPost,
    formData,
    removedFileIds,
    handleRemoveExistingFile,
    openRegisterModal,
    openEditModal,
    closeRegisterModal,
    handleFormChange,
    handleRegisterSubmit,

    // 3. 상세보기
    detailPost,
    setDetailPost,
    handleShowDetail,

    // 4. 삭제 확인
    deleteTarget,
    setDeleteTarget,
    handleDeleteConfirm,
  };
}
