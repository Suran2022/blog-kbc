import { createRouter, createWebHistory } from 'vue-router';

// 前台路由
const frontRoutes = [
  {
    path: '/',
    component: () => import('../layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/front/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('../views/front/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'search',
        name: 'SearchResult',
        component: () => import('../views/front/SearchResults.vue'),
        meta: { title: '搜索结果' }
      },
      {
        path: 'category/:id',
        name: 'CategoryArticles',
        component: () => import('../views/front/CategoryArticles.vue'),
        meta: { title: '分类文章' }
      }
    ]
  }
];

// 后台路由
const adminRoutes = [
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('../views/admin/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: '控制台', requiresAuth: true }
      },
      {
        path: 'articles',
        name: 'ArticleList',
        component: () => import('../views/admin/ArticleList.vue'),
        meta: { title: '文章管理', requiresAuth: true }
      },
      {
        path: 'articles/create',
        name: 'ArticleCreate',
        component: () => import('../views/admin/ArticleEdit.vue'),
        meta: { title: '创建文章', requiresAuth: true }
      },
      {
        path: 'articles/edit/:id?',
        name: 'ArticleEdit',
        component: () => import('../views/admin/ArticleEdit.vue'),
        meta: { title: '编辑文章', requiresAuth: true }
      },
      {
        path: 'categories',
        name: 'CategoryManagement',
        component: () => import('../views/admin/CategoryManagement.vue'),
        meta: { title: '分类管理', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('../views/admin/SystemSettings.vue'),
        meta: { title: '系统设置', requiresAuth: true }
      }
    ]
  }
];

const routes = [...frontRoutes, ...adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 博客系统` : '博客系统';
  
  // 权限验证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
  }
  next();
});

export default router;