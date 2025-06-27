<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCommentStore } from '../../store/comment';
import { useSettingStore } from '../../store/setting';
import { ElMessage } from 'element-plus';
import { formatDate } from '../../utils/date';

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
});

// 使用评论store
const commentStore = useCommentStore();
const settingStore = useSettingStore();

// 从store获取评论数据
const comments = computed(() => commentStore.comments);
const total = computed(() => commentStore.total);
const loading = computed(() => commentStore.loading);

// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(10);
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

// 获取评论列表
const fetchComments = async () => {
  try {
    // 确保文章ID有效
    if (!props.articleId) {
      console.error('获取评论失败: 文章ID无效');
      ElMessage.error('获取评论失败: 文章ID无效');
      return;
    }
    
    console.log('获取评论，文章ID:', props.articleId, '类型:', typeof props.articleId);
    await commentStore.fetchComments(props.articleId, {
      page: currentPage.value - 1, // 后端页码从0开始，前端从1开始
      limit: pageSize.value
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    // 只有在已有评论数据的情况下才显示错误提示
    if (commentStore.total > 0) {
      commentStore.error = '评论加载失败，网络可能超时，请刷新页面重试';
    }
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
  
  // 检查是否允许评论
  if (!settingStore.allowComments) {
    ElMessage.error('评论功能已关闭');
    return;
  }
  
  await commentFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    submitting.value = true;
    try {
      const response = await commentStore.submitComment(props.articleId, {
        content: commentContent.value,
        author: commentAuthor.value,
        email: commentEmail.value
      });
      
      // 清空表单
      commentContent.value = '';
      commentAuthor.value = '';
      commentEmail.value = '';
      commentFormRef.value.resetFields();
      
      // 根据系统设置显示不同的成功消息
      if (settingStore.commentAudit) {
        // 如果需要审核，不更新评论列表
        ElMessage.success('评论提交成功，审核通过后将显示');
      } else {
        // 如果不需要审核，直接将新评论添加到列表中，无需刷新
        ElMessage.success('评论提交成功');
        if (response && response.data && response.data.data) {
          const newComment = response.data.data;
          commentStore.addNewComment(newComment);
        }
      }
      
      submitting.value = false;
    } catch (error) {
      console.error('提交评论失败:', error);
      submitting.value = false;
      ElMessage.error(error.message || '评论提交失败，请稍后重试');
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
      <template v-else-if="commentStore.error && commentStore.total > 0">
        <el-alert
          title="评论加载失败"
          type="error"
          description="网络连接超时，请刷新页面重试"
          show-icon
          :closable="false"
          class="comment-error"
        />
      </template>
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
    <div class="comment-form" v-if="settingStore.allowComments">
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
    
    <!-- 评论功能关闭提示 -->
    <div class="comment-disabled" v-else>
      <el-alert
        title="评论功能已关闭"
        description="管理员已关闭评论功能"
        type="info"
        :closable="false"
        show-icon
      />
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

.comment-disabled {
  margin-top: 30px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.02), rgba(94, 114, 228, 0.01));
  border-radius: 12px;
  border: 1px solid rgba(94, 114, 228, 0.08);
}

.comment-error {
  margin: 20px 0;
}
</style>