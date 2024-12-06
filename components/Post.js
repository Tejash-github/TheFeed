// components/Post.js
import React from 'react';
import { useRouter } from 'next/router';
import { kMaxLength } from 'buffer';

const Post = ({ post }) => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  const handleTitleClick = () => {
    setIsPopupOpen(true);
};

const closePopup = () => {
    setIsPopupOpen(false);
};
return (
  <>
      <div className="post-card" onClick={handleTitleClick}>
          <div className="post-card-content">
              <h2 className="post-title">{truncateText(post.title, 30)}</h2>
              <p className="post-content">{truncateText(post.content, 100)}</p>
              <p className="post-author">{truncateText(post.author, 20)}</p>
          </div>
      </div>

      {isPopupOpen && (
          <div className="popup-overlay">
              <div className="popup-content">
                  <h2 className="popup-title">{post.title}</h2>
                  <button className="popup-close" onClick={closePopup}>
                      &times;
                  </button>
                  <p className="popup-text">{post.content}</p>
                  <p className="popup-author">
                      <strong>Author:</strong> {post.author}
                  </p>
              </div>
          </div>
      )}
  </>
);
};

  
  export default Post;