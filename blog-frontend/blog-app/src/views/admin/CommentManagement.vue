<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCommentStore } from '../../store/comment';
import { useSettingStore } from '../../store/setting';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const commentStore = useCommentStore();
const settingStore = useSettingStore();

// 状态
const currentPage = ref(1);
const pageSize = ref(10);
const statusFilter = ref('');
const loading = ref(false);
const selectedComments = ref([]);
const batchLoading = ref(false);

// 计算属性
const comments = computed(() => commentStore.comments);
const total = computed(() => commentStore.total);

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待审核', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' }
];

// 获取评论列表
const fetchComments = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value - 1, // 后端分页从0开始
      limit: pageSize.value
    };
    
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }
    
    await commentStore.fetchAdminComments(params);
  } catch (error) {
    console.error('获取评论列表失败:', error);
    ElMessage.error('获取评论列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchComments();
};

// 处理页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchComments();
};

// 处理状态筛选
const handleStatusFilter = () => {
  currentPage.value = 1;
  fetchComments();
};

// 审核通过
const approveComment = async (commentId) => {
  try {
    await commentStore.approveComment(commentId);
    ElMessage.success('评论审核通过');
    fetchComments();
  } catch (error) {
    console.error('审核评论失败:', error);
    ElMessage.error('审核评论失败');
  }
};

// 拒绝评论
const rejectComment = async (commentId) => {
  try {
    await commentStore.rejectComment(commentId);
    ElMessage.success('评论已拒绝');
    fetchComments();
  } catch (error) {
    console.error('拒绝评论失败:', error);
    ElMessage.error('拒绝评论失败');
  }
};

// 删除评论
const deleteComment = async (commentId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条评论吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    await commentStore.removeComment(commentId);
    ElMessage.success('评论删除成功');
    fetchComments();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error);
      ElMessage.error('删除评论失败');
    }
  }
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedComments.value = selection;
};

// 批量审核通过
const batchApprove = async () => {
  if (selectedComments.value.length === 0) {
    ElMessage.warning('请选择要审核的评论');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要批量通过选中的 ${selectedComments.value.length} 条评论吗？`,
      '批量审核',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    );
    
    batchLoading.value = true;
    const promises = selectedComments.value.map(comment => 
      commentStore.approveComment(comment.id)
    );
    
    await Promise.all(promises);
    ElMessage.success(`成功批量通过 ${selectedComments.value.length} 条评论`);
    selectedComments.value = [];
    fetchComments();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量审核失败:', error);
      ElMessage.error('批量审核失败');
    }
  } finally {
    batchLoading.value = false;
  }
};

// 批量拒绝
const batchReject = async () => {
  if (selectedComments.value.length === 0) {
    ElMessage.warning('请选择要拒绝的评论');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要批量拒绝选中的 ${selectedComments.value.length} 条评论吗？`,
      '批量拒绝',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    batchLoading.value = true;
    const promises = selectedComments.value.map(comment => 
      commentStore.rejectComment(comment.id)
    );
    
    await Promise.all(promises);
    ElMessage.success(`成功批量拒绝 ${selectedComments.value.length} 条评论`);
    selectedComments.value = [];
    fetchComments();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量拒绝失败:', error);
      ElMessage.error('批量拒绝失败');
    }
  } finally {
    batchLoading.value = false;
  }
};

// 批量删除
const batchDelete = async () => {
  if (selectedComments.value.length === 0) {
    ElMessage.warning('请选择要删除的评论');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要批量删除选中的 ${selectedComments.value.length} 条评论吗？删除后无法恢复。`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }
    );
    
    batchLoading.value = true;
    const promises = selectedComments.value.map(comment => 
      commentStore.removeComment(comment.id)
    );
    
    await Promise.all(promises);
    ElMessage.success(`成功批量删除 ${selectedComments.value.length} 条评论`);
    selectedComments.value = [];
    fetchComments();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error);
      ElMessage.error('批量删除失败');
    }
  } finally {
    batchLoading.value = false;
  }
};

// 格式化时间
const formatTime = (time) => {
  return formatDistanceToNow(new Date(time), {
    addSuffix: true,
    locale: zhCN
  });
};

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'danger';
    default:
      return 'info';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'APPROVED':
      return '已通过';
    case 'PENDING':
      return '待审核';
    case 'REJECTED':
      return '已拒绝';
    default:
      return '未知';
  }
};

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <div class="comment-management">
    <div class="page-header">
      <h2 class="page-title">评论管理</h2>
    </div>
    
    <!-- 筛选器和批量操作 -->
    <div class="filter-bar">
      <div class="filter-left">
        <el-select
          v-model="statusFilter"
          placeholder="筛选状态"
          clearable
          @change="handleStatusFilter"
          style="width: 150px"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        
        <el-button @click="fetchComments" :loading="loading">
          刷新
        </el-button>
      </div>
      
      <!-- 批量操作按钮 -->
      <div class="batch-actions" v-if="selectedComments.length > 0">
        <span class="selected-info">已选择 {{ selectedComments.length }} 条评论</span>
        <el-button
          type="success"
          size="small"
          :loading="batchLoading"
          @click="batchApprove"
        >
          批量通过
        </el-button>
        <el-button
          type="warning"
          size="small"
          :loading="batchLoading"
          @click="batchReject"
        >
          批量拒绝
        </el-button>
        <el-button
          type="danger"
          size="small"
          :loading="batchLoading"
          @click="batchDelete"
        >
          批量删除
        </el-button>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comment-list">
      <el-table
        :data="comments"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="content" label="评论内容" min-width="300">
          <template #default="{ row }">
            <div class="comment-content">
              {{ row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="articleId" label="文章ID" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="120">
          <template #default="{ row }">
            <span :title="new Date(row.createdAt).toLocaleString()">
              {{ formatTime(row.createdAt) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <!-- 待审核状态显示审核按钮 -->
              <el-button
                v-if="row.status === 'PENDING'"
                type="success"
                size="small"
                @click="approveComment(row.id)"
              >
                通过
              </el-button>
              <el-button
                v-if="row.status === 'PENDING'"
                type="warning"
                size="small"
                @click="rejectComment(row.id)"
              >
                拒绝
              </el-button>
              
              <!-- 已通过状态可以重新拒绝 -->
              <el-button
                v-if="row.status === 'APPROVED'"
                type="warning"
                size="small"
                @click="rejectComment(row.id)"
              >
                拒绝
              </el-button>
              
              <!-- 已拒绝状态可以重新通过 -->
              <el-button
                v-if="row.status === 'REJECTED'"
                type="success"
                size="small"
                @click="approveComment(row.id)"
              >
                通过
              </el-button>
              
              <!-- 删除按钮始终显示 -->
              <el-button
                type="danger"
                size="small"
                @click="deleteComment(row.id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.comment-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.filter-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.batch-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background-color: #e3f2fd;
  border-radius: 6px;
  border: 1px solid #bbdefb;
}

.selected-info {
  font-size: 14px;
  color: #1976d2;
  font-weight: 500;
  margin-right: 10px;
}

.comment-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.comment-content {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>