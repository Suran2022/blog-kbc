<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { useSettingStore } from '../store/setting';
import Breadcrumb from '../components/admin/Breadcrumb.vue';

const router = useRouter();
const userStore = useUserStore();
const settingStore = useSettingStore();

// 侧边栏折叠状态
const isCollapse = ref(false);

// 用户信息
const username = computed(() => userStore.username);

// 站点信息
const siteInfo = computed(() => ({
  siteName: settingStore.siteName,
  siteLogo: settingStore.siteLogo
}));

// 组件挂载时获取设置
onMounted(async () => {
  try {
    await settingStore.fetchSettings();
  } catch (error) {
    console.warn('无法获取网站设置，使用默认值');
  }
});

// 菜单项
const menuItems = [
  {
    icon: 'Odometer',
    title: '控制台',
    index: '/admin',
    route: { name: 'Dashboard' }
  },
  {
    icon: 'Document',
    title: '文章管理',
    index: '/admin/articles',
    route: { name: 'ArticleList' }
  },
  {
    icon: 'Collection',
    title: '分类管理',
    index: '/admin/categories',
    route: { name: 'CategoryManagement' }
  },
  {
    icon: 'ChatDotRound',
    title: '评论管理',
    index: '/admin/comments',
    route: { name: 'CommentManagement' }
  },
  {
    icon: 'Setting',
    title: '系统设置',
    index: '/admin/settings',
    route: { name: 'SystemSettings' }
  }
];

// 处理菜单点击
const handleMenuSelect = (index, indexPath, item) => {
  const menuItem = menuItems.find(item => item.index === index);
  if (menuItem && menuItem.route) {
    router.push(menuItem.route);
  }
};

// 处理折叠侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};

// 处理登出
const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('登出失败:', error);
  }
};
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <!-- Logo -->
      <div class="logo-container">
        <div v-if="!isCollapse" class="logo">
          <img v-if="siteInfo.siteLogo" :src="siteInfo.siteLogo" :alt="siteInfo.siteName" class="logo-img" />
          <h1 v-else class="logo-text">{{ siteInfo.siteName }}后台</h1>
        </div>
        <div v-else class="logo-small">
          <img v-if="siteInfo.siteLogo" :src="siteInfo.siteLogo" :alt="siteInfo.siteName" class="logo-img-small" />
          <h1 v-else class="logo-text-small">{{ siteInfo.siteName.charAt(0) }}</h1>
        </div>
      </div>
      
      <!-- 菜单 -->
      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        @select="handleMenuSelect"
      >
        <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主要内容区 -->
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <Breadcrumb />
        </div>
        
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-dropdown">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push({ name: 'Home' })">
                  <el-icon><House /></el-icon>前台首页
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.admin-layout {
  height: 100%;
  display: flex;
}

.sidebar {
  background-color: #304156;
  height: 100%;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
}

.logo-img {
  height: 32px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
}

.logo-small {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text-small {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.logo-img-small {
  height: 24px;
  width: 24px;
  object-fit: contain;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: #606266;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
  height: calc(100% - 60px);
}
</style>