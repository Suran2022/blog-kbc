import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  truncateString,
  debounce,
  throttle,
  deepClone,
  getFileExtension,
  randomString,
  objectToQueryString,
  queryStringToObject
} from '../../utils/index';

// 模拟 Date 对象以确保测试的一致性
const mockDate = new Date('2023-12-25T10:30:45.123Z');

describe('工具函数测试', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('应该正确格式化日期', () => {
      const result = formatDate(mockDate);
      expect(result).toBe('2023-12-25 18:30:45');
    });

    it('应该支持自定义格式', () => {
      const result = formatDate(mockDate, 'YYYY/MM/DD');
      expect(result).toBe('2023/12/25');
    });

    it('应该处理字符串日期', () => {
      const result = formatDate('2023-12-25T10:30:45.123Z');
      expect(result).toBe('2023-12-25 18:30:45');
    });

    it('应该处理时间戳', () => {
      const timestamp = mockDate.getTime();
      const result = formatDate(timestamp);
      expect(result).toBe('2023-12-25 18:30:45');
    });

    it('应该处理空值', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('应该处理无效日期', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });

  describe('truncateString', () => {
    it('应该正确截取长字符串', () => {
      const longText = 'This is a very long text that needs to be truncated';
      const result = truncateString(longText, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('应该处理短字符串', () => {
      const shortText = 'Short';
      const result = truncateString(shortText, 10);
      expect(result).toBe('Short');
    });

    it('应该支持自定义后缀', () => {
      const text = 'This is a long text';
      const result = truncateString(text, 10, '...');
      expect(result).toBe('This is a ...');
    });

    it('应该处理空字符串', () => {
      const result = truncateString('', 10);
      expect(result).toBe('');
    });
  });

  describe('debounce', () => {
    it('应该延迟执行函数', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该取消之前的调用', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该传递参数', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    it('应该限制函数执行频率', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该在间隔后允许再次执行', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('deepClone', () => {
    it('应该深拷贝对象', () => {
      const original = {
        name: 'test',
        nested: {
          value: 123,
          array: [1, 2, 3]
        }
      };

      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
    });

    it('应该深拷贝数组', () => {
      const original = [1, { a: 2 }, [3, 4]];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
    });

    it('应该处理特殊类型', () => {
      const date = new Date();
      const regex = /test/g;

      expect(deepClone(date)).toEqual(date);
      expect(deepClone(regex)).toEqual(regex);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(123)).toBe(123);
    });
  });

  describe('getFileExtension', () => {
    it('应该获取文件扩展名', () => {
      expect(getFileExtension('file.txt')).toBe('txt');
      expect(getFileExtension('image.png')).toBe('png');
      expect(getFileExtension('document.pdf')).toBe('pdf');
    });

    it('应该处理多个点的文件名', () => {
      expect(getFileExtension('file.name.txt')).toBe('txt');
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    it('应该处理没有扩展名的文件', () => {
      expect(getFileExtension('filename')).toBe('');
      expect(getFileExtension('')).toBe('');
      expect(getFileExtension(null)).toBe('');
      expect(getFileExtension(undefined)).toBe('');
    });
  });

  describe('randomString', () => {
    it('应该生成指定长度的随机字符串', () => {
      const result = randomString(10);
      expect(result).toHaveLength(10);
      expect(typeof result).toBe('string');
    });

    it('应该使用默认长度', () => {
      const result = randomString();
      expect(result).toHaveLength(8);
    });

    it('应该生成不同的字符串', () => {
      const str1 = randomString(10);
      const str2 = randomString(10);
      expect(str1).not.toBe(str2);
    });

    it('应该只包含字母和数字', () => {
      const result = randomString(100);
      expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });
  });

  describe('objectToQueryString', () => {
    it('应该将对象转换为查询字符串', () => {
      const obj = { name: 'test', age: 25, active: true };
      const result = objectToQueryString(obj);
      expect(result).toBe('name=test&age=25&active=true');
    });

    it('应该处理特殊字符', () => {
      const obj = { query: 'hello world', symbol: '&=?' };
      const result = objectToQueryString(obj);
      expect(result).toContain('query=hello%20world');
      expect(result).toContain('symbol=%26%3D%3F');
    });

    it('应该过滤空值', () => {
      const obj = { name: 'test', empty: '', nullValue: null, undefinedValue: undefined };
      const result = objectToQueryString(obj);
      expect(result).toBe('name=test');
    });

    it('应该处理空对象', () => {
      expect(objectToQueryString({})).toBe('');
      expect(objectToQueryString(null)).toBe('');
      expect(objectToQueryString(undefined)).toBe('');
    });
  });

  describe('queryStringToObject', () => {
    it('应该将查询字符串转换为对象', () => {
      const queryString = 'name=test&age=25&active=true';
      const result = queryStringToObject(queryString);
      expect(result).toEqual({ name: 'test', age: '25', active: 'true' });
    });

    it('应该处理带问号的查询字符串', () => {
      const queryString = '?name=test&age=25';
      const result = queryStringToObject(queryString);
      expect(result).toEqual({ name: 'test', age: '25' });
    });

    it('应该解码特殊字符', () => {
      const queryString = 'query=hello%20world&symbol=%26%3D%3F';
      const result = queryStringToObject(queryString);
      expect(result).toEqual({ query: 'hello world', symbol: '&=?' });
    });

    it('应该处理空值', () => {
      const queryString = 'name=test&empty=&value';
      const result = queryStringToObject(queryString);
      expect(result).toEqual({ name: 'test', empty: '', value: '' });
    });

    it('应该处理空字符串', () => {
      expect(queryStringToObject('')).toEqual({});
      expect(queryStringToObject(null)).toEqual({});
      expect(queryStringToObject(undefined)).toEqual({});
    });
  });

  describe('性能测试', () => {
    it('formatDate 应该在合理时间内完成', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        formatDate(new Date());
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // 100ms内完成1000次格式化
    });

    it('deepClone 应该处理大对象', () => {
      const largeObject = {};
      for (let i = 0; i < 1000; i++) {
        largeObject[`key${i}`] = { value: i, nested: { data: `data${i}` } };
      }

      const start = performance.now();
      const cloned = deepClone(largeObject);
      const end = performance.now();

      expect(cloned).toEqual(largeObject);
      expect(end - start).toBeLessThan(100); // 100ms内完成大对象克隆
    });
  });

  describe('边界条件', () => {
    it('应该处理极长的字符串', () => {
      const longString = 'a'.repeat(10000);
      expect(() => truncateString(longString, 100)).not.toThrow();
      expect(truncateString(longString, 100)).toHaveLength(103); // 100 + '...'
    });

    it('应该处理特殊字符', () => {
      const specialChars = '🚀🎉💻🌟';
      expect(() => truncateString(specialChars, 2)).not.toThrow();
      expect(getFileExtension('file.🚀')).toBe('🚀');
    });

    it('应该处理循环引用对象', () => {
      const obj = { a: 1 };
      obj.self = obj;
      
      // deepClone 会抛出栈溢出错误，这是预期行为
      expect(() => deepClone(obj)).toThrow();
    });
  });
});