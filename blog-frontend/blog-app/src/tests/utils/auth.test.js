import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 模拟 localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  configurable: true
});

// 模拟 sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(global, 'sessionStorage', {
  value: mockSessionStorage,
  configurable: true
});

// 模拟 window.location
const mockLocation = {
  href: '',
  pathname: '',
  search: '',
  hash: ''
};
Object.defineProperty(global, 'window', {
  value: {
    location: mockLocation
  },
  configurable: true
});

// 模拟 jwt-decode
vi.mock('jwt-decode', () => ({
  default: vi.fn()
}));

// 模拟认证相关的工具函数
const authUtils = {
  // Token 管理
  setToken: (token, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
  
  // 用户信息管理
  setUserInfo: (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },
  
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  removeUserInfo: () => {
    localStorage.removeItem('userInfo');
  },
  
  // Token 验证
  isTokenValid: (token) => {
    if (!token) return false;
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  
  // 权限检查
  hasPermission: (permission, userPermissions = []) => {
    return userPermissions.includes(permission);
  },
  
  hasRole: (role, userRoles = []) => {
    return userRoles.includes(role);
  },
  
  // 登出
  logout: () => {
    authUtils.removeToken();
    authUtils.removeUserInfo();
    window.location.href = '/login';
  },
  
  // 检查认证状态
  isAuthenticated: () => {
    const token = authUtils.getToken();
    return token && authUtils.isTokenValid(token);
  }
};

describe('认证工具函数测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockSessionStorage.getItem.mockReturnValue(null);
    mockLocation.href = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Token 管理', () => {
    it('应该设置 Token 到 localStorage（记住我）', () => {
      const token = 'test-token-123';
      
      authUtils.setToken(token, true);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', token);
    });

    it('应该设置 Token 到 sessionStorage（不记住我）', () => {
      const token = 'test-token-456';
      
      authUtils.setToken(token, false);
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('token', token);
    });

    it('应该从 localStorage 获取 Token', () => {
      const token = 'stored-token-123';
      mockLocalStorage.getItem.mockReturnValue(token);
      
      const result = authUtils.getToken();
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
      expect(result).toBe(token);
    });

    it('应该从 sessionStorage 获取 Token（当 localStorage 为空时）', () => {
      const token = 'session-token-456';
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockReturnValue(token);
      
      const result = authUtils.getToken();
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('token');
      expect(result).toBe(token);
    });

    it('应该移除所有存储的 Token', () => {
      authUtils.removeToken();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('应该在没有 Token 时返回 null', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockReturnValue(null);
      
      const result = authUtils.getToken();
      
      expect(result).toBeNull();
    });
  });

  describe('用户信息管理', () => {
    it('应该设置用户信息', () => {
      const userInfo = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user']
      };
      
      authUtils.setUserInfo(userInfo);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'userInfo',
        JSON.stringify(userInfo)
      );
    });

    it('应该获取用户信息', () => {
      const userInfo = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(userInfo));
      
      const result = authUtils.getUserInfo();
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('userInfo');
      expect(result).toEqual(userInfo);
    });

    it('应该在没有用户信息时返回 null', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = authUtils.getUserInfo();
      
      expect(result).toBeNull();
    });

    it('应该处理无效的 JSON 用户信息', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      expect(() => authUtils.getUserInfo()).toThrow();
    });

    it('应该移除用户信息', () => {
      authUtils.removeUserInfo();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userInfo');
    });
  });

  describe('Token 验证', () => {
    it('应该验证有效的 Token', () => {
      // 创建一个未过期的 JWT payload
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1小时后过期
      const payload = { exp: futureTime, userId: 1 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;
      
      const result = authUtils.isTokenValid(token);
      
      expect(result).toBe(true);
    });

    it('应该拒绝过期的 Token', () => {
      // 创建一个已过期的 JWT payload
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1小时前过期
      const payload = { exp: pastTime, userId: 1 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;
      
      const result = authUtils.isTokenValid(token);
      
      expect(result).toBe(false);
    });

    it('应该拒绝无效格式的 Token', () => {
      const invalidToken = 'invalid-token-format';
      
      const result = authUtils.isTokenValid(invalidToken);
      
      expect(result).toBe(false);
    });

    it('应该拒绝空 Token', () => {
      const result = authUtils.isTokenValid(null);
      
      expect(result).toBe(false);
    });

    it('应该拒绝无效 JSON 的 Token', () => {
      const invalidPayload = btoa('invalid-json');
      const token = `header.${invalidPayload}.signature`;
      
      const result = authUtils.isTokenValid(token);
      
      expect(result).toBe(false);
    });
  });

  describe('权限检查', () => {
    it('应该检查用户是否有特定权限', () => {
      const userPermissions = ['read', 'write', 'delete'];
      
      expect(authUtils.hasPermission('read', userPermissions)).toBe(true);
      expect(authUtils.hasPermission('admin', userPermissions)).toBe(false);
    });

    it('应该处理空权限数组', () => {
      const result = authUtils.hasPermission('read', []);
      
      expect(result).toBe(false);
    });

    it('应该处理未定义的权限数组', () => {
      const result = authUtils.hasPermission('read');
      
      expect(result).toBe(false);
    });

    it('应该检查用户是否有特定角色', () => {
      const userRoles = ['user', 'editor', 'moderator'];
      
      expect(authUtils.hasRole('editor', userRoles)).toBe(true);
      expect(authUtils.hasRole('admin', userRoles)).toBe(false);
    });

    it('应该处理空角色数组', () => {
      const result = authUtils.hasRole('user', []);
      
      expect(result).toBe(false);
    });

    it('应该处理未定义的角色数组', () => {
      const result = authUtils.hasRole('user');
      
      expect(result).toBe(false);
    });
  });

  describe('认证状态检查', () => {
    it('应该在有有效 Token 时返回已认证', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, userId: 1 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;
      
      mockLocalStorage.getItem.mockReturnValue(token);
      
      const result = authUtils.isAuthenticated();
      
      expect(result).toBe(true);
    });

    it('应该在没有 Token 时返回未认证', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockReturnValue(null);
      
      const result = authUtils.isAuthenticated();
      
      expect(result).toBe(false);
    });

    it('应该在 Token 过期时返回未认证', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = { exp: pastTime, userId: 1 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;
      
      mockLocalStorage.getItem.mockReturnValue(token);
      
      const result = authUtils.isAuthenticated();
      
      expect(result).toBe(false);
    });
  });

  describe('登出功能', () => {
    it('应该清除所有认证信息并重定向', () => {
      authUtils.logout();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userInfo');
      expect(mockLocation.href).toBe('/login');
    });
  });

  describe('性能测试', () => {
    it('应该快速验证大量权限', () => {
      const largePermissionArray = Array.from({ length: 1000 }, (_, i) => `permission-${i}`);
      
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        authUtils.hasPermission(`permission-${i}`, largePermissionArray);
      }
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // 应该在50ms内完成
    });

    it('应该快速验证认证状态', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, userId: 1 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;
      
      mockLocalStorage.getItem.mockReturnValue(token);
      
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        authUtils.isAuthenticated();
      }
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // 应该在100ms内完成
    });
  });

  describe('边界条件', () => {
    it('应该处理极长的 Token', () => {
      const longToken = 'a'.repeat(10000);
      
      expect(() => authUtils.isTokenValid(longToken)).not.toThrow();
    });

    it('应该处理特殊字符的用户名', () => {
      const userInfo = {
        username: '用户@#$%^&*()测试',
        email: 'test@example.com'
      };
      
      expect(() => authUtils.setUserInfo(userInfo)).not.toThrow();
    });

    it('应该处理空的用户信息对象', () => {
      const emptyUserInfo = {};
      
      expect(() => authUtils.setUserInfo(emptyUserInfo)).not.toThrow();
    });

    it('应该处理包含循环引用的用户信息', () => {
      const circularUserInfo = { name: 'test' };
      circularUserInfo.self = circularUserInfo;
      
      expect(() => authUtils.setUserInfo(circularUserInfo)).toThrow();
    });

    it('应该处理非常大的权限数组', () => {
      const hugePermissionArray = Array.from({ length: 100000 }, (_, i) => `perm-${i}`);
      
      const result = authUtils.hasPermission('perm-50000', hugePermissionArray);
      
      expect(result).toBe(true);
    });

    it('应该处理包含特殊字符的权限名称', () => {
      const specialPermissions = ['read:user@domain.com', 'write:file/path', 'delete:*'];
      
      expect(authUtils.hasPermission('read:user@domain.com', specialPermissions)).toBe(true);
      expect(authUtils.hasPermission('invalid:permission', specialPermissions)).toBe(false);
    });
  });

  describe('错误处理', () => {
    it('应该处理 localStorage 访问错误', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      
      expect(() => authUtils.getToken()).toThrow('Storage access denied');
    });

    it('应该处理 sessionStorage 访问错误', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('Session storage error');
      });
      
      expect(() => authUtils.getToken()).toThrow('Session storage error');
    });

    it('应该处理 JSON 解析错误', () => {
      mockLocalStorage.getItem.mockReturnValue('{invalid json}');
      
      expect(() => authUtils.getUserInfo()).toThrow();
    });

    it('应该处理 base64 解码错误', () => {
      const invalidBase64Token = 'header.invalid-base64!@#.signature';
      
      const result = authUtils.isTokenValid(invalidBase64Token);
      
      expect(result).toBe(false);
    });
  });

  describe('安全性测试', () => {
    it('应该不在控制台输出敏感信息', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const sensitiveToken = 'sensitive-token-123';
      authUtils.setToken(sensitiveToken);
      authUtils.isTokenValid(sensitiveToken);
      
      // 确保没有敏感信息被输出到控制台
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining(sensitiveToken));
      
      consoleSpy.mockRestore();
    });

    it('应该安全地处理恶意 Token', () => {
      const maliciousTokens = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        '../../etc/passwd',
        'null\x00byte'
      ];
      
      maliciousTokens.forEach(token => {
        expect(() => authUtils.isTokenValid(token)).not.toThrow();
        expect(authUtils.isTokenValid(token)).toBe(false);
      });
    });
  });
});