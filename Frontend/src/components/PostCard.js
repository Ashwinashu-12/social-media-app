// frontend/src/components/PostCard.js
import React, { useState } from 'react';
import { format } from 'timeago.js';
import './PostCard.css';

const PostCard = ({
  post,
  commentValue,
  onCommentChange,
  onComment,
  onLike,
  onDelete,
  currentUserId, // 👈 Accept from props
}) => {
  const imageUrl = post.image ? `http://localhost:5000${post.image}` : null;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="post-card">
      {/* 🖼️ Image with Modal */}
      {imageUrl && (
        <>
          <div
            className="image-container"
            onClick={() => setIsModalOpen(true)}
            title="Click to view full image"
          >
            <img
              src={imageUrl}
              alt="Post"
              className="post-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x300?text=Image+Not+Found';
              }}
            />
          </div>

          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Zoomed Post" className="modal-image" />
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
              </div>
            </div>
          )}
        </>
      )}

      <p className="post-time">{format(post.createdAt)}</p>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.description || post.content}</p>
      <p className="post-author">
        <strong>Author:</strong> {post.author?.name || 'Unknown'}
      </p>

      <div className="post-actions">
        <span>❤️ {post.likes?.length || 0}</span>
        <button onClick={onLike} className="like-btn">Like</button>

        {/* ✅ Show delete if post belongs to current user */}
        {post.author?._id === currentUserId && (
          <button onClick={onDelete} className="delete-btn">🗑 Delete</button>
        )}
      </div>

      <div className="comment-section">
        <h4>Comments</h4>
        {post.comments?.length > 0 ? (
          post.comments.map((comment, idx) => (
            <div className="comment" key={idx}>
              <strong>{comment.author?.name || 'Anonymous'}:</strong> {comment.text}
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet.</p>
        )}

        <div className="comment-input">
          <input
            type="text"
            value={commentValue}
            onChange={onCommentChange}
            placeholder="Write a comment..."
          />
          <button onClick={onComment}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
