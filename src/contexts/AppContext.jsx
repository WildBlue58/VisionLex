import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

/**
 * 应用全局上下文
 * 管理主题、用户偏好等全局状态
 */
const AppContext = createContext(null);

/**
 * AppProvider - 应用上下文提供者
 */
export function AppProvider({ children }) {
  // 主题状态（light/dark）
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("visionlex_theme");
    return savedTheme || "light";
  });

  // Toast 消息状态
  const [toast, setToast] = useState(null);

  // 切换主题
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("visionlex_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }, [theme]);

  // 显示 Toast 消息
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ message, type, duration });

    // 自动隐藏
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  // 隐藏 Toast
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = {
    theme,
    toggleTheme,
    toast,
    showToast: showToast || (() => {}), // 提供默认实现
    hideToast,
  };

  // 初始化主题
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * 使用应用上下文
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
