package com.blog.service;

import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CategoryRepository;
import com.blog.common.PageResult;
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

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ArticleServiceImpl articleService;

    private Article testArticle;
    private Category testCategory;

    @BeforeEach
    void setup() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("测试分类");

        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitle("测试文章");
        testArticle.setContent("测试内容");
        testArticle.setCategoryId(1L);
        testArticle.setCreateTime(new Date());
        testArticle.setUpdateTime(new Date());
    }

    @Test
    void testGetArticle() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        ArticleVO result = articleService.getArticle(1L);

        assertNotNull(result);
        assertEquals("测试文章", result.getTitle());
        verify(articleRepository).findById(1L);
    }

    @Test
    void testDeleteArticle() {
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));

        articleService.deleteArticle(1L);

        verify(articleRepository).delete(testArticle);
    }

    @Test
    void testGetArticles() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Article> articlePage = new PageImpl<>(Arrays.asList(testArticle));
        when(articleRepository.findAll(pageable)).thenReturn(articlePage);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        PageResult<ArticleVO> result = articleService.getArticles(1, 10, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.getTotal().intValue());
        verify(articleRepository).findAll(any(Pageable.class));
    }
}