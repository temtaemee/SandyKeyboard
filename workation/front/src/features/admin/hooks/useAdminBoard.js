// src/features/admin/hooks/useAdminBoard.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminBoardPosts,
  getCouponList,
  updateCoupon,
  deleteCoupon,
  createCoupon,
} from '../api/adminBoardApi';
import {
  updatePostsForTab,
  updatePostInTab,
  deletePostFromTab,
  togglePin,
  setLoading,
  setError,
} from '../store/adminBoardSlice';

/**
 * 게시판 관리(공지사항, FAQ, 리뷰, 이벤트, 쿠폰 등)의 전체적인 서버 데이터 조회 및 변경 흐름을 통제하는 전용 훅입니다.
 * 
 * @param {string} activeTab - 현재 활성화된 탭 이름
 * @returns {Object} 게시글 목록, 고정 상태, API 처리 상태 및 비즈니스 액션 함수들
 */
export default function useAdminBoard(activeTab) {
  const dispatch = useDispatch();
  const {
    posts: allPosts,
    pinnedIds,
    loading,
    error,
  } = useSelector((state) => state.admin.board);

  // ─── 1. 조회(GET) 비동기 처리 함수 ───
  useEffect(() => {
    if (!activeTab) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    const fetchPosts = async () => {
      try {
        let resp;
        if (activeTab === '쿠폰') {
          resp = await getCouponList();
        } else {
          resp = await getAdminBoardPosts(activeTab);
        }
        
        // JPA Page 객체와 Mock 배열 통일성 확보를 위한 방어 로직
        const postsArray = Array.isArray(resp.data)
          ? resp.data
          : (resp.data.content || []);

        dispatch(updatePostsForTab({ tab: activeTab, posts: postsArray }));
      } catch (err) {
        console.error(err);
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPosts();
  }, [dispatch, activeTab]);


  // ─── 2. 수정(PUT) 비동기 처리 함수 ───
  const updatePost = async (postId, changes) => {
    dispatch(setLoading(true));
    try {
      if (activeTab === '쿠폰') {
        await updateCoupon(postId, changes);
      }
      dispatch(updatePostInTab({ tab: activeTab, postId, changes }));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };


  // ─── 3. 삭제(DELETE) 비동기 처리 함수 ───
  const deletePost = async (postId) => {
    dispatch(setLoading(true));
    try {
      if (activeTab === '쿠폰') {
        await deleteCoupon(postId);
      }
      dispatch(deletePostFromTab({ tab: activeTab, postId }));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };


  // ─── 4. 등록(POST) 비동기 처리 함수 ───
  const createPost = async (data) => {
    dispatch(setLoading(true));
    try {
      if (activeTab === '쿠폰') {
        await createCoupon(data);
        // 등록 후 화면 데이터 동기화를 위해 재조회
        const resp = await getCouponList();
        const postsArray = Array.isArray(resp.data)
          ? resp.data
          : (resp.data.content || []);
          
        dispatch(updatePostsForTab({ tab: '쿠폰', posts: postsArray }));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };


  const posts = allPosts[activeTab] || [];
  const togglePin = (postId) => dispatch(togglePin(postId));

  return {
    posts,
    pinnedIds,
    loading,
    error,
    updatePost,
    deletePost,
    createPost,
    togglePin,
  };
}
