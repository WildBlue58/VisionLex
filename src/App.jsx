import { useState, useEffect, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import PictureCard from "./components/PictureCard";
import CollectButton from "./components/WordCollection";
import HistoryPanel from "./components/HistoryPanel";
import { ToastContainer } from "./components/Toast";
import { AppProvider, useApp } from "./contexts/AppContext.jsx";
import { useImageUpload } from "./hooks/useImageUpload";
import { useAIAnalysis } from "./hooks/useAIAnalysis";
import { useAudio } from "./hooks/useAudio";
import { useLearningHistory } from "./hooks/useLocalStorage";
import { DEFAULT_PLACEHOLDER_IMAGE } from "./constants";
import "./App.css";

// 环境变量检查
const ENV_CHECK = {
  hasKimiKey: !!import.meta.env.VITE_KIMI_API_KEY,
  hasAudioToken: !!import.meta.env.VITE_AUDIO_ACCESS_TOKEN,
};

/**
 * 主应用组件
 */
function AppContent({ showToast }) {
  const [wordData, setWordData] = useState(null);
  const [detailExpand, setDetailExpand] = useState(false);

  // 自定义 Hooks
  const {
    imagePreview,
    uploadError,
    isUploading,
    handleImageUpload,
    resetUpload,
  } = useImageUpload();
  const {
    isAnalyzing,
    analysisError,
    analysisResult,
    analyzeImage,
    cancelAnalysis,
    resetAnalysis,
  } = useAIAnalysis();
  const {
    audioUrl,
    isGenerating: isGeneratingAudio,
    audioError,
    generateAudioUrl,
    playAudio,
    isPlaying,
    cleanup: cleanupAudio,
  } = useAudio();
  const { addHistory } = useLearningHistory();

  // 检查环境变量配置
  useEffect(() => {
    if (!ENV_CHECK.hasKimiKey) {
      showToast(
        "⚠️ API密钥未配置！请创建 .env 文件并配置 VITE_KIMI_API_KEY",
        "error",
        8000
      );
    }
    if (!ENV_CHECK.hasAudioToken) {
      console.warn("音频服务未配置，语音功能将不可用");
    }
  }, [showToast]);

  // 监听上传错误
  useEffect(() => {
    if (uploadError) {
      showToast(uploadError, "error");
    }
  }, [uploadError, showToast]);

  // 监听分析错误
  useEffect(() => {
    if (analysisError) {
      showToast(analysisError, "error");
    }
  }, [analysisError, showToast]);

  // 处理图片上传和分析
  const handleImageUploadAndAnalyze = useCallback(
    async (imageData) => {
      if (!imageData) return;

      // 检查 API 密钥配置
      if (!ENV_CHECK.hasKimiKey) {
        showToast(
          "⚠️ 无法分析：API密钥未配置。请查看浏览器控制台了解配置方法。",
          "error",
          6000
        );
        console.error(`
===========================================
❌ API 密钥未配置！
===========================================

请按以下步骤配置：

1. 在项目根目录创建 .env 文件
2. 添加以下内容（将 your_key 替换为真实密钥）：
   VITE_KIMI_API_KEY=your_key

3. 重启开发服务器：
   npm run dev

API 密钥获取地址：
https://platform.moonshot.cn/console/api-keys

===========================================
        `);
        return;
      }

      resetAnalysis();

      // 分析图片
      const result = await analyzeImage(imageData);

      if (result) {
        setWordData({
          ...result,
          imageData,
          timestamp: Date.now(),
        });

        // 添加到历史记录
        addHistory({
          ...result,
          imageData,
        });

        // 生成音频（如果配置了音频服务）
        if (result.example_sentence && ENV_CHECK.hasAudioToken) {
          try {
            await generateAudioUrl(result.example_sentence);
          } catch (error) {
            console.error("音频生成失败:", error);
            showToast("音频生成失败", "warning");
          }
        }

        showToast("分析完成！", "success");
      }
    },
    [
      analyzeImage,
      generateAudioUrl,
      addHistory,
      showToast,
      cleanupAudio,
      resetAnalysis,
    ]
  );

  // 处理图片上传
  const handleUpload = useCallback(
    async (file) => {
      const imageData = await handleImageUpload(file);
      if (imageData) {
        await handleImageUploadAndAnalyze(imageData);
      }
    },
    [handleImageUpload, handleImageUploadAndAnalyze]
  );

  // 重新分析当前图片
  const handleRetryAnalysis = useCallback(async () => {
    if (imagePreview) {
      await handleImageUploadAndAnalyze(imagePreview);
    }
  }, [imagePreview, handleImageUploadAndAnalyze]);

  // 选择历史记录项
  const handleSelectHistoryItem = useCallback((item) => {
    setWordData(item);
    setDetailExpand(false);
    if (item.imageData) {
      // 如果需要，可以重新生成音频
    }
  }, []);

  // 清理资源（仅在组件卸载时）
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在卸载时清理，不依赖 cleanupAudio 避免意外清理

  const isLoading = isUploading || isAnalyzing || isGeneratingAudio;
  const currentWord = wordData?.representative_word || "请上传图片";
  const currentSentence = wordData?.example_sentence || "";
  const explanations = wordData?.explanations || [];
  const expReplies = wordData?.explanation_replys || [];
  const currentImagePreview =
    imagePreview || wordData?.imageData || DEFAULT_PLACEHOLDER_IMAGE;

  return (
    <div className="app-container">
      {/* 历史记录面板 */}
      <HistoryPanel onSelectItem={handleSelectHistoryItem} />

      {/* 主内容区 */}
      <main className="app-main">
        <PictureCard
          imagePreview={currentImagePreview}
          word={currentWord}
          audioUrl={audioUrl}
          isPlaying={isPlaying}
          onImageUpload={handleUpload}
          onPlayAudio={playAudio}
          isLoading={isLoading}
        />

        {/* 加载状态 */}
        {isLoading && (
          <div className="app-loading">
            <LoadingSpinner
              text={
                isUploading
                  ? "图片处理中..."
                  : isAnalyzing
                  ? "AI 分析中..."
                  : isGeneratingAudio
                  ? "生成音频中..."
                  : "处理中..."
              }
            />
            {isAnalyzing && (
              <button
                className="app-cancel-button"
                onClick={cancelAnalysis}
                aria-label="取消分析"
              >
                取消
              </button>
            )}
          </div>
        )}

        {/* 错误提示 */}
        {(analysisError || uploadError) && !isLoading && (
          <div className="app-error">
            <p>{analysisError || uploadError}</p>
            {analysisError && imagePreview && (
              <button
                className="app-retry-button"
                onClick={handleRetryAnalysis}
                aria-label="重新分析"
              >
                重新分析
              </button>
            )}
          </div>
        )}

        {/* 单词信息和详情 */}
        {wordData && !isLoading && (
          <div className="app-output">
            {currentSentence && (
              <div className="app-sentence">{currentSentence}</div>
            )}

            {/* 收藏按钮 */}
            <div className="app-actions">
              <CollectButton wordData={wordData} />
            </div>

            {/* 详情面板 */}
            <div className="app-details">
              <button
                className="app-details__toggle"
                onClick={() => setDetailExpand(!detailExpand)}
                aria-expanded={detailExpand}
              >
                {detailExpand ? "▼" : "▲"} Talk about it
              </button>

              {detailExpand && (
                <div className="app-details__content">
                  <img
                    src={currentImagePreview}
                    alt="预览"
                    className="app-details__image"
                  />
                  {explanations.length > 0 && (
                    <div className="app-details__explanations">
                      {explanations.map((explanation, index) => (
                        <p key={index} className="app-details__explanation">
                          {explanation}
                        </p>
                      ))}
                    </div>
                  )}
                  {expReplies.length > 0 && (
                    <div className="app-details__replies">
                      {expReplies.map((reply, index) => (
                        <div key={index} className="app-details__reply">
                          {reply}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * App 根组件（带 ErrorBoundary 和 Context Provider）
 */
function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now().toString();
    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <AppWithToast showToast={showToast} />
        <ToastContainer toasts={toasts} onClose={hideToast} />
      </AppProvider>
    </ErrorBoundary>
  );
}

/**
 * 包装组件，将 showToast 传递给 AppContent
 */
function AppWithToast({ showToast }) {
  const appContext = useApp();
  const finalShowToast = appContext?.showToast || showToast;

  return <AppContent showToast={finalShowToast} />;
}

export default App;
