import { useState, useCallback, useRef } from "react";
import { API_CONFIG, AI_PROMPT, ERROR_MESSAGES } from "../constants/index.js";

/**
 * AI 分析 Hook
 * 处理图片分析和单词识别
 */
export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * 分析图片
   */
  const analyzeImage = useCallback(async (imageData) => {
    if (!imageData) {
      setAnalysisError("请先上传图片");
      return null;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    // 创建 AbortController 用于取消请求
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort();
    }, 30000); // 30 秒超时

    try {
      const response = await fetch(API_CONFIG.MOONSHOT_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`,
        },
        body: JSON.stringify({
          model: API_CONFIG.MOONSHOT_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: imageData },
                },
                {
                  type: "text",
                  text: AI_PROMPT,
                },
              ],
            },
          ],
          stream: false,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("AI API 错误:", errorData);
        throw new Error(errorData.error?.message || ERROR_MESSAGES.API_ERROR);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("AI 响应格式错误:", data);
        throw new Error(ERROR_MESSAGES.JSON_PARSE_ERROR);
      }

      // 解析 JSON 响应
      let parsedData;
      try {
        parsedData = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error("JSON 解析错误:", parseError);
        console.error("原始内容:", data.choices[0].message.content);
        throw new Error(ERROR_MESSAGES.JSON_PARSE_ERROR);
      }

      // 验证数据结构
      if (!parsedData.representative_word) {
        console.error("AI 返回数据格式错误:", parsedData);
        throw new Error("AI 返回的数据格式不正确");
      }

      // 处理解释文本（分割为数组）
      const explanations = parsedData.explanation
        ? parsedData.explanation.split("\n").filter((line) => line.trim())
        : [];

      const result = {
        ...parsedData,
        explanations,
      };

      setAnalysisResult(result);
      setIsAnalyzing(false);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      // 处理不同类型的错误
      let errorMessage;
      if (error.name === "AbortError") {
        errorMessage = ERROR_MESSAGES.REQUEST_TIMEOUT;
      } else {
        console.error("AI 分析错误:", error);
        errorMessage = error.message || ERROR_MESSAGES.API_ERROR;
      }

      setAnalysisError(errorMessage);
      setIsAnalyzing(false);
      return null;
    }
  }, []);

  /**
   * 取消分析
   */
  const cancelAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsAnalyzing(false);
      setAnalysisError(ERROR_MESSAGES.REQUEST_CANCELLED);
    }
  }, []);

  /**
   * 重置分析状态
   */
  const resetAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsAnalyzing(false);
    setAnalysisError(null);
    setAnalysisResult(null);
  }, []);

  return {
    isAnalyzing,
    analysisError,
    analysisResult,
    analyzeImage,
    cancelAnalysis,
    resetAnalysis,
  };
}
