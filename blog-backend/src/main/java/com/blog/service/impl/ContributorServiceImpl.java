package com.blog.service.impl;

import com.blog.dto.ContributorDTO;
import com.blog.entity.Contributor;
import com.blog.exception.BlogException;
import com.blog.repository.ContributorRepository;
import com.blog.service.ContributorService;
import com.blog.vo.ContributorVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 贡献者服务实现类
 */
@Service
public class ContributorServiceImpl implements ContributorService {

    @Autowired
    private ContributorRepository contributorRepository;

    @Override
    @Transactional
    public ContributorVO createContributor(ContributorDTO contributorDTO) {
        // 检查贡献者名称是否已存在
        if (contributorRepository.existsByName(contributorDTO.getName())) {
            throw new BlogException("贡献者名称已存在");
        }

        // 创建贡献者
        Contributor contributor = new Contributor();
        contributor.setName(contributorDTO.getName());
        contributor.setAvatar(contributorDTO.getAvatar());
        contributor.setIntroduction(contributorDTO.getIntroduction());
        contributor.setSort(contributorDTO.getSort() != null ? contributorDTO.getSort() : 0);
        contributor.setStatus(contributorDTO.getStatus() != null ? contributorDTO.getStatus() : 1);

        // 保存贡献者
        contributorRepository.save(contributor);

        return convertToVO(contributor);
    }

    @Override
    @Transactional
    public ContributorVO updateContributor(Long id, ContributorDTO contributorDTO) {
        // 查询贡献者
        Contributor contributor = contributorRepository.findById(id)
                .orElseThrow(() -> new BlogException("贡献者不存在"));

        // 检查贡献者名称是否已存在
        if (contributorDTO.getName() != null && !contributorDTO.getName().equals(contributor.getName())) {
            if (contributorRepository.existsByNameAndIdNot(contributorDTO.getName(), id)) {
                throw new BlogException("贡献者名称已存在");
            }
            contributor.setName(contributorDTO.getName());
        }

        // 更新贡献者
        if (contributorDTO.getAvatar() != null) {
            contributor.setAvatar(contributorDTO.getAvatar());
        }
        if (contributorDTO.getIntroduction() != null) {
            contributor.setIntroduction(contributorDTO.getIntroduction());
        }
        if (contributorDTO.getSort() != null) {
            contributor.setSort(contributorDTO.getSort());
        }
        if (contributorDTO.getStatus() != null) {
            contributor.setStatus(contributorDTO.getStatus());
        }

        // 保存贡献者
        contributorRepository.save(contributor);

        return convertToVO(contributor);
    }

    @Override
    @Transactional
    public void deleteContributor(Long id) {
        // 查询贡献者
        Contributor contributor = contributorRepository.findById(id)
                .orElseThrow(() -> new BlogException("贡献者不存在"));

        // 删除贡献者
        contributorRepository.delete(contributor);
    }

    @Override
    public ContributorVO getContributor(Long id) {
        // 查询贡献者
        Contributor contributor = contributorRepository.findById(id)
                .orElseThrow(() -> new BlogException("贡献者不存在"));

        return convertToVO(contributor);
    }

    @Override
    public List<ContributorVO> getAllContributors() {
        // 查询所有可用贡献者
        List<Contributor> contributorList = contributorRepository.findByStatus(1, Sort.by(Sort.Direction.ASC, "sort"));

        // 转换为VO
        return contributorList.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    /**
     * 将贡献者实体转换为VO
     *
     * @param contributor 贡献者实体
     * @return 贡献者VO
     */
    private ContributorVO convertToVO(Contributor contributor) {
        return ContributorVO.builder()
                .id(contributor.getId())
                .name(contributor.getName())
                .avatar(contributor.getAvatar())
                .introduction(contributor.getIntroduction())
                .sort(contributor.getSort())
                .status(contributor.getStatus())
                .createTime(contributor.getCreateTime())
                .updateTime(contributor.getUpdateTime())
                .build();
    }
}