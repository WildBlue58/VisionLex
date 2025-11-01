import { STORAGE_KEYS, STORAGE_VERSION } from '../constants/index.js';

/**
 * 本地存储工具
 * 提供类型安全的存储操作和版本管理
 */

/**
 * 设置存储项
 */
export function setStorageItem(key, value) {
  try {
    const item = {
      version: STORAGE_VERSION,
      data: value,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`设置存储 [${key}] 失败:`, error);
    return false;
  }
}

/**
 * 获取存储项
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }

    const parsed = JSON.parse(item);
    
    // 检查版本兼容性
    if (parsed.version !== STORAGE_VERSION) {
      console.warn(`存储版本不匹配 [${key}]: ${parsed.version} vs ${STORAGE_VERSION}`);
      // 可以选择迁移数据或返回默认值
      return defaultValue;
    }

    return parsed.data;
  } catch (error) {
    console.error(`读取存储 [${key}] 失败:`, error);
    return defaultValue;
  }
}

/**
 * 删除存储项
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`删除存储 [${key}] 失败:`, error);
    return false;
  }
}

/**
 * 清空所有存储
 */
export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清空存储失败:', error);
    return false;
  }
}

/**
 * 获取所有存储键
 */
export function getAllStorageKeys() {
  return Object.keys(localStorage);
}

/**
 * 获取存储使用情况（估算）
 */
export function getStorageUsage() {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return {
      used: total,
      usedMB: (total / 1024 / 1024).toFixed(2),
    };
  } catch (error) {
    console.error('获取存储使用情况失败:', error);
    return { used: 0, usedMB: '0' };
  }
}

