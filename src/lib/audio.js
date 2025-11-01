/**
 * TTS 文字转语音工具
 */

/**
 * 将 Base64 数据转换为音频 URL
 * @param {string} base64Data - Base64 编码的音频数据
 * @returns {string} 音频对象的临时 URL
 */
const getAudioUrl = (base64Data) => {
  try {
    // 创建一个数组来存储字节数据
    const byteArrays = [];
    // 使用atob()将Base64编码的字符串解码为原始二进制字符串
    // atob: ASCII to Binary
    const byteCharacters = atob(base64Data);
    // 遍历解码后的二进制字符串的每个字符
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      // 将每个字符转换为其ASCII码值（0-255之间的数字）
      const byteCode = byteCharacters.charCodeAt(offset);
      // 将ASCII码值添加到字节数组中
      byteArrays.push(byteCode);
    }
    // 创建一个Blob对象
    // new Uint8Array(byteArrays)将普通数组转换为8位无符号整数数组
    // { type: 'audio/mp3' } 指定Blob的MIME类型为MP3音频
    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'audio/mp3' });
    // 使用URL.createObjectURL创建一个临时的URL
    // 这个URL可以用于<audio>标签的src属性
    // 这个URL在当前页面/会话有效，页面关闭后会自动释放
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Base64 转音频 URL 失败:', error);
    throw new Error('音频数据转换失败');
  }
};


/**
 * 生成音频 URL
 * @param {string} text - 要转换为语音的文本
 * @returns {Promise<string>} 音频对象的临时 URL
 * @throws {Error} 当音频生成失败时抛出错误
 */
export const generateAudio = async (text) => {
  if (!text || text.trim() === '') {
    throw new Error('文本不能为空');
  }

  const token = import.meta.env.VITE_AUDIO_ACCESS_TOKEN;
  const appId = import.meta.env.VITE_AUDIO_APP_ID;
  const clusterId = import.meta.env.VITE_AUDIO_CLUSTER_ID;
  const voiceName = import.meta.env.VITE_AUDIO_VOICE_NAME;

  // 检查必要的环境变量
  if (!token || !appId || !clusterId || !voiceName) {
    throw new Error('音频服务配置不完整，请检查环境变量');
  }

  const endpoint = '/tts/api/v1/tts';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer;${token}`,
  };

  // 请求体
  const payload = {
    app: {
      appid: appId,
      token,
      cluster: clusterId,
    },
    user: {
      uid: 'visionlex_user',
    },
    audio: {
      voice_type: voiceName,
      encoding: 'ogg_opus',
      compression_rate: 1,
      rate: 24000,
      speed_ratio: 1.0,
      volume_ratio: 1.0,
      pitch_ratio: 1.0,
      emotion: 'happy',
    },
    request: {
      reqid: Math.random().toString(36).substring(7),
      text,
      text_type: 'plain',
      operation: 'query',
      silence_duration: '125',
      with_frontend: '1',
      frontend_type: 'unitTson',
      pure_english_opt: '1',
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}: 音频生成失败`);
    }

    const data = await res.json();
    
    if (!data.data) {
      console.error('音频生成失败，返回内容：', data);
      throw new Error(data.message || '音频生成失败，服务器未返回有效数据');
    }

    const url = getAudioUrl(data.data);
    return url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('音频生成失败: ' + String(error));
  }
};