package com.blog.controller;

import com.blog.common.PageResult;
import com.blog.service.ArticleService;
import com.blog.vo.ArticleVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ArticleControllerTest {

    @Mock
    private ArticleService articleService;

    @InjectMocks
    private ArticleController articleController;

    private MockMvc mockMvc;
    private ArticleVO testArticleVO;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(articleController).build();

        testArticleVO = ArticleVO.builder()
                .id(1L)
                .title("测试文章")
                .content("测试内容")
                .categoryId(1L)
                .categoryName("测试分类")
                .viewCount(100)
                .createTime(new Date())
                .updateTime(new Date())
                .build();
    }

    @Test
    void testGetArticle() throws Exception {
        when(articleService.getArticle(anyLong())).thenReturn(testArticleVO);

        mockMvc.perform(get("/api/articles/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("测试文章"));
    }

    @Test
    void testGetArticles() throws Exception {
        PageResult<ArticleVO> pageResult = PageResult.of(0, 10, 1L, Arrays.asList(testArticleVO));
        when(articleService.getArticles(anyInt(), anyInt(), any(), any(), any())).thenReturn(pageResult);

        mockMvc.perform(get("/api/articles")
                        .param("page", "1")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list[0].title").value("测试文章"));
    }
}