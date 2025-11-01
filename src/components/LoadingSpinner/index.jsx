import { memo } from "react";
import "./style.css";

/**
 * 加载动画组件
 * 提供多种加载动画样式
 */
const LoadingSpinner = memo(
  ({
    size = "md",
    variant = "spinner",
    text,
    fullScreen = false,
    className = "",
  }) => {
    const sizeClasses = {
      sm: "loading-spinner--small",
      md: "loading-spinner--medium",
      lg: "loading-spinner--large",
    };

    const containerClass = fullScreen
      ? "loading-spinner__fullscreen"
      : "loading-spinner__container";

    return (
      <div className={`${containerClass} ${className}`}>
        {variant === "spinner" && (
          <div className={`loading-spinner ${sizeClasses[size]}`}>
            <div className="loading-spinner__ring"></div>
            <div className="loading-spinner__ring"></div>
            <div className="loading-spinner__ring"></div>
          </div>
        )}

        {variant === "dots" && (
          <div className={`loading-dots ${sizeClasses[size]}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        {variant === "pulse" && (
          <div className={`loading-pulse ${sizeClasses[size]}`}></div>
        )}

        {text && <p className="loading-spinner__text">{text}</p>}
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;

/**
 * 骨架屏加载组件
 */
export const SkeletonLoader = memo(
  ({ width = "100%", height = "1rem", className = "", rounded = false }) => {
    return (
      <div
        className={`skeleton-loader ${
          rounded ? "skeleton-loader--rounded" : ""
        } ${className}`}
        style={{ width, height }}
      ></div>
    );
  }
);

SkeletonLoader.displayName = "SkeletonLoader";

/**
 * 卡片骨架屏
 */
export const CardSkeleton = memo(() => {
  return (
    <div className="card-skeleton">
      <SkeletonLoader
        width="160px"
        height="160px"
        className="card-skeleton__image"
        rounded
      />
      <SkeletonLoader
        width="120px"
        height="20px"
        className="card-skeleton__title"
      />
      <SkeletonLoader
        width="80px"
        height="16px"
        className="card-skeleton__subtitle"
      />
    </div>
  );
});

CardSkeleton.displayName = "CardSkeleton";
