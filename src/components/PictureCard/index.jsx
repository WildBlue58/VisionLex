import { memo, useRef, useState, useEffect, useCallback } from "react";
import {
  SUPPORTED_IMAGE_FORMATS,
  DEFAULT_PLACEHOLDER_IMAGE,
  FALLBACK_PLACEHOLDER_IMAGE,
  DEFAULT_AUDIO_ICON,
} from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
import "./style.css";

/**
 * 图片卡片组件
 * 支持点击和拖拽上传图片
 */
const PictureCard = memo(
  ({
    imagePreview,
    word,
    audioUrl,
    isPlaying = false,
    isLoading = false,
    onImageUpload,
    onPlayAudio,
  }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState(
      imagePreview || DEFAULT_PLACEHOLDER_IMAGE
    );

    // 处理文件选择
    const handleFileSelect = useCallback(
      (file) => {
        if (!file) return;

        // 验证文件类型
        const fileExtension = "." + file.name.split(".").pop().toLowerCase();
        if (!SUPPORTED_IMAGE_FORMATS.includes(fileExtension)) {
          alert("不支持的图片格式，请上传 JPG、PNG 或 GIF 格式");
          return;
        }

        onImageUpload?.(file);
      },
      [onImageUpload]
    );

    // 处理文件输入变化
    const handleInputChange = useCallback(
      (e) => {
        const file = e.target.files?.[0];
        handleFileSelect(file);
        // 重置 input，允许重复选择同一文件
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      [handleFileSelect]
    );

    // 处理点击上传（已移除，因为 htmlFor 会自动触发）
    // const handleClick = useCallback(() => {
    //   fileInputRef.current?.click();
    // }, []);

    // 处理拖拽事件
    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        handleFileSelect(file);
      },
      [handleFileSelect]
    );

    // 处理音频播放
    const handlePlayAudio = useCallback(
      (e) => {
        e.stopPropagation();
        if (audioUrl) {
          onPlayAudio?.();
        } else {
          alert("请先上传图片并生成语音");
        }
      },
      [audioUrl, onPlayAudio]
    );

    // 更新图片源
    useEffect(() => {
      if (imagePreview) {
        setCurrentImageSrc(imagePreview);
        setImageError(false);
      } else if (!imageError) {
        setCurrentImageSrc(DEFAULT_PLACEHOLDER_IMAGE);
      }
    }, [imagePreview, imageError]);

    // 处理图片加载错误
    const handleImageError = useCallback(() => {
      if (currentImageSrc !== FALLBACK_PLACEHOLDER_IMAGE) {
        // 如果当前不是备用图，切换到备用图
        setCurrentImageSrc(FALLBACK_PLACEHOLDER_IMAGE);
        setImageError(true);
      }
    }, [currentImageSrc]);

    // 处理图片加载成功
    const handleImageLoad = useCallback(() => {
      setImageError(false);
    }, []);

    const showWord = word && word !== "请上传图片";

    return (
      <div
        className={`picture-card ${
          isDragging ? "picture-card--dragging" : ""
        } ${isLoading ? "picture-card--loading" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id="selectImage"
          type="file"
          accept={SUPPORTED_IMAGE_FORMATS.join(",")}
          onChange={handleInputChange}
          className="picture-card__input"
          aria-label="选择图片"
        />

        {isLoading ? (
          <div className="picture-card__loading">
            <LoadingSpinner size="lg" text="处理中..." />
          </div>
        ) : (
          <>
            <label htmlFor="selectImage" className="picture-card__upload-area">
              <img
                src={currentImageSrc}
                alt={showWord ? word : "点击或拖拽上传图片"}
                className="picture-card__image"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {!showWord && (
                <div className="picture-card__upload-hint">
                  <div className="picture-card__upload-icon">📷</div>
                  <p>点击或拖拽上传图片</p>
                </div>
              )}
            </label>

            {showWord && (
              <div className="picture-card__content">
                <h2 className="picture-card__word">{word}</h2>
                <button
                  className={`picture-card__play-button ${
                    isPlaying ? "picture-card__play-button--playing" : ""
                  }`}
                  onClick={handlePlayAudio}
                  disabled={!audioUrl || audioUrl.trim() === ""}
                  aria-label="播放音频"
                  title={
                    audioUrl && audioUrl.trim() !== ""
                      ? "播放发音"
                      : "音频未准备好"
                  }
                >
                  <img
                    src={DEFAULT_AUDIO_ICON}
                    alt="播放"
                    className="picture-card__play-icon"
                  />
                  {isPlaying && (
                    <span className="picture-card__playing-indicator">♪</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

PictureCard.displayName = "PictureCard";

export default PictureCard;
