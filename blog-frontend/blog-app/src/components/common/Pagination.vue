<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50]
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'pagination']);

// 计算属性：当前页码
const currentPageValue = computed({
  get: () => props.currentPage,
  set: (val) => {
    emit('update:currentPage', val);
    emit('pagination', { page: val, limit: props.pageSize });
  }
});

// 计算属性：每页条数
const pageSizeValue = computed({
  get: () => props.pageSize,
  set: (val) => {
    emit('update:pageSize', val);
    emit('pagination', { page: 1, limit: val });
  }
});

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize);
});
</script>

<template>
  <div class="pagination-container" v-if="total > 0">
    <el-pagination
      v-model:current-page="currentPageValue"
      v-model:page-size="pageSizeValue"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      :background="background"
    />
  </div>
</template>

<style scoped>
.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.05), rgba(94, 114, 228, 0.02));
  border-radius: 12px;
  border: 1px solid rgba(94, 114, 228, 0.08);
}

.pagination-container :deep(.el-pagination) {
  background: transparent;
}

.pagination-container :deep(.el-pagination .el-pager li) {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(94, 114, 228, 0.1);
  border-radius: 8px;
  margin: 0 4px;
  transition: all 0.3s ease;
}

.pagination-container :deep(.el-pagination .el-pager li:hover) {
  background: rgba(94, 114, 228, 0.1);
  border-color: rgba(94, 114, 228, 0.3);
  transform: translateY(-1px);
}

.pagination-container :deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
}

.pagination-container :deep(.el-pagination .btn-prev),
.pagination-container :deep(.el-pagination .btn-next) {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(94, 114, 228, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pagination-container :deep(.el-pagination .btn-prev:hover),
.pagination-container :deep(.el-pagination .btn-next:hover) {
  background: rgba(94, 114, 228, 0.1);
  border-color: rgba(94, 114, 228, 0.3);
  transform: translateY(-1px);
}
</style>