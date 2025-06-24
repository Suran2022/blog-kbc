package com.blog.service;

import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.entity.User;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CategoryRepository;
import com.blog.common.PageResult;
import com.blog.dto.ArticleDTO;
import com.blog.exception.BlogException;
import com.blog.service.impl.ArticleServiceImpl;
import com.blog.vo.ArticleVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ArticleServiceImpl articleService;

    private Article testArticle;
    private Category testCategory;
    private User testUser;
    private ArticleDTO testArticleDTO;

    @BeforeEach
    void setup() {
        // 设置测试用户
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("测试分类");
        testCategory.setDescription("测试分类描述");

        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitle("测试文章");
        testArticle.setContent("测试内容");
        testArticle.setSummary("测试摘要");
        testArticle.setCategoryId(1L);
        testArticle.setCategory(testCategory);
        testArticle.setStatus(1);
        testArticle.setViewCount(100);
        testArticle.setTags("Java,Spring Boot");
        testArticle.setCreateTime(new Date());
        testArticle.setUpdateTime(new Date());

        testArticleDTO = new ArticleDTO();
        testArticleDTO.setTitle("新文章");
        testArticleDTO.setContent("新文章内容");
        testArticleDTO.setSummary("新文章摘要");
        testArticleDTO.setCategoryId(1L);
        testArticleDTO.setStatus(1);
        testArticleDTO.setTags("Java,Spring");

        // Mock Security Context
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testUser);
    }

    @Test
    void testGetArticle_Success() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        ArticleVO result = articleService.getArticle(1L);

        assertNotNull(result);
        assertEquals("测试文章", result.getTitle());
        verify(articleRepository).findById(1L);
    }

    @Test
    void testGetArticle_NotFound() {
        // Given
        when(articleRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        BlogException exception = assertThrows(BlogException.class, () -> {
            articleService.getArticle(1L);
        });
        assertEquals("文章不存在", exception.getMessage());
    }

    @Test
    void testDeleteArticle() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));

        articleService.deleteArticle(1L);

        verify(articleRepository).delete(testArticle);
    }

    @Test
    void testCreateArticle_Success() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(articleRepository.save(any(Article.class))).thenReturn(testArticle);

        // When
        ArticleVO result = articleService.createArticle(testArticleDTO);

        // Then
        assertNotNull(result);
        assertEquals(testArticle.getTitle(), result.getTitle());
        verify(categoryRepository).findById(1L);
        verify(articleRepository).save(any(Article.class));
    }

    @Test
    void testCreateArticle_CategoryNotFound() {
        // Given
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        BlogException exception = assertThrows(BlogException.class, () -> {
            articleService.createArticle(testArticleDTO);
        });
        assertEquals("分类不存在", exception.getMessage());
    }

    @Test
    void testUpdateArticle_Success() {
        // Given
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(articleRepository.save(any(Article.class))).thenReturn(testArticle);

        // When
        ArticleVO result = articleService.updateArticle(1L, testArticleDTO);

        // Then
        assertNotNull(result);
        verify(articleRepository).findById(1L);
        verify(categoryRepository).findById(1L);
        verify(articleRepository).save(any(Article.class));
    }

    @Test
    void testGetArticles() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Article> articlePage = new PageImpl<>(Arrays.asList(testArticle));
        when(articleRepository.findByStatusOrderByCreateTimeDesc(eq(1), any(Pageable.class))).thenReturn(articlePage);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        PageResult<ArticleVO> result = articleService.getArticles(1, 10, null, null, 1);

        assertNotNull(result);
        assertEquals(1, result.getTotal().intValue());
        verify(articleRepository).findByStatusOrderByCreateTimeDesc(eq(1), any(Pageable.class));
    }

    @Test
    void testGetPopularArticles() {
        // Given
        List<Article> articles = Arrays.asList(testArticle);
        when(articleRepository.findTop10ByStatusOrderByViewCountDesc(1)).thenReturn(articles);

        // When
        List<ArticleVO> result = articleService.getPopularArticles(10);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(articleRepository).findTop10ByStatusOrderByViewCountDesc(1);
    }

    @Test
    void testSearchArticles() {
        // Given
        List<Article> articles = Arrays.asList(testArticle);
        Page<Article> articlePage = new PageImpl<>(articles, PageRequest.of(0, 10), 1);
        when(articleRepository.findByTitleContainingIgnoreCaseAndStatusOrderByCreateTimeDesc(
                eq("测试"), eq(1), any(Pageable.class))).thenReturn(articlePage);

        // When
        PageResult<ArticleVO> result = articleService.searchArticles("测试", null, 1, 10, "createTime", "desc");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotal());
        verify(articleRepository).findByTitleContainingIgnoreCaseAndStatusOrderByCreateTimeDesc(
                eq("测试"), eq(1), any(Pageable.class));
    }

    @Test
    void testGetSearchSuggestions() {
        // Given
        List<String> suggestions = Arrays.asList("Java教程", "Java基础");
        when(articleRepository.findTitleSuggestions("Java", 5)).thenReturn(suggestions);

        // When
        List<String> result = articleService.getSearchSuggestions("Java", 5);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(articleRepository).findTitleSuggestions("Java", 5);
    }

    @Test
    void testGetHotSearchKeywords() {
        // Given
        List<String> hotKeywords = Arrays.asList("Java", "Spring", "Vue.js");
        when(articleRepository.findHotSearchKeywords(10)).thenReturn(hotKeywords);

        // When
        List<String> result = articleService.getHotSearchKeywords(10);

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
        verify(articleRepository).findHotSearchKeywords(10);
    }
}