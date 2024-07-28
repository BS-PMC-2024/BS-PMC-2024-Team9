import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { setHeaders, url } from '../../features/api';
//admin panel
const AdminPanel = () => {
  const user = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/users`, setHeaders());
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${url}/admin/comments`, setHeaders());
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchUsers();
    fetchComments();
  }, [user.token]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${url}/admin/users/${userId}`, setHeaders());
      setUsers(users.filter((user) => user._id !== userId));
      toast.success('User removed successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response ? err.response.data.error : 'Error deleting user');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${url}/admin/comments/${commentId}`, setHeaders());
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success('Comment removed successfully.');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response ? err.response.data.error : 'Error deleting comment');
    }
  };

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <AdminContainer>
      <Section>
        <SectionTitle>Users</SectionTitle>
        <UserList>
          {users.map((user) => (
            <UserItem key={user._id}>
              {user.name} ({user.email})
              <DeleteButton onClick={() => handleDeleteUser(user._id)}>Delete</DeleteButton>
            </UserItem>
          ))}
        </UserList>
      </Section>
      <Section>
        <SectionTitle>Comments</SectionTitle>
        <CommentList>
          {comments.map((comment) => (
            <CommentItem key={comment._id}>
              <CommentHeader>
                <strong>{comment.user}</strong> <CommentDate>{new Date(comment.date).toLocaleString()}</CommentDate>
              </CommentHeader>
              {comment.comment}
              <DeleteButton onClick={() => handleDeleteComment(comment._id)}>Delete</DeleteButton>
            </CommentItem>
          ))}
        </CommentList>
      </Section>
    </AdminContainer>
  );
};

export default AdminPanel;

const AdminContainer = styled.div`
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Section = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #555;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CommentDate = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
  text-align: center;
`;
