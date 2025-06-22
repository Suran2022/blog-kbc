package com.blog.service;

import com.blog.dto.SettingDTO;
import com.blog.vo.SettingVO;

/**
 * 系统设置服务接口
 */
public interface SettingService {

    /**
     * 获取系统设置
     *
     * @return 系统设置
     */
    SettingVO getSetting();

    /**
     * 更新系统设置
     *
     * @param settingDTO 系统设置信息
     * @return 更新后的系统设置
     */
    SettingVO updateSetting(SettingDTO settingDTO);
}