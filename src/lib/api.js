import { API_CONFIG, ERROR_MESSAGES } from '../constants/index.js';

/**
 * API 调用封装
 * 统一处理请求、错误和响应
 */

/**
 * 基础请求函数
 */
async function request(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    // 处理非 2xx 响应
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        errorData.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    // 网络错误
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // 传递其他错误
    throw error;
  }
}

/**
 * Moonshot AI API 调用
 */
export async function callMoonshotAPI(imageData, prompt) {
  const apiKey = import.meta.env.VITE_KIMI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key 未配置，请检查环境变量 VITE_KIMI_API_KEY');
  }

  return request(API_CONFIG.MOONSHOT_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.MOONSHOT_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageData },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      stream: false,
    }),
  });
}

/**
 * TTS API 调用（已在 audio.js 中实现，此处保留接口）
 */
export { generateAudio } from './audio.js';

