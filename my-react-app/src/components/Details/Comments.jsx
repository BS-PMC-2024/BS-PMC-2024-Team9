// components/Comments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa'; // ייבוא האייקון
import { setHeaders, url } from '../../features/api';

const Comments = ({ ticker }) => {
  const user = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${url}/comments/${ticker}`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [ticker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/comments`, {
        ticker,
        user: user.name,
        comment
      });
      setComments([...comments, response.data]);
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${url}/comments/${commentId}`, setHeaders());
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Message removed successfully.');
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <CommentsContainer>
      <h3>Comments</h3>
      <CommentList>
        {comments.map((comment, index) => (
          <CommentItem key={index}>
            <CommentHeader>
              <strong>{comment.user}</strong> <CommentDate>{new Date(comment.date).toLocaleString()}</CommentDate>
              {user.name === comment.user && (
                <DeleteButton onClick={() => handleDelete(comment._id)}>
                  <FaTrash /> {/* שימוש באייקון */}
                </DeleteButton>
              )}
            </CommentHeader>
            {comment.comment}
          </CommentItem>
        ))}
      </CommentList>
      {user.name ? (
        <CommentForm onSubmit={handleSubmit}>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            required
          ></TextArea>
          <SubmitButton type="submit">Submit</SubmitButton>
        </CommentForm>
      ) : (
        <LoginMessage>Please log in to comment.</LoginMessage>
      )}
    </CommentsContainer>
  );
};

export default Comments;

const CommentsContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 4rem;
  h3{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentDate = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const DeleteButton = styled.button`
  background: transparent;
  color: #e74c3c;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    color: #c0392b;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: none;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SubmitButton = styled.button`
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #2980b9;
  }
`;

const LoginMessage = styled.p`
  color: #888;
  font-style: italic;
  text-align: center;
`;