import api from '../../../app/api/axios';

export async function getAdminBoardPosts(type, params = {}) {
  return await api.get('/admin/board/posts', { params: { type, ...params } });
}

export async function updatePostPinStatus(postId, pinned) {
  return await api.patch(`/admin/board/posts/${postId}/pin`, { pinned });
}

export async function updatePostVisibility(postId, visible) {
  return await api.patch(`/admin/board/posts/${postId}/visibility`, { visible });
}

export async function deleteAdminBoardPost(postId) {
  return await api.delete(`/admin/board/posts/${postId}`);
}

export async function getAdminBoardStats() {
  return await api.get('/admin/board/stats');
}
