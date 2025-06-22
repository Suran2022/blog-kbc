package com.blog.service;

import com.blog.dto.ContributorDTO;
import com.blog.vo.ContributorVO;

import java.util.List;

/**
 * 贡献者服务接口
 */
public interface ContributorService {

    /**
     * 创建贡献者
     *
     * @param contributorDTO 贡献者信息
     * @return 创建的贡献者
     */
    ContributorVO createContributor(ContributorDTO contributorDTO);

    /**
     * 更新贡献者
     *
     * @param id             贡献者ID
     * @param contributorDTO 贡献者信息
     * @return 更新后的贡献者
     */
    ContributorVO updateContributor(Long id, ContributorDTO contributorDTO);

    /**
     * 删除贡献者
     *
     * @param id 贡献者ID
     */
    void deleteContributor(Long id);

    /**
     * 获取贡献者详情
     *
     * @param id 贡献者ID
     * @return 贡献者详情
     */
    ContributorVO getContributor(Long id);

    /**
     * 获取所有贡献者
     *
     * @return 贡献者列表
     */
    List<ContributorVO> getAllContributors();
}