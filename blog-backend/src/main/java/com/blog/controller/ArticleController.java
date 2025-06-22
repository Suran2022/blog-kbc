package com.blog.controller;

import com.blog.common.PageResult;
import com.blog.common.Result;
import com.blog.dto.ArticleDTO;
import com.blog.service.ArticleService;
import com.blog.vo.ArticleVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 文章控制器
 */
@Tag(name = "文章管理", description = "文章相关接口")
@RestController
@RequestMapping("/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    /**
     * 创建文章
     *
     * @param articleDTO 文章信息
     * @return 创建结果
     */
    @Operation(summary = "创建文章", description = "创建新文章")
    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<ArticleVO> createArticle(@Validated @RequestBody ArticleDTO articleDTO) {
        ArticleVO articleVO = articleService.createArticle(articleDTO);
        return Result.success(articleVO);
    }

    /**
     * 更新文章
     *
     * @param id         文章ID
     * @param articleDTO 文章信息
     * @return 更新结果
     */
    @Operation(summary = "更新文章", description = "根据ID更新文章信息")
    @PutMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<ArticleVO> updateArticle(@PathVariable Long id, @Validated @RequestBody ArticleDTO articleDTO) {
        ArticleVO articleVO = articleService.updateArticle(id, articleDTO);
        return Result.success(articleVO);
    }

    /**
     * 删除文章
     *
     * @param id 文章ID
     * @return 删除结果
     */
    @Operation(summary = "删除文章", description = "根据ID删除文章")
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @PreAuthorize("isAuthenticated()")
    public Result<?> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return Result.success();
    }

    /**
     * 获取文章详情
     *
     * @param id 文章ID
     * @return 文章详情
     */
    @Operation(summary = "获取文章详情", description = "根据ID获取文章详细信息")
    @GetMapping("/{id}")
    public Result<ArticleVO> getArticle(@PathVariable Long id) {
        ArticleVO articleVO = articleService.getArticle(id);
        return Result.success(articleVO);
    }

    /**
     * 分页获取文章列表
     *
     * @param page     页码
     * @param size     每页数量
     * @param keyword  关键字
     * @param category 分类ID
     * @param status   状态：0-草稿，1-已发布，不传则查询所有
     * @return 文章列表
     */
    @Operation(summary = "分页获取文章列表", description = "分页获取文章列表，支持关键字、分类和状态筛选")
    @GetMapping
    public Result<PageResult<ArticleVO>> getArticles(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Integer status) {
        PageResult<ArticleVO> pageResult = articleService.getArticles(page, size, keyword, category, status);
        return Result.success(pageResult);
    }

    /**
     * 获取最新文章列表
     *
     * @param limit 数量限制
     * @return 最新文章列表
     */
    @Operation(summary = "获取最新文章列表", description = "获取最新发布的文章列表")
    @GetMapping("/latest")
    public Result<List<ArticleVO>> getLatestArticles(@RequestParam(defaultValue = "5") Integer limit) {
        List<ArticleVO> articleVOList = articleService.getLatestArticles(limit);
        return Result.success(articleVOList);
    }

    /**
     * 获取热门文章列表
     *
     * @param limit 数量限制
     * @return 热门文章列表
     */
    @Operation(summary = "获取热门文章列表", description = "获取浏览量最高的文章列表")
    @GetMapping("/popular")
    public Result<List<ArticleVO>> getPopularArticles(@RequestParam(defaultValue = "5") Integer limit) {
        List<ArticleVO> articleVOList = articleService.getPopularArticles(limit);
        return Result.success(articleVOList);
    }
}