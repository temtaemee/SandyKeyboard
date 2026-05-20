import { useEffect, useState } from 'react';
import {
  getAdminBoardPosts,
  updatePostPinStatus,
  deleteAdminBoardPost,
} from '../api/adminBoardApi';
import { BOARD_POSTS } from '../data/adminBoardData';

export default function useAdminBoard(activeTab) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeTab) return;
    setLoading(true);

    const fetchPosts = async () => {
      try {
        const res = await getAdminBoardPosts(activeTab);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setPosts(BOARD_POSTS[activeTab] || []);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  const togglePin = async (postId, currentlyPinned) => {
    // API 성공 전에 먼저 UI 반영 (빠른 응답감)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isFixed: !currentlyPinned } : p
      )
    );
    try {
      await updatePostPinStatus(postId, !currentlyPinned);
    } catch (err) {
      console.error(err);
      // 실패 시 롤백
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isFixed: currentlyPinned } : p
        )
      );
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteAdminBoardPost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  return { posts, loading, error, togglePin, deletePost };
}
