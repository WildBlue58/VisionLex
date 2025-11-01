import { Component } from "react";
import "./style.css";

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，记录错误信息并显示降级 UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error("ErrorBoundary 捕获到错误:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // 可以在这里将错误日志上报到错误监控服务
    if (import.meta.env.DEV) {
      console.group("错误详情");
      console.error("错误对象:", error);
      console.error("错误信息:", errorInfo);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      // 使用自定义降级 UI
      if (fallback) {
        return fallback(this.state.error, this.handleReset);
      }

      // 默认降级 UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <div className="error-boundary__icon">⚠️</div>
            <h2 className="error-boundary__title">出现了一些问题</h2>
            <p className="error-boundary__message">
              应用遇到了意外错误。我们已经记录了这个问题，请尝试刷新页面。
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary__details">
                <summary>错误详情（开发模式）</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary__actions">
              <button
                onClick={this.handleReset}
                className="error-boundary__button error-boundary__button--primary"
              >
                重试
              </button>
              <button
                onClick={this.handleReload}
                className="error-boundary__button error-boundary__button--secondary"
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
