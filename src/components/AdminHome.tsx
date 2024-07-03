import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';
const AdminHome: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Admin Home</h2>
      <ul>
        {state.users.map(user => (
          <li key={user.uid}>
            <span>{user.name}</span> - <span>{user.email}</span> - <span>{user.role}</span>
            <button onClick={() => navigate(`/profile/${user.uid}`)}>View Profile</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHome;
