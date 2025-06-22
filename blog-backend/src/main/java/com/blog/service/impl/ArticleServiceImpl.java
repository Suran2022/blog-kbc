package com.blog.service.impl;

import com.blog.common.PageResult;
import com.blog.dto.ArticleDTO;
import com.blog.entity.Article;
import com.blog.entity.Category;
import com.blog.exception.BlogException;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CategoryRepository;
import com.blog.security.JwtUserDetails;
import com.blog.service.ArticleService;
import com.blog.vo.ArticleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 文章服务实现类
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public ArticleVO createArticle(ArticleDTO articleDTO) {
        // 验证分类是否存在
        Category category = categoryRepository.findById(articleDTO.getCategoryId())
                .orElseThrow(() -> new BlogException("分类不存在"));

        // 创建文章
        Article article = new Article();
        article.setTitle(articleDTO.getTitle());
        article.setContent(articleDTO.getContent());
        article.setSummary(articleDTO.getSummary());
        article.setThumbnail(articleDTO.getThumbnail());
        article.setCategoryId(articleDTO.getCategoryId());
        article.setCategory(category);
        article.setViewCount(0);
        article.setStatus(articleDTO.getStatus() != null ? articleDTO.getStatus() : 1);

        // 保存文章
        articleRepository.save(article);

        return convertToVO(article);
    }

    @Override
    @Transactional
    public ArticleVO updateArticle(Long id, ArticleDTO articleDTO) {
        // 查询文章
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new BlogException("文章不存在"));

        // 验证分类是否存在
        if (articleDTO.getCategoryId() != null && !articleDTO.getCategoryId().equals(article.getCategoryId())) {
            Category category = categoryRepository.findById(articleDTO.getCategoryId())
                    .orElseThrow(() -> new BlogException("分类不存在"));
            article.setCategoryId(articleDTO.getCategoryId());
            article.setCategory(category);
        }

        // 更新文章
        if (articleDTO.getTitle() != null) {
            article.setTitle(articleDTO.getTitle());
        }
        if (articleDTO.getContent() != null) {
            article.setContent(articleDTO.getContent());
        }
        if (articleDTO.getSummary() != null) {
            article.setSummary(articleDTO.getSummary());
        }
        if (articleDTO.getThumbnail() != null) {
            article.setThumbnail(articleDTO.getThumbnail());
        }
        if (articleDTO.getStatus() != null) {
            article.setStatus(articleDTO.getStatus());
        }

        // 保存文章
        articleRepository.save(article);

        return convertToVO(article);
    }

    @Override
    @Transactional
    public void deleteArticle(Long id) {
        // 查询文章
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new BlogException("文章不存在"));

        // 删除文章
        articleRepository.delete(article);
    }

    @Override
    @Transactional
    public ArticleVO getArticle(Long id) {
        // 查询文章
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new BlogException("文章不存在"));

        // 增加浏览量
        articleRepository.incrementViewCount(id);

        return convertToVO(article);
    }

    @Override
    public PageResult<ArticleVO> getArticles(Integer page, Integer size, String keyword, Long category, Integer status) {
        // 创建分页请求
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createTime"));

        // 查询文章
        Page<Article> articlePage;
        if (status != null) {
            // 根据状态筛选
            if (category != null) {
                // 根据分类和状态筛选
                if (StringUtils.hasText(keyword)) {
                    // 根据关键词、分类和状态筛选
                    articlePage = articleRepository.findByCategoryIdAndTitleOrContentContainingAndStatus(category, keyword, status, pageable);
                } else {
                    // 根据分类和状态筛选
                    articlePage = articleRepository.findByCategoryIdAndStatus(category, status, pageable);
                }
            } else {
                // 只根据状态筛选
                if (StringUtils.hasText(keyword)) {
                    // 根据关键词和状态筛选
                    articlePage = articleRepository.findByTitleOrContentContainingAndStatus(keyword, status, pageable);
                } else {
                    // 只根据状态筛选
                    articlePage = articleRepository.findByStatus(status, pageable);
                }
            }
        } else {
            // 不根据状态筛选（查询所有状态）
            if (category != null) {
                if (StringUtils.hasText(keyword)) {
                    articlePage = articleRepository.findByCategoryIdAndTitleContainingOrContentContaining(category, keyword, keyword, pageable);
                } else {
                    articlePage = articleRepository.findByCategoryId(category, pageable);
                }
            } else {
                if (StringUtils.hasText(keyword)) {
                    articlePage = articleRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
                } else {
                    articlePage = articleRepository.findAll(pageable);
                }
            }
        }

        // 转换为VO
        List<ArticleVO> articleVOList = articlePage.getContent().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        // 创建分页结果
        return new PageResult<>(page, size, articlePage.getTotalElements(), articleVOList);
    }

    @Override
    public List<ArticleVO> getLatestArticles(Integer limit) {
        // 查询最新文章
        List<Article> articleList = articleRepository.findLatestArticles(limit);

        // 转换为VO
        return articleList.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleVO> getPopularArticles(Integer limit) {
        // 查询热门文章
        List<Article> articleList = articleRepository.findPopularArticles(limit);

        // 转换为VO
        return articleList.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    /**
     * 将文章实体转换为VO
     *
     * @param article 文章实体
     * @return 文章VO
     */
    private ArticleVO convertToVO(Article article) {
        return ArticleVO.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .summary(article.getSummary())
                .thumbnail(article.getThumbnail())
                .categoryId(article.getCategoryId())
                .categoryName(article.getCategory() != null ? article.getCategory().getName() : null)
                .viewCount(article.getViewCount())
                .status(article.getStatus())
                .createTime(article.getCreateTime())
                .updateTime(article.getUpdateTime())
                .build();
    }
}