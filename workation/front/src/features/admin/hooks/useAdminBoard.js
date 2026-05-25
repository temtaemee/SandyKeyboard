import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminBoardPosts } from '../api/adminBoardApi';
import {
  updatePostsForTab,
  updatePostInTab,
  deletePostFromTab,
  togglePin,
  setLoading,
} from '../store/adminBoardSlice';

export default function useAdminBoard(activeTab) {
  const dispatch = useDispatch();
  const {
    posts: allPosts,
    pinnedIds,
    loading,
    error,
  } = useSelector((state) => state.admin.board);

  useEffect(() => {
    if (!activeTab) return;
    dispatch(setLoading(true));
    const fetchPosts = async () => {
      try {
        const resp = await getAdminBoardPosts(activeTab);
        dispatch(updatePostsForTab({ tab: activeTab, posts: resp.data }));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchPosts();
  }, [dispatch, activeTab]);

  return {
    posts: allPosts[activeTab] || [],
    pinnedIds,
    loading,
    error,
    updatePost: (postId, changes) =>
      dispatch(updatePostInTab({ tab: activeTab, postId, changes })),
    deletePost: (postId) =>
      dispatch(deletePostFromTab({ tab: activeTab, postId })),
    togglePin: (postId) => dispatch(togglePin(postId)),
  };
}
