import React from 'react';
import { useSelector } from 'react-redux';

const UserGreeting = () => {
  const user = useSelector((state) => state.auth);

  return (
    <div className="greeting">
      {user ? <h1>Welcome back, {user.name}!</h1> : <h1>Welcome to Our Investment Platform!</h1>}
      <p>Get the latest market insights and manage your portfolio effectively.</p>
    </div>
  );
};

export default UserGreeting;
