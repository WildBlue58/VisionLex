import { memo } from 'react';
import { useWordCollection } from '../../hooks/useLocalStorage.js';
import './style.css';

/**
 * 收藏按钮组件
 */
const CollectButton = memo(({ wordData, size = 'md' }) => {
  const { isCollected, toggleCollection } = useWordCollection();

  if (!wordData?.representative_word) return null;

  const collected = isCollected(wordData.representative_word);

  const handleClick = () => {
    toggleCollection(wordData);
  };

  return (
    <button
      className={`collect-button collect-button--${size} ${collected ? 'collect-button--active' : ''}`}
      onClick={handleClick}
      aria-label={collected ? '取消收藏' : '收藏'}
      title={collected ? '取消收藏' : '收藏'}
    >
      <span className="collect-button__icon">
        {collected ? '★' : '☆'}
      </span>
      <span className="collect-button__text">
        {collected ? '已收藏' : '收藏'}
      </span>
    </button>
  );
});

CollectButton.displayName = 'CollectButton';

/**
 * 收藏列表组件
 */
export const CollectionList = memo(() => {
  const { collection, removeFromCollection } = useWordCollection();

  if (collection.length === 0) {
    return (
      <div className="collection-empty">
        <p>还没有收藏的单词</p>
        <p className="collection-empty__hint">点击收藏按钮保存你喜欢的单词</p>
      </div>
    );
  }

  return (
    <div className="collection-list">
      {collection.map((item) => (
        <div key={item.representative_word} className="collection-item">
          <div className="collection-item__content">
            <h3 className="collection-item__word">{item.representative_word}</h3>
            {item.example_sentence && (
              <p className="collection-item__sentence">{item.example_sentence}</p>
            )}
          </div>
          <button
            className="collection-item__remove"
            onClick={() => removeFromCollection(item.representative_word)}
            aria-label="删除"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
});

CollectionList.displayName = 'CollectionList';

export default CollectButton;

