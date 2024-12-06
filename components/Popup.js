// components/Popup.js
import React from 'react';

const Popup = ({ post, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p><strong>Author:</strong> {post.author}</p>
            </div>
        </div>
    );
};

export default Popup;