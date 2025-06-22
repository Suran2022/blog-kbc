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
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>