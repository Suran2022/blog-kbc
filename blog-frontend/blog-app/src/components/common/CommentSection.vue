<script setup>
import { ref, onMounted } from 'vue';
import { formatDate } from '../../utils';

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
});

// 评论列表
const comments = ref([]);
// 评论总数
const total = ref(0);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(10);
// 加载状态
const loading = ref(false);
// 新评论内容
const commentContent = ref('');
// 新评论作者
const commentAuthor = ref('');
// 新评论邮箱
const commentEmail = ref('');
// 提交状态
const submitting = ref(false);
// 评论表单规则
const rules = {
  content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }],
  author: [{ required: true, message: '请输入您的昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入您的邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
};

// 评论表单引用
const commentFormRef = ref(null);

// 模拟获取评论列表
const fetchComments = async () => {
  loading.value = true;
  try {
    // 这里应该调用实际的API
    // const response = await api.getComments(props.articleId, {
    //   page: currentPage.value,
    //   limit: pageSize.value
    // });
    
    // 模拟数据
    setTimeout(() => {
      comments.value = [
        {
          id: 1,
          content: '这篇文章写得非常好，内容丰富，观点独到！',
          author: '读者A',
          createdAt: new Date(Date.now() - 86400000 * 2), // 2天前
          avatar: ''
        },
        {
          id: 2,
          content: '学习了很多知识，感谢分享！',
          author: '读者B',
          createdAt: new Date(Date.now() - 86400000), // 1天前
          avatar: ''
        }
      ];
      total.value = 2;
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('获取评论失败:', error);
    loading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchComments();
};

// 提交评论
const submitComment = async () => {
  if (!commentFormRef.value) return;
  
  await commentFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    submitting.value = true;
    try {
      // 这里应该调用实际的API
      // await api.createComment(props.articleId, {
      //   content: commentContent.value,
      //   author: commentAuthor.value,
      //   email: commentEmail.value
      // });
      
      // 模拟提交成功
      setTimeout(() => {
        // 重新获取评论列表
        fetchComments();
        // 清空表单
        commentContent.value = '';
        submitting.value = false;
        // 显示成功消息
        ElMessage.success('评论提交成功，审核通过后将显示');
      }, 500);
    } catch (error) {
      console.error('提交评论失败:', error);
      submitting.value = false;
      ElMessage.error('评论提交失败，请稍后重试');
    }
  });
};

// 格式化评论日期
const formatCommentDate = (date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm');
};

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <div class="comment-section">
    <h3 class="comment-section-title">评论 ({{ total }})</h3>
    
    <!-- 评论列表 -->
    <div class="comment-list">
      <el-skeleton :rows="3" animated v-if="loading" />
      <template v-else>
        <div v-if="comments.length > 0">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-avatar">
              <el-avatar :size="40" :src="comment.avatar">
                {{ comment.author.charAt(0).toUpperCase() }}
              </el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-date">{{ formatCommentDate(comment.createdAt) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
          
          <!-- 分页 -->
          <el-pagination
            v-if="total > pageSize"
            v-model:current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total"
            @current-change="handlePageChange"
            background
            hide-on-single-page
            class="comment-pagination"
          />
        </div>
        <el-empty v-else description="暂无评论" :image-size="60" />
      </template>
    </div>
    
    <!-- 评论表单 -->
    <div class="comment-form">
      <h4 class="form-title">发表评论</h4>
      <el-form 
        ref="commentFormRef"
        :model="{
          content: commentContent,
          author: commentAuthor,
          email: commentEmail
        }"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="评论内容" prop="content">
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="4"
            placeholder="请输入您的评论..."
          />
        </el-form-item>
        
        <div class="form-inline">
          <el-form-item label="昵称" prop="author" class="inline-item">
            <el-input
              v-model="commentAuthor"
              placeholder="请输入您的昵称"
            />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email" class="inline-item">
            <el-input
              v-model="commentEmail"
              placeholder="请输入您的邮箱（不会公开）"
            />
          </el-form-item>
        </div>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitComment"
            :loading="submitting"
          >
            提交评论
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(94, 114, 228, 0.08);
  padding: 30px;
  margin-top: 30px;
  transition: all 0.3s ease;
}

.comment-section:hover {
  box-shadow: 0 8px 25px rgba(94, 114, 228, 0.12);
}

.comment-section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
  position: relative;
  display: flex;
  align-items: center;
}

.comment-section-title::before {
  content: '💬';
  margin-right: 8px;
  font-size: 18px;
}

.comment-section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 2px;
}

.comment-list {
  margin-bottom: 30px;
}

.comment-item {
  display: flex;
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.02), rgba(94, 114, 228, 0.01));
  border-radius: 12px;
  border: 1px solid rgba(94, 114, 228, 0.08);
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.05), rgba(94, 114, 228, 0.02));
  border-color: rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(94, 114, 228, 0.1);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  margin-right: 15px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #5e72e4;
  font-size: 14px;
}

.comment-date {
  color: #6c757d;
  font-size: 12px;
  background: rgba(94, 114, 228, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.comment-text {
  color: #495057;
  line-height: 1.7;
  font-size: 14px;
  margin-top: 8px;
}

.comment-pagination {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}

.comment-pagination :deep(.el-pagination) {
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.05), rgba(94, 114, 228, 0.02));
  border-radius: 25px;
  padding: 8px 16px;
}

.comment-form {
  margin-top: 30px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.02), rgba(94, 114, 228, 0.01));
  border-radius: 12px;
  border: 1px solid rgba(94, 114, 228, 0.08);
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 25px 0;
  display: flex;
  align-items: center;
}

.form-title::before {
  content: '✍️';
  margin-right: 8px;
  font-size: 16px;
}

.form-inline {
  display: flex;
  gap: 20px;
}

.inline-item {
  flex: 1;
}

@media (max-width: 768px) {
  .form-inline {
    flex-direction: column;
    gap: 0;
  }
}
</style>