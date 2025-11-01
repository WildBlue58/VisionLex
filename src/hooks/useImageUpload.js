import { useState, useCallback } from "react";
import {
  SUPPORTED_IMAGE_FORMATS,
  IMAGE_LIMITS,
  ERROR_MESSAGES,
} from "../constants/index.js";

/**
 * 图片上传 Hook
 * 处理图片选择、验证和转换为 base64
 */
export function useImageUpload() {
  const [imagePreview, setImagePreview] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * 压缩图片
   */
  const compressImage = useCallback((file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // 计算新尺寸
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // 转换为 base64
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * 验证图片
   */
  const validateImage = useCallback((file) => {
    // 检查文件类型
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!SUPPORTED_IMAGE_FORMATS.includes(fileExtension)) {
      return { valid: false, error: ERROR_MESSAGES.INVALID_IMAGE_FORMAT };
    }

    // 检查文件大小
    if (file.size > IMAGE_LIMITS.MAX_SIZE) {
      return { valid: false, error: ERROR_MESSAGES.IMAGE_TOO_LARGE };
    }

    return { valid: true };
  }, []);

  /**
   * 处理图片上传
   */
  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) {
        setUploadError(null);
        return null;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        // 验证图片
        const validation = validateImage(file);
        if (!validation.valid) {
          setUploadError(validation.error);
          setIsUploading(false);
          return null;
        }

        // 压缩图片（如果大于 2MB）
        let imageData;
        if (file.size > 2 * 1024 * 1024) {
          imageData = await compressImage(file);
        } else {
          // 直接转换为 base64
          imageData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        setImagePreview(imageData);
        setIsUploading(false);
        return imageData;
      } catch (error) {
        console.error("图片上传错误:", error);
        setUploadError(ERROR_MESSAGES.UNKNOWN_ERROR);
        setIsUploading(false);
        return null;
      }
    },
    [validateImage, compressImage]
  );

  /**
   * 重置上传状态
   */
  const resetUpload = useCallback(() => {
    setImagePreview("");
    setUploadError(null);
    setIsUploading(false);
  }, []);

  return {
    imagePreview,
    uploadError,
    isUploading,
    handleImageUpload,
    resetUpload,
  };
}
