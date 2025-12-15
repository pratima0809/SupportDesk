import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../utils/api';

export default function CommentSection({ ticketId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commentAPI.getComments(ticketId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await commentAPI.createComment({
        ticketId,
        text: newComment,
      });
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="card comments">
      <h3 className="card-title">Comments</h3>

      <div style={{ marginBottom: 16, maxHeight: '360px', overflowY: 'auto', display: 'grid', gap: 12 }}>
        {loading ? (
          <p className="text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p className="author">
                    {comment.userId.name}
                    {comment.isAdminComment && (
                      <span style={{ marginLeft: 8, padding: '4px 8px', background: '#fee2e2', color: '#991b1b', fontSize: 11, borderRadius: 6, marginTop: -2 }}>
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="time">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                {comment.userId._id === user?.id && (
                  <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                    Delete
                  </button>
                )}
              </div>
              <p style={{ marginTop: 8, color: '#111827' }}>{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmitComment} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
          className="textarea"
          style={{ marginBottom: 12 }}
        />
        <button type="submit" disabled={submitting || !newComment.trim()} className={`btn btn-primary ${submitting ? 'disabled' : ''}`}>
          {submitting ? 'Adding...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
}
