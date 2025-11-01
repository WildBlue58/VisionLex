import { useState, useCallback, useEffect } from "react";
import { STORAGE_KEYS, HISTORY_LIMIT } from "../constants/index.js";

/**
 * 本地存储 Hook
 * 处理学习历史、收藏等功能的数据持久化
 */
export function useLocalStorage(key, initialValue) {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`读取 localStorage [${key}] 错误:`, error);
      return initialValue;
    }
  });

  // 设置值
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`保存 localStorage [${key}] 错误:`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * 学习历史 Hook
 */
export function useLearningHistory() {
  const [history, setHistory] = useLocalStorage(
    STORAGE_KEYS.LEARNING_HISTORY,
    []
  );

  /**
   * 添加学习记录
   */
  const addHistory = useCallback(
    (record) => {
      const newRecord = {
        ...record,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // 限制历史记录数量
        const updated = [newRecord, ...prev];
        return updated.slice(0, HISTORY_LIMIT);
      });

      return newRecord;
    },
    [setHistory]
  );

  /**
   * 删除历史记录
   */
  const removeHistory = useCallback(
    (id) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    },
    [setHistory]
  );

  /**
   * 清空历史记录
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  /**
   * 获取历史记录统计
   */
  const getStatistics = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = history.filter(
      (item) => new Date(item.timestamp) >= today
    ).length;

    return {
      total: history.length,
      today: todayCount,
    };
  }, [history]);

  return {
    history,
    addHistory,
    removeHistory,
    clearHistory,
    getStatistics,
  };
}

/**
 * 单词收藏 Hook
 */
export function useWordCollection() {
  const [collection, setCollection] = useLocalStorage(
    STORAGE_KEYS.WORD_COLLECTION,
    []
  );

  /**
   * 检查是否已收藏
   */
  const isCollected = useCallback(
    (word) => {
      return collection.some((item) => item.representative_word === word);
    },
    [collection]
  );

  /**
   * 添加收藏
   */
  const addToCollection = useCallback(
    (wordData) => {
      if (isCollected(wordData.representative_word)) {
        return false;
      }

      const collectionItem = {
        ...wordData,
        collectedAt: Date.now(),
      };

      setCollection((prev) => [collectionItem, ...prev]);
      return true;
    },
    [collection, isCollected, setCollection]
  );

  /**
   * 移除收藏
   */
  const removeFromCollection = useCallback(
    (word) => {
      setCollection((prev) =>
        prev.filter((item) => item.representative_word !== word)
      );
    },
    [setCollection]
  );

  /**
   * 切换收藏状态
   */
  const toggleCollection = useCallback(
    (wordData) => {
      if (isCollected(wordData.representative_word)) {
        removeFromCollection(wordData.representative_word);
        return false;
      } else {
        addToCollection(wordData);
        return true;
      }
    },
    [isCollected, addToCollection, removeFromCollection]
  );

  return {
    collection,
    isCollected,
    addToCollection,
    removeFromCollection,
    toggleCollection,
  };
}
