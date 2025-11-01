/**
 * 应用常量定义
 */

// API 配置
export const API_CONFIG = {
  MOONSHOT_BASE_URL: "https://api.moonshot.cn/v1/chat/completions",
  TTS_BASE_URL: "/tts/api/v1/tts",
  MOONSHOT_MODEL: "moonshot-v1-8k-vision-preview",
};

// 存储键名
export const STORAGE_KEYS = {
  LEARNING_HISTORY: "visionlex_learning_history",
  WORD_COLLECTION: "visionlex_word_collection",
  USER_PREFERENCES: "visionlex_user_preferences",
  STATISTICS: "visionlex_statistics",
};

// AI Prompt 模板
export const AI_PROMPT = `分析图片内容，找出最能描述图片的一个英文单词，尽量选择更简单的A1~A2的词汇。

返回JSON数据：
{ 
  "image_discription": "图片描述", 
  "representative_word": "图片代表的英文单词", 
  "example_sentence": "结合英文单词和图片描述，给出一个简单的例句", 
  "explanation": "结合图片解释英文单词，段落以Look at...开头，将段落分句，每一句单独一行，解释的最后给一个日常生活有关的问句", 
  "explanation_replys": ["根据explanation给出的回复1", "根据explanation给出的回复2"]
}`;

// 支持的图片格式
export const SUPPORTED_IMAGE_FORMATS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
];

// 图片限制
export const IMAGE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_DIMENSION: 4096, // 最大尺寸
};

// 默认占位图片（使用本地 SVG，避免外部依赖）
export const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder-image.svg";

// 备用占位图（SVG Data URI，防止本地文件也加载失败，纯背景无图标文字）
export const FALLBACK_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e3f2fd;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23bbdefb;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23grad1)' rx='20'/%3E%3Ccircle cx='100' cy='100' r='4' fill='%2364b5f6' opacity='0.3'/%3E%3Ccircle cx='300' cy='120' r='3' fill='%2390caf9' opacity='0.3'/%3E%3Ccircle cx='320' cy='280' r='4' fill='%2364b5f6' opacity='0.3'/%3E%3Ccircle cx='80' cy='300' r='3' fill='%2390caf9' opacity='0.3'/%3E%3C/svg%3E";

// 默认音频图标（使用 SVG Data URI，避免外部依赖）
export const DEFAULT_AUDIO_ICON =
  "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 3L9.09 6H6C4.9 6 4 6.9 4 8V16C4 17.1 4.9 18 6 18H9.09L12 21V3Z' fill='%231976d2'/%3E%3Cpath d='M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.03C15.48 15.29 16.5 13.77 16.5 12Z' fill='%231976d2'/%3E%3Cpath d='M18.5 9.5C18.5 7.01 16.99 4.93 15 4.27V7.73C16.17 8.21 17 9.47 17 11C17 12.53 16.17 13.79 15 14.27V17.73C16.99 17.07 18.5 14.99 18.5 12.5V9.5Z' fill='%231976d2'/%3E%3C/svg%3E";

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败，请检查网络后重试",
  API_ERROR: "AI 服务暂时不可用，请稍后再试",
  IMAGE_TOO_LARGE: "图片大小超过限制，请上传小于 10MB 的图片",
  INVALID_IMAGE_FORMAT: "不支持的图片格式，请上传 JPG、PNG 或 GIF 格式",
  JSON_PARSE_ERROR: "数据解析失败，请重试",
  AUDIO_GENERATION_FAILED: "音频生成失败，请重试",
  REQUEST_TIMEOUT: "分析超时（30秒），请检查网络或稍后重试",
  REQUEST_CANCELLED: "操作已取消",
  UNKNOWN_ERROR: "发生未知错误，请刷新页面重试",
};

// 成功消息
export const SUCCESS_MESSAGES = {
  IMAGE_UPLOADED: "图片上传成功",
  WORD_ANALYZED: "单词分析完成",
  WORD_COLLECTED: "已添加到收藏",
  WORD_UNCOLLECTED: "已取消收藏",
  HISTORY_CLEARED: "历史记录已清空",
};

// 本地存储版本（用于数据迁移）
export const STORAGE_VERSION = "1.0.0";

// 历史记录限制
export const HISTORY_LIMIT = 100;
