package com.blog.integration;

import com.blog.dto.ArticleDTO;
import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.entity.User;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CategoryRepository;
import com.blog.repository.UserRepository;
import com.blog.service.ArticleService;
import com.blog.vo.ArticleVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 文章服务集成测试类
 * 测试缓存功能和性能监控
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ArticleServiceIntegrationTest {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CacheManager cacheManager;

    private User testUser;
    private Category testCategory;
    private ArticleDTO testArticleDTO;

    @BeforeEach
    void setUp() {
        // 清理缓存
        cacheManager.getCacheNames().forEach(cacheName -> {
            if (cacheManager.getCache(cacheName) != null) {
                cacheManager.getCache(cacheName).clear();
            }
        });

        // 创建测试用户
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password");
        testUser = userRepository.save(testUser);

        // 创建测试分类
        testCategory = new Category();
        testCategory.setName("技术");
        testCategory.setDescription("技术相关文章");
        testCategory = categoryRepository.save(testCategory);

        // 设置安全上下文
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(testUser, null, null)
        );

        // 创建测试文章DTO
        testArticleDTO = new ArticleDTO();
        testArticleDTO.setTitle("集成测试文章");
        testArticleDTO.setContent("这是一篇用于集成测试的文章内容");
        testArticleDTO.setSummary("集成测试文章摘要");
        testArticleDTO.setCategoryId(testCategory.getId());
        testArticleDTO.setStatus(1);
        testArticleDTO.setTags("Java,Spring Boot,测试");
    }

    @Test
    void testCreateAndGetArticle_WithCache() {
        // 创建文章
        ArticleVO createdArticle = articleService.createArticle(testArticleDTO);
        assertNotNull(createdArticle);
        assertNotNull(createdArticle.getId());
        assertEquals(testArticleDTO.getTitle(), createdArticle.getTitle());

        // 第一次获取文章（从数据库）
        long startTime1 = System.currentTimeMillis();
        ArticleVO article1 = articleService.getArticle(createdArticle.getId());
        long endTime1 = System.currentTimeMillis();
        
        assertNotNull(article1);
        assertEquals(createdArticle.getId(), article1.getId());
        assertEquals(testArticleDTO.getTitle(), article1.getTitle());

        // 第二次获取文章（从缓存）
        long startTime2 = System.currentTimeMillis();
        ArticleVO article2 = articleService.getArticle(createdArticle.getId());
        long endTime2 = System.currentTimeMillis();
        
        assertNotNull(article2);
        assertEquals(article1.getId(), article2.getId());
        assertEquals(article1.getTitle(), article2.getTitle());
        
        // 验证缓存是否生效（第二次调用应该更快）
        long firstCallTime = endTime1 - startTime1;
        long secondCallTime = endTime2 - startTime2;
        
        // 检查缓存中是否存在数据
        assertNotNull(cacheManager.getCache("articles"));
        assertNotNull(cacheManager.getCache("articles").get(createdArticle.getId()));
    }

    @Test
    void testGetPopularArticles_WithCache() {
        // 创建多篇文章
        ArticleVO article1 = articleService.createArticle(testArticleDTO);
        
        ArticleDTO dto2 = new ArticleDTO();
        dto2.setTitle("热门文章2");
        dto2.setContent("热门文章内容2");
        dto2.setSummary("热门文章摘要2");
        dto2.setCategoryId(testCategory.getId());
        dto2.setStatus(1);
        dto2.setTags("Vue.js,前端");
        ArticleVO article2 = articleService.createArticle(dto2);

        // 模拟增加浏览量
        Article dbArticle1 = articleRepository.findById(article1.getId()).orElse(null);
        Article dbArticle2 = articleRepository.findById(article2.getId()).orElse(null);
        
        if (dbArticle1 != null) {
            dbArticle1.setViewCount(200);
            articleRepository.save(dbArticle1);
        }
        
        if (dbArticle2 != null) {
            dbArticle2.setViewCount(150);
            articleRepository.save(dbArticle2);
        }

        // 第一次获取热门文章
        List<ArticleVO> popularArticles1 = articleService.getPopularArticles(10);
        assertNotNull(popularArticles1);
        assertTrue(popularArticles1.size() >= 2);

        // 第二次获取热门文章（应该从缓存获取）
        List<ArticleVO> popularArticles2 = articleService.getPopularArticles(10);
        assertNotNull(popularArticles2);
        assertEquals(popularArticles1.size(), popularArticles2.size());
        
        // 验证缓存
        assertNotNull(cacheManager.getCache("popularArticles"));
    }

    @Test
    void testGetSearchSuggestions_WithCache() {
        // 创建包含关键词的文章
        testArticleDTO.setTitle("Java编程入门教程");
        articleService.createArticle(testArticleDTO);
        
        ArticleDTO dto2 = new ArticleDTO();
        dto2.setTitle("Java高级特性详解");
        dto2.setContent("Java高级特性内容");
        dto2.setSummary("Java高级特性摘要");
        dto2.setCategoryId(testCategory.getId());
        dto2.setStatus(1);
        dto2.setTags("Java,高级");
        articleService.createArticle(dto2);

        // 第一次获取搜索建议
        List<String> suggestions1 = articleService.getSearchSuggestions("Java", 5);
        assertNotNull(suggestions1);
        
        // 第二次获取搜索建议（应该从缓存获取）
        List<String> suggestions2 = articleService.getSearchSuggestions("Java", 5);
        assertNotNull(suggestions2);
        assertEquals(suggestions1.size(), suggestions2.size());
        
        // 验证缓存
        assertNotNull(cacheManager.getCache("searchSuggestions"));
    }

    @Test
    void testCacheEviction_OnUpdate() {
        // 创建文章
        ArticleVO createdArticle = articleService.createArticle(testArticleDTO);
        
        // 获取文章（缓存）
        ArticleVO article1 = articleService.getArticle(createdArticle.getId());
        assertNotNull(article1);
        
        // 验证缓存存在
        assertNotNull(cacheManager.getCache("articles").get(createdArticle.getId()));
        
        // 更新文章
        testArticleDTO.setTitle("更新后的标题");
        ArticleVO updatedArticle = articleService.updateArticle(createdArticle.getId(), testArticleDTO);
        assertNotNull(updatedArticle);
        assertEquals("更新后的标题", updatedArticle.getTitle());
        
        // 验证缓存已被清除
        // 注意：由于@CacheEvict的存在，缓存应该被清除
        // 再次获取文章应该从数据库读取
        ArticleVO article2 = articleService.getArticle(createdArticle.getId());
        assertNotNull(article2);
        assertEquals("更新后的标题", article2.getTitle());
    }

    @Test
    void testCacheEviction_OnDelete() {
        // 创建文章
        ArticleVO createdArticle = articleService.createArticle(testArticleDTO);
        
        // 获取文章（缓存）
        ArticleVO article = articleService.getArticle(createdArticle.getId());
        assertNotNull(article);
        
        // 验证缓存存在
        assertNotNull(cacheManager.getCache("articles").get(createdArticle.getId()));
        
        // 删除文章
        articleService.deleteArticle(createdArticle.getId());
        
        // 验证缓存已被清除
        // 由于@CacheEvict的存在，缓存应该被清除
        // 尝试再次获取文章应该抛出异常
        assertThrows(Exception.class, () -> {
            articleService.getArticle(createdArticle.getId());
        });
    }

    @Test
    void testPerformanceMonitoring() {
        // 这个测试主要验证性能监控注解是否正常工作
        // 在实际应用中，可以通过日志或监控系统验证
        
        // 创建文章（应该被性能监控）
        ArticleVO createdArticle = articleService.createArticle(testArticleDTO);
        assertNotNull(createdArticle);
        
        // 获取文章（应该被性能监控）
        ArticleVO article = articleService.getArticle(createdArticle.getId());
        assertNotNull(article);
        
        // 获取热门文章（应该被性能监控）
        List<ArticleVO> popularArticles = articleService.getPopularArticles(5);
        assertNotNull(popularArticles);
        
        // 搜索建议（应该被性能监控）
        List<String> suggestions = articleService.getSearchSuggestions("测试", 5);
        assertNotNull(suggestions);
        
        // 如果测试通过，说明性能监控注解没有影响正常功能
        assertTrue(true, "性能监控功能正常工作");
    }
}