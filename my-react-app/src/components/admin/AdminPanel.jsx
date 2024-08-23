import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { setHeaders, url } from '../../features/api';
import { FiUser, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { MdComment } from 'react-icons/md';
import Statistics from './Statistics';
import TransactionStatistics from './TransactionStatistics';

// admin panel
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
      <ContentWrapper>
        <SectionContainer>
        <Section>
        <SectionTitle><FiUser /> Users</SectionTitle>
        <UserCount>Number of users: {users.length}</UserCount> {/* הצגת כמות המשתמשים */}
        <UserList>
          {users.map((user) => (
            <UserItem key={user._id}>
              <UserIcon>
                <FiUser size={24} />
              </UserIcon>
              <UserDetails>
                <strong>{user.name}</strong> ({user.email})
                <CashBalance>Cash Balance: ${user.cashBalance.toFixed(2)}</CashBalance> {/* יתרת הכסף */}
              </UserDetails>
              <DeleteButton onClick={() => handleDeleteUser(user._id)}>
                <FiTrash2 size={20} />
              </DeleteButton>
            </UserItem>
          ))}
        </UserList>
      </Section>
          <Section>
            <SectionTitle><MdComment /> Comments</SectionTitle>
            <CommentList>
              {comments.map((comment) => (
                <CommentItem key={comment._id}>
                  <CommentHeader>
                    <CommentIcon>
                      <FiMessageSquare size={20} />
                    </CommentIcon>
                    <strong>{comment.user}</strong>
                    <CommentDate>{new Date(comment.date).toLocaleString()}</CommentDate>
                  </CommentHeader>
                  {comment.comment}
                  <DeleteButton onClick={() => handleDeleteComment(comment._id)}>
                    <FiTrash2 size={20} />
                  </DeleteButton>
                </CommentItem>
              ))}
            </CommentList>
          </Section>
        </SectionContainer>
        <StatisticsWrapper>
          <Statistics />
          <TransactionStatistics /> {/* גרף של עסקאות */}
        </StatisticsWrapper>
      </ContentWrapper>
    </AdminContainer>
  );
};

export default AdminPanel;

// Styled components
const AdminContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f3f4f6, #e2e8f0);
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  max-width: 1600px;
`;

const SectionContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const UserCount = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 1rem;
  text-align: right;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.02);
  }
`;
const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;
const CashBalance = styled.p`
  font-size: 14px;
  color: #555;
  margin-top: 0.5rem;
`;
const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.02);
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
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #c0392b;
    transform: scale(1.05);
  }
`;

const UserIcon = styled.div`
  background: #4caf50;
  padding: 0.5rem;
  border-radius: 50%;
  color: #fff;
`;

const CommentIcon = styled.div`
  background: #3498db;
  padding: 0.5rem;
  border-radius: 50%;
  color: #fff;
`;

const StatisticsWrapper = styled.div`
  flex: 1;
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
  text-align: center;
`;
