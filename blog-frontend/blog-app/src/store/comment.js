import { defineStore } from 'pinia';
import { ref } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟评论数据
let mockComments = {
  // 文章ID为键，评论数组为值
  '1': [
    {
      id: '1',
      articleId: '1',
      content: '这篇文章写得非常好，内容丰富，观点独到！',
      author: '读者A',
      email: 'reader_a@example.com',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2天前
      status: 'approved' // approved, pending, rejected
    },
    {
      id: '2',
      articleId: '1',
      content: '学习了很多知识，感谢分享！',
      author: '读者B',
      email: 'reader_b@example.com',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
      status: 'approved'
    }
  ],
  '2': [
    {
      id: '3',
      articleId: '2',
      content: '这个技术我也在使用，确实很好用！',
      author: '技术爱好者',
      email: 'tech_lover@example.com',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3天前
      status: 'approved'
    }
  ]
};

// 模拟API
const getComments = async (articleId, params = {}) => {
  await delay(600);
  
  const { page = 1, limit = 10 } = params;
  
  // 获取指定文章的评论
  const articleComments = mockComments[articleId] || [];
  
  // 只返回已审核通过的评论
  const approvedComments = articleComments.filter(comment => comment.status === 'approved');
  
  // 计算分页
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedComments = approvedComments.slice(start, end);
  
  return {
    data: {
      comments: paginatedComments,
      total: approvedComments.length
    }
  };
};

const createComment = async (articleId, commentData) => {
  await delay(800);
  
  // 生成ID
  const newId = String(Date.now());
  
  // 创建新评论
  const newComment = {
    id: newId,
    articleId,
    ...commentData,
    createdAt: new Date().toISOString(),
    status: 'pending' // 默认为待审核状态
  };
  
  // 添加到模拟数据
  if (!mockComments[articleId]) {
    mockComments[articleId] = [];
  }
  
  mockComments[articleId].push(newComment);
  
  return { data: newComment };
};

const getAdminComments = async (params = {}) => {
  await delay(600);
  
  const { page = 1, limit = 10, status } = params;
  
  // 获取所有评论并扁平化
  let allComments = Object.values(mockComments).flat();
  
  // 根据状态筛选
  if (status) {
    allComments = allComments.filter(comment => comment.status === status);
  }
  
  // 按时间倒序排序
  allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // 计算分页
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedComments = allComments.slice(start, end);
  
  return {
    data: {
      comments: paginatedComments,
      total: allComments.length
    }
  };
};

const updateCommentStatus = async (commentId, status) => {
  await delay(500);
  
  // 查找评论
  let targetComment = null;
  let articleId = null;
  
  for (const [artId, comments] of Object.entries(mockComments)) {
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      targetComment = comments[index];
      articleId = artId;
      break;
    }
  }
  
  if (!targetComment) {
    throw new Error('评论不存在');
  }
  
  // 更新状态
  targetComment.status = status;
  
  return { data: targetComment };
};

const deleteComment = async (commentId) => {
  await delay(500);
  
  // 查找并删除评论
  for (const articleId in mockComments) {
    const index = mockComments[articleId].findIndex(c => c.id === commentId);
    if (index !== -1) {
      mockComments[articleId].splice(index, 1);
      return { data: { success: true } };
    }
  }
  
  throw new Error('评论不存在');
};

export const useCommentStore = defineStore('comment', () => {
  // 状态
  const comments = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref(null);
  
  // 方法
  const fetchComments = async (articleId, params = {}) => {
    loading.value = true;
    try {
      const response = await getComments(articleId, params);
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
    removeComment
  };
});