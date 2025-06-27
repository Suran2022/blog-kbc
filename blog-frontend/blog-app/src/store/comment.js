import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/request';

// API函数
const getComments = async (articleId, params = {}) => {
  const { page = 0, limit = 10 } = params;
  
  // 确保articleId是有效值
  if (!articleId) {
    console.error('获取评论失败: 文章ID无效');
    throw new Error('文章ID无效');
  }
  
  console.log(`获取评论，文章ID: ${articleId}, 请求路径: /api/comments/article/${articleId}`);
  const response = await request.get(`/api/comments/article/${articleId}`, {
    params: {
      page,
      size: limit
    }
  });
  
  if (response.success) {
    return {
      data: {
        comments: response.data.content,
        total: response.data.totalElements
      }
    };
  } else {
    throw new Error(response.message || '获取评论失败');
  }
};

const createComment = async (articleId, commentData) => {
  const response = await request.post('/api/comments', {
    articleId,
    ...commentData
  });
  
  if (response.success) {
    return { data: response.data };
  } else {
    throw new Error(response.message || '评论提交失败');
  }
};

const getAdminComments = async (params = {}) => {
  const { page = 0, limit = 10, status } = params;
  
  const response = await request.get('/api/comments/admin', {
    params: {
      page,
      size: limit,
      status
    }
  });
  
  if (response.success) {
    return {
      data: {
        comments: response.data.content,
        total: response.data.totalElements
      }
    };
  } else {
    throw new Error(response.message || '获取评论失败');
  }
};

const updateCommentStatus = async (commentId, status) => {
  let response;
  
  if (status === 'approved') {
    response = await request.put(`/api/comments/${commentId}/approve`);
  } else if (status === 'rejected') {
    response = await request.put(`/api/comments/${commentId}/reject`);
  } else {
    throw new Error('无效的状态');
  }
  
  if (response.success) {
    return { data: response.data };
  } else {
    throw new Error(response.message || '更新评论状态失败');
  }
};

const deleteComment = async (commentId) => {
  const response = await request.delete(`/api/comments/${commentId}`);
  
  if (response.success) {
    return { data: { success: true } };
  } else {
    throw new Error(response.message || '删除评论失败');
  }
};

export const useCommentStore = defineStore('comment', () => {
  // 状态
  const comments = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref(null);
  
  // 添加新评论到列表
  const addNewComment = (newComment) => {
    if (!newComment) return;
    
    console.log('添加新评论到列表:', newComment);
    
    // 将新评论添加到列表开头
    comments.value = [newComment, ...comments.value];
    // 更新总数
    total.value += 1;
    
    // 清除可能存在的错误状态
    error.value = null;
  };
  
  // 方法
  const fetchComments = async (articleId, params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 确保文章ID有效
      if (!articleId) {
        throw new Error('文章ID无效');
      }
      
      console.log(`fetchComments调用，文章ID: ${articleId}, 类型: ${typeof articleId}`);
      const response = await getComments(articleId, params);
      
      if (response && response.data) {
        comments.value = response.data.comments || [];
        total.value = response.data.total || 0;
        console.log(`获取到评论数据: ${comments.value.length} 条，总数: ${total.value}`);
      } else {
        // 保留现有评论数据，不清空
        if (comments.value.length === 0) {
          total.value = 0;
        }
        console.warn('评论API返回数据格式异常:', response);
      }
      
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      console.error('获取评论失败:', error);
      // 保留现有评论数据，不清空
      if (comments.value.length === 0) {
        total.value = 0;
      }
      error.value = error.customMessage || error.message || '评论加载失败，请刷新页面重试';
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const submitComment = async (articleId, commentData) => {
    loading.value = true;
    try {
      const response = await createComment(articleId, commentData);
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const fetchAdminComments = async (params = {}) => {
    loading.value = true;
    try {
      const response = await getAdminComments(params);
      comments.value = response.data.comments;
      total.value = response.data.total;
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const approveComment = async (commentId) => {
    loading.value = true;
    try {
      const response = await updateCommentStatus(commentId, 'approved');
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const rejectComment = async (commentId) => {
    loading.value = true;
    try {
      const response = await updateCommentStatus(commentId, 'rejected');
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const removeComment = async (commentId) => {
    loading.value = true;
    try {
      const response = await deleteComment(commentId);
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  return {
    comments,
    total,
    loading,
    error,
    fetchComments,
    submitComment,
    fetchAdminComments,
    approveComment,
    rejectComment,
    removeComment,
    addNewComment
  };
});