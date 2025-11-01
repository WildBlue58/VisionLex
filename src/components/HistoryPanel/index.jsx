import { memo, useState } from 'react';
import { useLearningHistory } from '../../hooks/useLocalStorage.js';
import { formatRelativeTime } from '../../lib/utils.js';
import './style.css';

/**
 * 历史记录面板组件
 */
const HistoryPanel = memo(({ onSelectItem }) => {
  const { history, removeHistory, clearHistory, getStatistics } = useLearningHistory();
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = getStatistics();

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
    }
  };

  return (
    <div className={`history-panel ${isExpanded ? 'history-panel--expanded' : ''}`}>
      <div className="history-panel__header">
        <div className="history-panel__stats">
          <span className="history-panel__stat">
            总计: <strong>{stats.total}</strong>
          </span>
          <span className="history-panel__stat">
            今日: <strong>{stats.today}</strong>
          </span>
        </div>
        <div className="history-panel__actions">
          <button
            className="history-panel__toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? '收起历史' : '展开历史'}
          >
            {isExpanded ? '▼' : '▲'} 历史
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="history-panel__content">
          {history.length === 0 ? (
            <div className="history-panel__empty">
              <p>还没有学习记录</p>
            </div>
          ) : (
            <>
              <div className="history-panel__list">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => onSelectItem?.(item)}
                  >
                    <div className="history-item__content">
                      <h4 className="history-item__word">
                        {item.representative_word || '未知单词'}
                      </h4>
                      {item.example_sentence && (
                        <p className="history-item__sentence">
                          {item.example_sentence}
                        </p>
                      )}
                      <span className="history-item__time">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <button
                      className="history-item__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistory(item.id);
                      }}
                      aria-label="删除"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="history-panel__footer">
                <button
                  className="history-panel__clear"
                  onClick={handleClearAll}
                >
                  清空历史
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});

HistoryPanel.displayName = 'HistoryPanel';

export default HistoryPanel;

