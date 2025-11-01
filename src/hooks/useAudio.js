import { useState, useCallback, useRef, useEffect } from "react";
import { generateAudio } from "../lib/audio.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * 音频播放 Hook
 * 处理音频生成和播放
 */
export function useAudio() {
  const [audioUrl, setAudioUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  /**
   * 生成音频
   */
  const generateAudioUrl = useCallback(
    async (text) => {
      if (!text || text.trim() === "") {
        setAudioError("文本不能为空");
        return null;
      }

      setIsGenerating(true);
      setAudioError(null);

      // 清理之前的音频（但保留 audioUrl 状态，直到新音频准备好）
      const oldAudioUrl = audioUrl;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      try {
        const url = await generateAudio(text);

        if (!url) {
          throw new Error(ERROR_MESSAGES.AUDIO_GENERATION_FAILED);
        }

        // 清理旧 URL（如果有）
        if (oldAudioUrl) {
          URL.revokeObjectURL(oldAudioUrl);
        }

        setAudioUrl(url);
        setIsGenerating(false);
        return url;
      } catch (error) {
        console.error("音频生成错误:", error);
        setAudioError(error.message || ERROR_MESSAGES.AUDIO_GENERATION_FAILED);
        setIsGenerating(false);
        return null;
      }
    },
    [audioUrl]
  );

  /**
   * 播放音频
   */
  const playAudio = useCallback(() => {
    if (!audioUrl) {
      setAudioError("音频未准备好");
      return;
    }

    try {
      // 如果已有音频实例，先停止
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // 创建新的音频实例
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (e) => {
        console.error("音频播放错误:", e);
        setAudioError("音频播放失败");
        setIsPlaying(false);
      };

      audio.play().catch((error) => {
        console.error("音频播放失败:", error);
        setAudioError("无法播放音频");
        setIsPlaying(false);
      });
    } catch (error) {
      console.error("播放音频错误:", error);
      setAudioError("音频播放失败");
    }
  }, [audioUrl]);

  /**
   * 停止音频
   */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  /**
   * 清理资源
   * 使用 useRef 存储 audioUrl，避免在依赖变化时重新创建函数
   */
  const audioUrlRef = useRef("");

  // 同步 audioUrl 到 ref
  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const currentUrl = audioUrlRef.current;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    setAudioUrl("");
    setIsPlaying(false);
    setAudioError(null);
  }, []); // 不依赖 audioUrl，使用 ref

  return {
    audioUrl,
    isGenerating,
    audioError,
    isPlaying,
    generateAudioUrl,
    playAudio,
    stopAudio,
    cleanup,
  };
}
