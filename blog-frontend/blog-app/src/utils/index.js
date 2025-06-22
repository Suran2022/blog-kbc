/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式化模式
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  let d = null;
  if (date instanceof Date) {
    d = date;
  } else {
    try {
      d = new Date(date);
    } catch (error) {
      console.error('日期解析错误:', error, date);
      return '';
    }
  }
  
  if (isNaN(d.getTime())) {
    console.warn('无效的日期格式:', date);
    return '';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  const pad = (n) => n < 10 ? `0${n}` : n;
  
  return format
    .replace('YYYY', year)
    .replace('MM', pad(month))
    .replace('DD', pad(day))
    .replace('HH', pad(hours))
    .replace('mm', pad(minutes))
    .replace('ss', pad(seconds));
}

/**
 * 截取字符串
 * @param {string} str - 原始字符串
 * @param {number} length - 截取长度
 * @param {string} [suffix='...'] - 后缀
 * @returns {string} 截取后的字符串
 */
export function truncateString(str, length, suffix = '...') {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} interval - 间隔时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, interval) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝对象
 * @param {Object} obj - 需要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  
  return clone;
}

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 文件扩展名
 */
export function getFileExtension(filename) {
  if (!filename) return '';
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * 生成随机字符串
 * @param {number} [length=8] - 字符串长度
 * @returns {string} 随机字符串
 */
export function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 将对象转换为查询字符串
 * @param {Object} obj - 对象
 * @returns {string} 查询字符串
 */
export function objectToQueryString(obj) {
  if (!obj) return '';
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

/**
 * 将查询字符串转换为对象
 * @param {string} queryString - 查询字符串
 * @returns {Object} 对象
 */
export function queryStringToObject(queryString) {
  if (!queryString) return {};
  const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  const result = {};
  query.split('&').forEach(part => {
    if (!part) return;
    const [key, value] = part.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return result;
}