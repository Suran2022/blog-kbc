<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useContributorStore } from '../../store/contributor';
import { ElMessageBox } from 'element-plus';

const props = defineProps({
  title: {
    type: String,
    default: '贡献者'
  },
  limit: {
    type: Number,
    default: 5
  }
});

const router = useRouter();
const contributorStore = useContributorStore();
const loading = ref(false);

// 获取贡献者列表
const fetchContributors = async () => {
  loading.value = true;
  try {
    await contributorStore.fetchContributors();
  } catch (error) {
    console.error('获取贡献者列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 显示贡献者详情
const showContributorDetail = (contributor) => {
  // 这里可以实现跳转到贡献者详情页，或者显示一个弹窗
  // 暂时使用弹窗显示贡献者详情
  ElMessageBox.alert(
    `<div class="contributor-detail">
      <div class="contributor-bio">${contributor.bio}</div>
      <div class="contributor-contributions">
        <h4>主要贡献：</h4>
        <ul>
          ${contributor.contributions.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="contributor-links">
        ${contributor.github ? `<a href="${contributor.github}" target="_blank">GitHub</a>` : ''}
        ${contributor.website ? `<a href="${contributor.website}" target="_blank">个人网站</a>` : ''}
        ${contributor.email ? `<a href="mailto:${contributor.email}">邮箱</a>` : ''}
      </div>
    </div>`,
    contributor.name,
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      callback: () => {}
    }
  );
};

onMounted(() => {
  fetchContributors();
});
</script>

<template>
  <div class="contributor-list-container">
    <h3 class="contributor-list-title">{{ title }}</h3>
    <el-divider />
    <el-skeleton :rows="limit" animated v-if="loading" />
    <div v-else-if="contributorStore.contributors.length > 0" class="contributor-list">
      <div 
        v-for="contributor in contributorStore.contributors.slice(0, limit)" 
        :key="contributor.id"
        class="contributor-item"
        @click="showContributorDetail(contributor)"
      >
        <el-avatar :size="40" :src="contributor.avatar" class="contributor-avatar" />
        <div class="contributor-info">
          <div class="contributor-name">{{ contributor.name }}</div>
          <div class="contributor-role">{{ contributor.role }}</div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无贡献者" :image-size="60" />
  </div>
</template>

<style scoped>
.contributor-list-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.contributor-list-container:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
}

.contributor-list-title {
  font-size: 18px;
  font-weight: 600;
  color: #32325d;
  margin: 0 0 12px 0;
  position: relative;
  padding-bottom: 8px;
}

.contributor-list-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

.contributor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contributor-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contributor-item:hover {
  background-color: rgba(94, 114, 228, 0.05);
  transform: translateX(3px);
}

.contributor-avatar {
  margin-right: 12px;
  border: 2px solid rgba(94, 114, 228, 0.2);
  transition: all 0.3s ease;
}

.contributor-item:hover .contributor-avatar {
  border-color: rgba(94, 114, 228, 0.5);
  transform: scale(1.05);
}

.contributor-info {
  flex: 1;
}

.contributor-name {
  font-size: 14px;
  font-weight: 500;
  color: #32325d;
  margin-bottom: 2px;
  transition: color 0.3s ease;
}

.contributor-item:hover .contributor-name {
  color: #5e72e4;
}

.contributor-role {
  font-size: 12px;
  color: #8898aa;
}

/* 贡献者详情弹窗样式 */
:deep(.contributor-detail) {
  padding: 10px 0;
}

:deep(.contributor-bio) {
  margin-bottom: 15px;
  line-height: 1.5;
}

:deep(.contributor-contributions) {
  margin-bottom: 15px;
}

:deep(.contributor-contributions h4) {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #32325d;
}

:deep(.contributor-contributions ul) {
  margin: 0;
  padding-left: 20px;
}

:deep(.contributor-contributions li) {
  margin-bottom: 5px;
}

:deep(.contributor-links) {
  display: flex;
  gap: 15px;
}

:deep(.contributor-links a) {
  color: #5e72e4;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

:deep(.contributor-links a:hover) {
  color: #825ee4;
  text-decoration: underline;
}
</style>