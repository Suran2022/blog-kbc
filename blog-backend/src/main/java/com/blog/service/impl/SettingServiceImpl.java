package com.blog.service.impl;

import com.blog.dto.SettingDTO;
import com.blog.entity.Setting;
import com.blog.repository.SettingRepository;
import com.blog.service.SettingService;
import com.blog.vo.SettingVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 系统设置服务实现类
 */
@Service
public class SettingServiceImpl implements SettingService {

    @Autowired
    private SettingRepository settingRepository;

    @Override
    public SettingVO getSetting() {
        // 获取系统设置
        Setting setting = settingRepository.findFirstByOrderById()
                .orElseGet(() -> {
                    // 如果不存在，则创建默认设置
                    Setting defaultSetting = new Setting();
                    defaultSetting.setSiteName("博客系统");
                    defaultSetting.setSiteDescription("一个简单的博客系统");
                    defaultSetting.setSiteKeywords("博客,技术,生活,编程");
                    defaultSetting.setSiteLogo("/uploads/default-logo.png");
                    defaultSetting.setSiteFavicon("/uploads/default-favicon.ico");
                    defaultSetting.setSiteIcp("");
                    defaultSetting.setSiteEmail("admin@example.com");
                    defaultSetting.setFooterInfo("© 2023 博客系统 版权所有");
                    defaultSetting.setAllowComments(true);
                    defaultSetting.setCommentAudit(true);
                    return settingRepository.save(defaultSetting);
                });

        return convertToVO(setting);
    }

    @Override
    @Transactional
    public SettingVO updateSetting(SettingDTO settingDTO) {
        // 获取系统设置
        Setting setting = settingRepository.findFirstByOrderById()
                .orElseGet(() -> new Setting());

        // 更新系统设置
        if (settingDTO.getSiteName() != null) {
            setting.setSiteName(settingDTO.getSiteName());
        }
        if (settingDTO.getSiteDescription() != null) {
            setting.setSiteDescription(settingDTO.getSiteDescription());
        }
        if (settingDTO.getSiteKeywords() != null) {
            setting.setSiteKeywords(settingDTO.getSiteKeywords());
        }
        if (settingDTO.getSiteLogo() != null) {
            setting.setSiteLogo(settingDTO.getSiteLogo());
        }
        if (settingDTO.getSiteFavicon() != null) {
            setting.setSiteFavicon(settingDTO.getSiteFavicon());
        }
        if (settingDTO.getSiteIcp() != null) {
            setting.setSiteIcp(settingDTO.getSiteIcp());
        }
        if (settingDTO.getSiteEmail() != null) {
            setting.setSiteEmail(settingDTO.getSiteEmail());
        }
        if (settingDTO.getFooterInfo() != null) {
            setting.setFooterInfo(settingDTO.getFooterInfo());
        }
        if (settingDTO.getAllowComments() != null) {
            setting.setAllowComments(settingDTO.getAllowComments());
        }
        if (settingDTO.getCommentAudit() != null) {
            setting.setCommentAudit(settingDTO.getCommentAudit());
        }

        // 保存系统设置
        settingRepository.save(setting);

        return convertToVO(setting);
    }

    /**
     * 将系统设置实体转换为VO
     *
     * @param setting 系统设置实体
     * @return 系统设置VO
     */
    private SettingVO convertToVO(Setting setting) {
        return SettingVO.builder()
                .id(setting.getId())
                .siteName(setting.getSiteName())
                .siteDescription(setting.getSiteDescription())
                .siteKeywords(setting.getSiteKeywords())
                .siteLogo(setting.getSiteLogo())
                .siteFavicon(setting.getSiteFavicon())
                .siteIcp(setting.getSiteIcp())
                .siteEmail(setting.getSiteEmail())
                .footerInfo(setting.getFooterInfo())
                .allowComments(setting.getAllowComments())
                .commentAudit(setting.getCommentAudit())
                .createTime(setting.getCreateTime())
                .updateTime(setting.getUpdateTime())
                .build();
    }
}