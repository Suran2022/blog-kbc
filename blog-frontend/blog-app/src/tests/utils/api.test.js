import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 模拟 axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    })),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// 模拟 element-plus
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}));

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

// 模拟 window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(global, 'window', {
  value: {
    location: mockLocation
  },
  configurable: true
});

// 模拟环境变量
vi.mock('import.meta', () => ({
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000/api'
  }
}));

describe('API 工具函数测试', () => {
  let mockAxiosInstance;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // 创建模拟的 axios 实例
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };
    
    axios.create.mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Axios 实例创建', () => {
    it('应该创建带有正确配置的 axios 实例', async () => {
      // 动态导入模块以触发实例创建
      await import('../../utils/request');
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000/api',
        timeout: 15000
      });
    });

    it('应该设置请求和响应拦截器', async () => {
      await import('../../utils/request');
      
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('请求拦截器', () => {
    it('应该在请求头中添加 Authorization token', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-token');
      
      await import('../../utils/request');
      
      // 获取请求拦截器函数
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers['Authorization']).toBe('Bearer test-token');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('应该在没有 token 时不添加 Authorization 头', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      await import('../../utils/request');
      
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers['Authorization']).toBeUndefined();
    });

    it('应该处理请求错误', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await import('../../utils/request');
      
      const requestErrorHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      const error = new Error('Request failed');
      
      await expect(requestErrorHandler(error)).rejects.toThrow('Request failed');
      expect(consoleSpy).toHaveBeenCalledWith('Request error:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('响应拦截器', () => {
    let responseInterceptor;
    
    beforeEach(async () => {
      await import('../../utils/request');
      responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    });

    it('应该处理成功响应', () => {
      const response = {
        data: {
          code: 200,
          message: 'Success',
          data: { id: 1, name: 'Test' }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result).toBe(response.data);
    });

    it('应该处理带有日期字段的响应数据', () => {
      const response = {
        data: {
          code: 200,
          data: {
            id: 1,
            name: 'Test',
            createTime: '2023-01-01T00:00:00.000Z',
            updateTime: '2023-01-02T00:00:00.000Z'
          }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data.createTime).toBe('2023-01-01T00:00:00.000Z');
      expect(result.data.updateTime).toBe('2023-01-02T00:00:00.000Z');
    });

    it('应该处理数组响应数据中的日期字段', () => {
      const response = {
        data: {
          code: 200,
          data: [
            {
              id: 1,
              createTime: '2023-01-01T00:00:00.000Z'
            },
            {
              id: 2,
              createTime: '2023-01-02T00:00:00.000Z'
            }
          ]
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data[0].createTime).toBe('2023-01-01T00:00:00.000Z');
      expect(result.data[1].createTime).toBe('2023-01-02T00:00:00.000Z');
    });

    it('应该处理分页数据中的日期字段', () => {
      const response = {
        data: {
          code: 200,
          data: {
            list: [
              {
                id: 1,
                createTime: '2023-01-01T00:00:00.000Z'
              }
            ],
            total: 1
          }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data.list[0].createTime).toBe('2023-01-01T00:00:00.000Z');
    });

    it('应该处理错误响应并显示错误消息', async () => {
      const response = {
        data: {
          code: 400,
          message: 'Bad Request'
        }
      };
      
      await expect(responseInterceptor(response)).rejects.toThrow('Bad Request');
      
      expect(ElMessage).toHaveBeenCalledWith({
        message: 'Bad Request',
        type: 'error',
        duration: 5000
      });
    });

    it('应该处理 401 未授权错误', async () => {
      vi.useFakeTimers();
      
      const response = {
        data: {
          code: 401,
          message: 'Unauthorized'
        }
      };
      
      const promise = responseInterceptor(response);
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userInfo');
      
      // 等待 setTimeout
      vi.advanceTimersByTime(1500);
      
      expect(window.location.href).toBe('/admin/login');
      
      await expect(promise).rejects.toThrow('Unauthorized');
      
      vi.useRealTimers();
    });

    it('应该处理没有错误消息的错误响应', async () => {
      const response = {
        data: {
          code: 500
        }
      };
      
      await expect(responseInterceptor(response)).rejects.toThrow('请求失败');
      
      expect(ElMessage).toHaveBeenCalledWith({
        message: '请求失败',
        type: 'error',
        duration: 5000
      });
    });
  });

  describe('日期字段转换', () => {
    let responseInterceptor;
    
    beforeEach(async () => {
      await import('../../utils/request');
      responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    });

    it('应该转换有效的日期字符串', () => {
      const response = {
        data: {
          code: 200,
          data: {
            createTime: '2023-01-01T10:00:00Z',
            updateTime: '2023-12-31T23:59:59Z'
          }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data.createTime).toBe('2023-01-01T10:00:00.000Z');
      expect(result.data.updateTime).toBe('2023-12-31T23:59:59.000Z');
    });

    it('应该忽略无效的日期字符串', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const response = {
        data: {
          code: 200,
          data: {
            createTime: 'invalid-date',
            updateTime: '2023-01-01T00:00:00Z'
          }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data.createTime).toBe('invalid-date'); // 保持原值
      expect(result.data.updateTime).toBe('2023-01-01T00:00:00.000Z');
      
      consoleSpy.mockRestore();
    });

    it('应该处理嵌套对象中的日期字段', () => {
      const response = {
        data: {
          code: 200,
          data: {
            user: {
              createTime: '2023-01-01T00:00:00Z',
              profile: {
                updateTime: '2023-01-02T00:00:00Z'
              }
            }
          }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data.user.createTime).toBe('2023-01-01T00:00:00.000Z');
      expect(result.data.user.profile.updateTime).toBe('2023-01-02T00:00:00.000Z');
    });

    it('应该处理非日期字段名称', () => {
      const response = {
        data: {
          code: 200,
          data: {
            name: '2023-01-01T00:00:00Z', // 不是日期字段名
            createTime: '2023-01-01T00:00:00Z' // 是日期字段名
          }
        }
      };
      
      const result = responseInterceptor(response);
      
      expect(result.data.name).toBe('2023-01-01T00:00:00Z'); // 保持原值
      expect(result.data.createTime).toBe('2023-01-01T00:00:00.000Z'); // 转换
    });
  });

  describe('性能测试', () => {
    let responseInterceptor;
    
    beforeEach(async () => {
      await import('../../utils/request');
      responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    });

    it('应该高效处理大量数据的日期转换', () => {
      const largeDataArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        createTime: '2023-01-01T00:00:00Z',
        updateTime: '2023-01-02T00:00:00Z'
      }));
      
      const response = {
        data: {
          code: 200,
          data: largeDataArray
        }
      };
      
      const start = performance.now();
      const result = responseInterceptor(response);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // 应该在100ms内完成
      expect(result.data).toHaveLength(1000);
      expect(result.data[0].createTime).toBe('2023-01-01T00:00:00.000Z');
    });

    it('应该高效处理深层嵌套对象', () => {
      const deepNestedData = {
        level1: {
          level2: {
            level3: {
              level4: {
                createTime: '2023-01-01T00:00:00Z'
              }
            }
          }
        }
      };
      
      const response = {
        data: {
          code: 200,
          data: deepNestedData
        }
      };
      
      const start = performance.now();
      const result = responseInterceptor(response);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // 应该在50ms内完成
      expect(result.data.level1.level2.level3.level4.createTime).toBe('2023-01-01T00:00:00.000Z');
    });
  });

  describe('边界条件', () => {
    let responseInterceptor;
    
    beforeEach(async () => {
      await import('../../utils/request');
      responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    });

    it('应该处理空响应数据', () => {
      const response = {
        data: {
          code: 200,
          data: null
        }
      };
      
      expect(() => responseInterceptor(response)).not.toThrow();
    });

    it('应该处理空数组', () => {
      const response = {
        data: {
          code: 200,
          data: []
        }
      };
      
      const result = responseInterceptor(response);
      expect(result.data).toEqual([]);
    });

    it('应该处理空对象', () => {
      const response = {
        data: {
          code: 200,
          data: {}
        }
      };
      
      const result = responseInterceptor(response);
      expect(result.data).toEqual({});
    });

    it('应该处理循环引用对象', () => {
      const circularObj = { name: 'test' };
      circularObj.self = circularObj;
      
      const response = {
        data: {
          code: 200,
          data: circularObj
        }
      };
      
      // 应该不会导致无限递归
      expect(() => responseInterceptor(response)).not.toThrow();
    });

    it('应该处理非字符串的日期字段值', () => {
      const response = {
        data: {
          code: 200,
          data: {
            createTime: 1672531200000, // 时间戳
            updateTime: new Date('2023-01-01'), // Date 对象
            createdAt: null, // null 值
            updatedAt: undefined // undefined 值
          }
        }
      };
      
      expect(() => responseInterceptor(response)).not.toThrow();
    });
  });

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await import('../../utils/request');
      
      const requestErrorHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      const networkError = new Error('Network Error');
      
      await expect(requestErrorHandler(networkError)).rejects.toThrow('Network Error');
      expect(consoleSpy).toHaveBeenCalledWith('Request error:', networkError);
      
      consoleSpy.mockRestore();
    });

    it('应该处理超时错误', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await import('../../utils/request');
      
      const requestErrorHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      const timeoutError = new Error('timeout of 15000ms exceeded');
      
      await expect(requestErrorHandler(timeoutError)).rejects.toThrow('timeout of 15000ms exceeded');
      expect(consoleSpy).toHaveBeenCalledWith('Request error:', timeoutError);
      
      consoleSpy.mockRestore();
    });
  });
});